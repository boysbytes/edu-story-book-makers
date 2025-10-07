# 📚 Story Book Creator - Educational Chatbot

This chatbot is used in Project C of AI Toolkit for Students.

An interactive story book creation app for Malaysian Year 1-4 students (ages 6-10). Students build grammatically correct sentences with AI validation and generate custom illustrations for their stories.

Vercel page: https://vercel.com/boysbytes-projects/edu-story-book-makers

## 🌟 Features

- **Interactive Sentence Building**: Word bank scaffolding + free text input
- **AI Grammar Validation**: Real-time feedback using Google Gemini 2.0 Flash
- **Custom Illustrations**: AI-generated images using Google Imagen 3.0
- **Story Book Download**: Export complete stories as beautiful HTML files
- **Progressive Learning**: Visual progress tracking and encouraging feedback
- **Accessibility**: Large touch targets, high contrast, screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google AI Studio API key ([get one here](https://aistudio.google.com/app/apikey))

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd edu-story-book-makers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GENERATIVE_API_KEY
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🚀 Deploy to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**: Commit your code to a GitHub repository

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variable**:
   - In Vercel dashboard: Project Settings → Environment Variables
   - Add: `GENERATIVE_API_KEY` = `your_google_ai_studio_api_key`

4. **Deploy**: Vercel automatically builds and deploys your app

### Option 2: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
# Follow the prompts
vercel env add GENERATIVE_API_KEY
# Paste your API key when prompted
vercel --prod
```

## 📺 Embedding in Iframes

This app is designed to be embedded in iframes for integration into learning management systems or educational platforms.

### Recommended Iframe Configuration

**Height**: `900px` (provides space for header, chat interface, and growing content)

**Example HTML**:
```html
<iframe 
  src="https://your-app-url.vercel.app" 
  width="100%" 
  height="900px" 
  frameborder="0"
  title="Story Book Creator">
</iframe>
```

### Why 900px?

- **Header Section**: ~120px (mascot, title, progress indicators)
- **Main Content**: ~600px (chat interface with scrollable area, input section)
- **Story Preview**: Variable height (grows as sentences are completed)
- **Spacing**: ~80px (padding and margins)
- **Dynamic Growth**: Accommodates expanding chat history and story content

### Technical Notes

- **CORS**: Already configured for same-origin embedding
- **Responsive**: Adapts to iframe width while maintaining touch-friendly design
- **CSP**: `frame-ancestors *` allows embedding from any domain
- **Mobile-Friendly**: 72px minimum touch targets for tablet use

## 🎨 UI Design System

This app follows a comprehensive design system optimized for young learners:

- **Colors**: Purple-pink-yellow gradients with high contrast
- **Typography**: Inter font, 18px+ minimum size, bold headings
- **Interactions**: 72px minimum touch targets, scale animations
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

See [`UI_DESIGN_SYSTEM.md`](./UI_DESIGN_SYSTEM.md) for complete guidelines.

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom animations
- **APIs**: Google Gemini 2.0 Flash + Google Imagen 3.0
- **Deployment**: Vercel (static site + serverless functions)

## 📂 Project Structure

```
edu-story-book-makers/
├── src/
│   ├── App.jsx              # Main React component
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind imports
├── api/
│   ├── validate-sentence.js # Gemini API for validation
│   └── generate-image.js    # Imagen API for illustrations
├── public/                  # Static assets
├── UI_DESIGN_SYSTEM.md      # Design guidelines
├── package.json             # Dependencies & scripts
├── tailwind.config.js       # Custom animations
├── vercel.json              # Deployment config
└── .env.example             # Environment template
```

## 🔧 Configuration

### Tailwind CSS
Custom animations defined in `tailwind.config.js`:
- `animate-fade-in`: Smooth content transitions
- `animate-bounce-slow`: Mascot animations
- `animate-spin-slow`: Loading indicators
- `animate-float`: Background decorations

### Vercel Functions
- **Timeout**: 30 seconds for image generation
- **Runtime**: Node.js (ESM modules)
- **CORS**: Same-origin, no additional config needed

## 🧪 Testing

### Manual Testing Checklist
- [ ] Sentence validation with correct/incorrect grammar
- [ ] Image generation and fallback placeholders
- [ ] Progress tracking and visual feedback
- [ ] Story book download functionality
- [ ] Mobile responsiveness (320px+)
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

### Accessibility Testing
```bash
# Test with Chrome Lighthouse
# Aim for 95+ accessibility score
```

## 🐛 Troubleshooting

### Common Issues

**API Key Error**
- Ensure `GENERATIVE_API_KEY` is set in Vercel environment variables
- Verify API key is valid at [Google AI Studio](https://aistudio.google.com)

**Image Generation Fails**
- App gracefully falls back to placeholder images
- Check API quota limits in Google Cloud Console

**Build Errors**
- Ensure Node.js 18+ is being used
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`

## 📚 Educational Features

### Learning Objectives
- **Grammar**: Capitalization, punctuation, sentence structure
- **Vocabulary**: Age-appropriate word categories (naming, describing, action)
- **Creative Writing**: Story sequence and narrative building
- **Digital Literacy**: Technology-assisted learning

### Scaffolding Support
- Word bank with clickable chips
- Real-time grammar feedback
- Visual progress indicators
- Encouraging, non-punitive error messages

## 🤝 Contributing

This project follows the educational guidelines in `.github/copilot-instructions.md`. When making changes:

1. Follow the UI Design System guidelines
2. Maintain accessibility standards
3. Test with young learners in mind
4. Keep language simple and encouraging

## 📄 License

MIT License - Feel free to adapt for educational use.

## 🎯 Target Audience

**Primary**: Malaysian Year 1-4 students (ages 6-10)
**Secondary**: ESL learners, special education, literacy support

---

Made with ❤️ for young learners everywhere! 🌟