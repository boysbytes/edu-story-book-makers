import { useState, useEffect, useRef, useMemo } from 'react'

// ---------------- Word Banks (Kept for task config reference) ----------------
const WORD_BANKS = {
  naming: ["Rina", "bird", "garden", "water", "wing", "student", "day", "school"],
  describing: ["small", "blue", "kind", "happy", "sad", "brave", "hurt", "little"],
  action: ["loves", "sees", "says", "gives", "drinks", "looks", "smiles", "helps"]
};

// ---------------- Global Story Context (Source of Truth) ----------------
const STORY_CONTEXT = `
Rina is a Year 2 student. She loves animals.
One day, Rina sees a small bird in the school garden.
The bird has a blue wing. It looks sad.
Rina says, "Are you hurt, little bird?"
She gives the bird some water. The bird drinks.
The bird looks happy now!
Rina smiles. She says, "You are a brave bird!"
`;

// ---------------- Sentence Building Configuration ----------------
const SENTENCE_TASKS = [
  {
    id: 1,
    instruction: "Build Sentence 1: Tell us about Rina.",
    hint: "Your sentence must start with a capital letter and end with a period. Use a Naming Word, an Action Word, and maybe a Describing Word!",
    wordChoices: {
      naming: ["Rina", "student", "bird"],
      describing: ["kind", "brave", "happy"],
      action: ["is", "helps", "sees"]
    },
    imagePromptTemplate: "Full-colour, child-friendly cartoon of {sentence}. Malaysian primary school setting, Year 2 student, bright and cheerful, age-appropriate style, 3D render.",
    successMessage: "Wonderful sentence! Let me create a picture for you... ✨"
  },
  {
    id: 2,
    instruction: "Build Sentence 2: Tell us about the bird.",
    hint: "Remember capitalization and punctuation! How does the bird look or what does it have?",
    wordChoices: {
      naming: ["bird", "wing", "garden"],
      describing: ["small", "blue", "sad"],
      action: ["looks", "has", "is"]
    },
    imagePromptTemplate: "Full-colour, child-friendly cartoon of {sentence}. School garden setting, Malaysian primary school environment, gentle and caring mood, age-appropriate style, 3D render.",
    successMessage: "Beautiful sentence! Creating your picture... 🎨"
  },
  {
    id: 3,
    instruction: "Build Sentence 3: Tell us what happened.",
    hint: "Action words are important here! What did Rina do and how did the bird feel after?",
    wordChoices: {
      naming: ["Rina", "bird", "water"],
      describing: ["happy", "kind", "little"],
      action: ["gives", "helps", "smiles"]
    },
    imagePromptTemplate: "Full-colour, child-friendly cartoon of {sentence}. Malaysian primary school garden, showing caring interaction between girl and bird, happy and positive mood, age-appropriate style, 3D render.",
    successMessage: "Perfect sentence! Making your final picture... 🌟"
  }
];

// Helper words to always include in the on-screen bank
const HELPER_WORDS = ["a", "an", "the", "and", "but", "so"];

// ---------------- API Functions ----------------

/**
 * Checks grammar and contextual accuracy using Google Gemini API through Vercel function
 */
async function checkSentenceValidity(sentence, taskInstruction, storyContext) {
  try {
    const response = await fetch('/api/validate-sentence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sentence,
        taskInstruction,
        storyContext
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.warn('Sentence validation failed:', e);
    return { 
      shouldProceed: false, 
      feedback: "Something went wrong with the check. Please try again or fix your capitalization and context." 
    };
  }
}

/**
 * Generates an image using Google Imagen API through Vercel function
 */
async function generateStoryIllustration(prompt) {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.imageUrl || generateImagePlaceholder(prompt);
  } catch (e) {
    console.warn('Image generation failed:', e);
    return generateImagePlaceholder(prompt);
  }
}

/**
 * Generates a canvas-based placeholder image if API fails
 */
function generateImagePlaceholder(prompt, width = 768, height = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  
  // Set up background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#e0f2fe"); // light blue
  gradient.addColorStop(1, "#ddd6fe"); // light purple
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add some simple shapes for visual interest
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, 10 + Math.random() * 20, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add text
  ctx.fillStyle = "#1e293b"; // slate-800
  ctx.font = "bold 32px Inter, system-ui, sans-serif";
  ctx.fillText("Your Story Picture", 24, 50);
  ctx.font = "18px Inter, system-ui, sans-serif";
  
  // Wrap prompt text
  const words = prompt.split(" ");
  let line = "";
  let y = 90;
  const maxWidth = width - 48;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, 24, y);
      line = words[i] + " ";
      y += 26;
      if (y > height - 30) break;
    } else {
      line = testLine;
    }
  }
  if (y <= height - 30) ctx.fillText(line, 24, y);
  
  return canvas.toDataURL("image/png");
}

// ---------------- UI Components Following Design System ----------------

/**
 * Application Header - Following UI Design System
 */
function Header({ completedSentences, totalSentences }) {
  return (
    <div className="sticky top-0 z-20 backdrop-blur-md bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-orange-500/90 border-b-4 border-white shadow-xl">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/95 grid place-items-center text-3xl shadow-lg animate-bounce-slow">
            🦉
          </div>
          <div>
            <p className="text-2xl font-black leading-tight text-white">Story Book Maker</p>
            <p className="text-xs font-bold tracking-wide text-white/90 uppercase">Year 1-4 Students</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1" aria-label="Progress">
          <p className="text-xs font-bold text-white">Progress</p>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSentences }).map((_, i) => (
              <div
                key={i}
                className={
                  "w-4 h-4 rounded-full transition-all duration-300 shadow-md " + 
                  (i < completedSentences ? "bg-green-400 scale-125" : "bg-white/40")
                }
                title={`Page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Chat bubble for bot and user messages - Following UI Design System
 */
function ChatBubble({ children, type = 'bot', className = '' }) {
  const isBot = type === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in ${className}`}>
      {isBot && (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 border-3 border-white shadow-lg grid place-items-center text-2xl flex-shrink-0">
          👩‍🏫
        </div>
      )}
      <div className={`max-w-[72%] rounded-3xl px-6 py-5 shadow-2xl border-2 ${
        isBot 
          ? 'bg-gradient-to-br from-white to-blue-50 border-blue-200 ml-3 rounded-tl-none' 
          : 'bg-gradient-to-br from-green-100 to-emerald-200 border-green-300 mr-3 rounded-br-none'
      }`}>
        {children}
      </div>
      {!isBot && (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-300 to-emerald-400 border-3 border-white shadow-lg grid place-items-center text-2xl flex-shrink-0">
          👧
        </div>
      )}
    </div>
  );
}

/**
 * Renders bot message content with bold formatting for text between asterisks.
 */
const renderBotMessage = (content) => {
  const parts = content.split(/(\*.*?\*)/g);
  return (
    <p className="text-lg font-semibold leading-relaxed text-slate-900">
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*')
          ? <strong key={i} className="font-black text-indigo-900">{part.substring(1, part.length - 1)}</strong>
          : part
      )}
    </p>
  );
};

/**
 * Image Loading Component - Following UI Design System
 */
function ImageLoader() {
  return (
    <div className="mt-6 animate-fade-in">
      <div className="flex flex-col items-center justify-center h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-4 border-purple-300 shadow-xl">
        <svg className="w-12 h-12 text-purple-500 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-3 text-base font-black text-purple-700 text-center">
          🎨 Creating your picture...
        </p>
      </div>
    </div>
  );
}

/**
 * Story Book Display Component - Following UI Design System
 */
function StoryBookDisplay({ storyPages, onDownload, onCreateAnother }) {
  const allComplete = storyPages.length === SENTENCE_TASKS.length;

  if (storyPages.length === 0) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-white to-indigo-100 p-6 shadow-2xl border-4 border-indigo-300 text-center animate-fade-in">
        <p className="text-lg font-black text-indigo-900 mb-3">📖 Your Story Book</p>
        <p className="text-slate-600 font-semibold">No pages yet! Start building your first sentence!</p>
        <div className="mt-3 text-4xl animate-bounce-slow">👇</div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-white to-indigo-100 p-6 shadow-2xl border-4 border-indigo-300 animate-fade-in">
      <h3 className="text-xl font-black text-indigo-900 mb-4">
        {allComplete ? "🎉 Story Complete! 🎉" : "📖 Story In Progress"}
      </h3>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {storyPages.map((page, index) => (
          <div key={index} className="rounded-2xl bg-white p-4 shadow-lg border-2 border-indigo-200">
            <p className="text-xs font-bold text-indigo-700 mb-2">PAGE {index + 1}</p>
            {page.image && (
              <div className="mt-3 rounded-2xl overflow-hidden border-4 border-white shadow-2xl shadow-purple-300/60 bg-white transform hover:scale-[1.02] transition-transform">
                <img
                  src={page.image}
                  alt={`Page ${index + 1} illustration`}
                  className="w-full h-auto"
                />
              </div>
            )}
            <p className="mt-3 text-lg font-black text-slate-900 text-center">{page.sentence}</p>
          </div>
        ))}
      </div>

      {allComplete && (
        <div className="mt-6 space-y-3">
          <button 
            onClick={onDownload} 
            className="w-full rounded-2xl px-7 py-5 min-h-[72px] text-xl font-black transition-all duration-200 transform shadow-xl border-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-yellow-400"
          >
            📚 Download Story Book
          </button>
          <button 
            onClick={onCreateAnother} 
            className="w-full rounded-2xl px-7 py-5 min-h-[72px] text-xl font-black transition-all duration-200 transform shadow-xl border-4 bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-900 hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-yellow-400"
          >
            🔁 Start New Story
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Main Application Component - Following UI Design System
 */
export default function App() {
  // Conversation state
  const [phase, setPhase] = useState('welcome'); // welcome, building, validating, loading_image, complete
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  
  // Sentence construction state
  const [completedSentences, setCompletedSentences] = useState([]);
  const [inputText, setInputText] = useState('');

  // Image generation state
  const [loadingImage, setLoadingImage] = useState(false);

  // Refs
  const chatContainerRef = useRef(null);

  // Derived state
  const currentTask = useMemo(() => SENTENCE_TASKS[currentSentenceIndex], [currentSentenceIndex]);

  // Build the allowed word list for the current task (including helper words)
  const allowedWordsForTask = useMemo(() => {
    const task = SENTENCE_TASKS[currentSentenceIndex];
    if (!task) return [];
    const choices = [];
    Object.values(task.wordChoices || {}).forEach(arr => choices.push(...arr));
    return Array.from(new Set([...choices.map(w => String(w)), ...HELPER_WORDS])).sort();
  }, [currentSentenceIndex]);

  // --- Utility Functions ---

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (el) {
      setTimeout(() => {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth'
        });
      }, 100); 
    }
  };

  const addBotMessage = (content) => {
    setChatHistory(prev => [...prev, { type: 'bot', content }]);
  };

  const addUserMessage = (sentence) => {
    setChatHistory(prev => [...prev, { type: 'user', content: sentence }]);
  };

  // Word bank chip helper: append a word into the input (with spacing)
  const appendWordToInput = (word) => {
    setInputText(prev => {
      let nextText = prev.trim();
      return nextText ? nextText + ' ' + word : word;
    });
  };

  // --- Main Workflow Logic ---

  const startTask = (index) => {
    const task = SENTENCE_TASKS[index];
    if (!task) {
      setPhase('complete');
      addBotMessage("🎉 The story is complete! You did a fantastic job! Check your story book and click **'Download Story Book'** to save it! 📖");
      return;
    }
    setPhase('building');
    addBotMessage(`${task.instruction} 📝\n\n*HINT*: ${task.hint}`);
  };

  const handleSubmitSentence = async (submittedText) => {
    const sentence = submittedText.trim();
    if (sentence.length < 5) {
      addBotMessage("Please type a full sentence that says something meaningful! 😉");
      return;
    }

    setPhase('validating');
    addUserMessage(sentence);

    addBotMessage("Checking your sentence... Please wait for my feedback. 🧐");
    const { shouldProceed, feedback } = await checkSentenceValidity(sentence, currentTask.instruction, STORY_CONTEXT);
    addBotMessage(feedback);

    if (!shouldProceed) {
      setPhase('building');
      return;
    }

    // Success -> Generate Image
    addBotMessage(currentTask.successMessage);
    setPhase('loading_image');
    setLoadingImage(true);

    const imagePrompt = currentTask.imagePromptTemplate.replace('{sentence}', sentence);
    const imageUrl = await generateStoryIllustration(imagePrompt);
    
    setLoadingImage(false);
    
    const newPage = {
      id: currentTask.id,
      sentence: sentence,
      image: imageUrl,
      prompt: imagePrompt
    };
    
    setCompletedSentences(prev => [...prev, newPage]);
    
    addBotMessage(`Wonderful! 🖼️ This page is ready for your story book!`);
    setInputText('');
    setCurrentSentenceIndex(prev => prev + 1);
  };  

  // --- Side Effects ---

  useEffect(scrollToBottom, [chatHistory.length, loadingImage]);

  useEffect(() => {
    if (chatHistory.length === 0) {
      addBotMessage("Hello! I'm your Story Book Creator! 📚 We're going to build a story about **'The Kind Helper'** together.");
      addBotMessage("You can use words from the **word bank** below, or type your own words. Remember: **capitalization and punctuation are important!** Let's start!");
      
      setTimeout(() => startTask(0), 2000);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentSentenceIndex > 0 && currentSentenceIndex <= SENTENCE_TASKS.length) {
      startTask(currentSentenceIndex);
    }
  }, [currentSentenceIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Final Actions ---

  const handleDownloadStoryBook = () => {
    const storyTitle = "The Kind Helper - My Story Book";
    let content = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${storyTitle}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
          <style>
              body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #e0e7ff, #fce7f3, #fef3c7); padding: 20px; max-width: 800px; margin: 0 auto; min-height: 100vh; }
              .book-cover { text-align: center; padding: 50px; background: linear-gradient(135deg, #d8b4fe, #fbcfe8); border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); margin-bottom: 30px; border: 4px solid white; }
              .book-cover h1 { font-size: 3em; color: #6d28d9; margin: 0; font-weight: 900; }
              .book-cover p { font-size: 1.2em; color: #8b5cf6; font-weight: 700; }
              .page { margin-bottom: 40px; padding: 24px; background: linear-gradient(135deg, white, #e0f2fe); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 4px solid #a855f7; }
              .page-number { font-size: 0.9em; color: #6366f1; margin-bottom: 10px; text-align: right; font-weight: 700; }
              .sentence { font-size: 1.8em; font-weight: 900; color: #1e293b; margin-bottom: 20px; text-align: center; padding: 16px; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 16px; border: 2px solid #cbd5e1; }
              .illustration { width: 100%; max-width: 600px; height: auto; border-radius: 16px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); display: block; margin: 16px auto; border: 4px solid white; }
              .footer { text-align: center; margin-top: 40px; padding: 20px; color: #6366f1; font-weight: 700; }
          </style>
      </head>
      <body>
          <div class="book-cover">
              <h1>${storyTitle}</h1>
              <p>Created by Story Book Creator Bot 🤖</p>
              <p>For Malaysian Primary School Students</p>
          </div>
    `;

    completedSentences.forEach((page, index) => {
      content += `
        <div class="page">
          <p class="page-number">Page ${index + 1}</p>
          ${page.image ? `<img src="${page.image}" alt="Illustration for page ${index + 1}" class="illustration"/>` : ''}
          <p class="sentence">${page.sentence}</p>
        </div>
      `;
    });

    content += `
          <div class="footer">
              <p>🎉 The End! Great job creating your story! 🎉</p>
          </div>
      </body></html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'The_Kind_Helper_Story_Book.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addBotMessage("✅ Your story book download has started! Save your file and share your story! 🌟");
  };

  const handleCreateAnother = () => {
    setCurrentSentenceIndex(0);
    setChatHistory([]);
    setCompletedSentences([]);
    setLoadingImage(false);
    setPhase('welcome');
    setInputText('');
  };

  // --- UI Render ---

  const showInput = phase === 'building' || phase === 'validating';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 font-sans antialiased">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-yellow-300/30 to-orange-300/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-gradient-to-br from-blue-300/30 to-indigo-300/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-gradient-to-br from-green-300/30 to-emerald-300/30 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>

      <Header 
        completedSentences={completedSentences.length} 
        totalSentences={SENTENCE_TASKS.length}
      />
      
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Chat Area */}
          <div className="lg:w-2/3 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border-4 border-white">
            
            <div ref={chatContainerRef} className="max-h-96 overflow-y-auto space-y-6 mb-6">
              {chatHistory.map((msg, index) => (
                <ChatBubble key={index} type={msg.type}>
                  {msg.type === 'bot' ? renderBotMessage(msg.content) : 
                                         <p className="text-xl font-black text-slate-900">{msg.content}</p>}
                </ChatBubble>
              ))}

              {loadingImage && <ImageLoader />}
            </div>

            {/* Input Area Following Design System */}
            {showInput && (
              <div className="rounded-3xl bg-gradient-to-br from-white to-indigo-100 p-6 shadow-2xl border-4 border-indigo-300 animate-fade-in">
                <p className="text-indigo-900 font-black mb-4 text-2xl">
                  ❓ {currentTask?.instruction}
                </p>
                
                {/* Word Bank */}
                <div className="mb-4">
                  <p className="text-sm font-bold text-indigo-800 mb-2">Word Bank (click to add):</p>
                  <div className="flex flex-wrap gap-2">
                    {allowedWordsForTask.map((word, i) => (
                      <button 
                        key={i} 
                        onClick={() => appendWordToInput(word)} 
                        disabled={phase === 'validating'}
                        className="px-3 py-2 rounded-xl bg-white border-2 border-indigo-200 text-sm font-semibold shadow-md hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 font-medium">💡 Click words to add them, or type your own!</p>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => { 
                      if (e.key === 'Enter' && phase !== 'validating' && inputText.trim()) {
                        handleSubmitSentence(inputText); 
                      } 
                    }}
                    placeholder="Type your sentence here..."
                    disabled={phase === 'validating'}
                    className="flex-1 min-w-0 px-4 py-3 border-4 border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg font-semibold shadow-inner disabled:bg-gray-100 disabled:placeholder-gray-400"
                  />
                  <button
                    onClick={() => handleSubmitSentence(inputText)}
                    disabled={phase === 'validating' || !inputText.trim()}
                    className="flex-shrink-0 w-28 rounded-2xl py-3 min-h-[72px] text-xl font-black transition-all duration-200 transform shadow-xl border-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    ✨ Send
                  </button>
                </div>
              </div>
            )}

            {phase === 'complete' && (
              <div className="rounded-3xl bg-gradient-to-br from-green-100 to-emerald-200 p-6 shadow-2xl border-4 border-green-300 animate-fade-in text-center">
                <p className="text-2xl font-black text-green-900 mb-4">🎉 Story Complete! 🎉</p>
                <button 
                  onClick={handleCreateAnother} 
                  className="w-full rounded-2xl px-7 py-5 min-h-[72px] text-xl font-black transition-all duration-200 transform shadow-xl border-4 bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-900 hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-yellow-400"
                >
                  🔁 Start New Story
                </button>
              </div>
            )}
          </div>

          {/* Story Book Preview */}
          <div className="lg:w-1/3">
            <StoryBookDisplay 
              storyPages={completedSentences}
              onDownload={handleDownloadStoryBook}
              onCreateAnother={handleCreateAnother}
            />
          </div>
        </div>
      </main>
    </div>
  );
}