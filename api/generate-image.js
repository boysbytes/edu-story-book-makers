export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt parameter' });
    }

    const apiKey = process.env.GENERATIVE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    const maxRetries = 3;
    let delay = 1000;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const payload = { 
          instances: { prompt: prompt }, 
          parameters: { sampleCount: 1, aspectRatio: "4:3" } 
        };
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          if (response.status === 429 || response.status >= 500) {
            if (attempt < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, delay));
              delay *= 2;
              continue;
            }
          }
          throw new Error(`Imagen API error: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
          const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
          return res.status(200).json({ imageUrl });
        } else {
          throw new Error("Missing image data in successful response.");
        }

      } catch (e) {
        console.warn(`Image generation attempt ${attempt + 1} failed:`, e);
        if (attempt === maxRetries - 1) {
          // Return placeholder indicator on final failure
          return res.status(200).json({ imageUrl: null });
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
    
    // Fallback
    res.status(200).json({ imageUrl: null });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(200).json({ imageUrl: null });
  }
}