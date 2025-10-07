# Mia Kids Educational Chatbot - AI Agent Instructions

## Project Overview
This is an **educational Story Book Creator chatbot for Malaysian Year 1-4 students**. The app is a **Vite + React single-page application** designed for deployment to **Vercel** as a static site with serverless functions.

Students can create interactive story books by building grammatically correct sentences with AI validation, generating custom illustrations, and downloading their completed stories as beautiful HTML files.

## Tech Stack & Architecture
- **Frontend**: React 18 + Vite (ESM modules)
- **Styling**: Tailwind CSS v3.3.6 (utility-first, inline classes with custom animations)
- **Deployment**: Vercel (static site + serverless API)
- **API**: Google Gemini 2.0 Flash for sentence validation, Google Imagen 3.0 for illustrations

## Project Structure
```
edu-story-book-makers/
├── src/
│   ├── App.jsx              # Main Story Book Creator component
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind CSS imports
├── api/
│   ├── validate-sentence.js # Gemini API for sentence validation
│   └── generate-image.js    # Imagen API for illustration generation
├── public/                  # Static assets
├── .github/
│   └── copilot-instructions.md
├── UI_DESIGN_SYSTEM.md      # Comprehensive design guidelines
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind + custom animations
├── vercel.json              # Vercel deployment config
├── .env.example             # Environment variable template
└── .gitignore
```


## Environment Variables & API Keys
- **Production (Vercel)**: Set `GENERATIVE_API_KEY` in Vercel environment variables (Project Settings → Environment Variables)
- **Local Development**: Create `.env.local` with `GENERATIVE_API_KEY=your_key_here`
- **Get API Key**: Visit https://aistudio.google.com/app/apikey to get your Google AI Studio API key

## Core Features
1. **Interactive Story Building**: Students build sentences using word banks or free text input
2. **AI Sentence Validation**: Gemini 2.0 Flash checks grammar, capitalization, and story context
3. **Custom Illustrations**: Imagen 3.0 generates child-friendly illustrations for each sentence
4. **Story Book Compilation**: Download complete stories as beautifully formatted HTML files
5. **Progress Tracking**: Visual progress indicators and encouraging feedback

## UI/UX Implementation (Following UI_DESIGN_SYSTEM.md)
- **Gradient Backgrounds**: Purple-pink-yellow gradients with floating elements
- **Emoji Avatars**: Teacher bot (👩‍🏫), student (👧), owl mascot (🦉)
- **Accessibility**: 72px touch targets, high contrast, ARIA labels, keyboard navigation
- **Animations**: Fade-in, bounce-slow, float, spin-slow (defined in tailwind.config.js)
- **Chat Interface**: Gradient bubbles with asymmetric tails and bordered avatars
- **Word Bank UI**: Clickable word chips for scaffolded sentence building

## Component Patterns & Conventions
- **No PropTypes or TypeScript**: Uses plain JSX with inline type assumptions
- **Utility-first Tailwind**: All styles inline via className (see `UI_DESIGN_SYSTEM.md` for comprehensive guidelines)
- **Custom animations**: Defined in `tailwind.config.js` (fade-in, float, bounce-slow, spin-slow)
- **Modern UI for ages 6-10**: Vibrant gradients, large touch targets (min 72px), rounded shapes, emoji avatars
- **Emoji UI elements**: Teacher bot (👩‍🏫), student (👧), owl (🦉) used consistently for visual identity
- **Button design**: 72px min-height, gradient backgrounds, 4px borders, scale animations (1.03x hover, 0.97x active)
- **Auto-scroll**: `chatEndRef` with smooth scrolling behavior
- **Story formatting**: AI-generated words wrapped in `**word**` format, styled with indigo color
- **Progress indicators**: Animated dots that scale and change color when completed

## API Architecture
- **Serverless Functions**: Located in `/api/` folder with ESM `export default` syntax
- **validate-sentence.js**: Handles Gemini 2.0 Flash API calls for grammar and context validation
- **generate-image.js**: Handles Imagen 3.0 API calls with retry logic and fallback placeholders
- **Error Handling**: Graceful degradation with placeholder images and helpful error messages
- **CORS**: Same-origin requests, no CORS configuration needed

## UI Design System
A comprehensive **UI Design System** is documented in `UI_DESIGN_SYSTEM.md` covering:
- 🌈 **Color Palette**: Primary colors, gradients, semantic colors
- 📝 **Typography**: Font sizes, weights, line heights
- 🧩 **Component Patterns**: Headers, chat bubbles, buttons, cards, loaders
- ✨ **Animations**: Keyframes, timing, usage guidelines
- 📐 **Spacing & Layout**: Containers, padding, margins, gaps
- ♿ **Accessibility**: ARIA labels, keyboard nav, color contrast, touch targets
- 🎭 **Emoji Usage**: Context-appropriate emoji selection
- 📱 **Responsive Design**: Mobile-first breakpoints

**Key UI Features**:
- Gradient backgrounds with animated floating elements
- Avatar circles: 48px with gradient fills and white borders
- Chat bubbles: Gradient backgrounds with 2px borders and asymmetric tails
- Buttons: 72px min height, gradient fills, 4px borders, scale animations
- Progress dots: Animated scale on completion (green-400)
- Loading states: Purple-pink gradient with spinning icon
- Question containers: Indigo gradient with thick borders

Refer to `UI_DESIGN_SYSTEM.md` when creating new components or features to maintain consistency.

## Developer Workflow
- **Local dev**: `npm run dev` (Vite default port 5173)
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview build**: `npm run preview --port 5173`
- **Deployment**: Push to GitHub → Vercel auto-deploys from `main` branch
- **No tests configured**: Manual testing only (target audience is non-technical educators)

## Vercel-Specific Considerations
- **Serverless functions**: Must be in `api/` folder with ESM `export default` syntax
- **Build detection**: Vercel auto-detects Vite (framework preset)
- **Environment vars**: Must be set in Vercel dashboard (Project → Settings → Environment Variables)
- **CORS**: Serverless function returns JSON directly (same origin, no CORS needed)
- **API timeouts**: Set to 30 seconds in vercel.json for image generation
- **Retry logic**: Implemented in both validation and image generation with exponential backoff

## Accessibility & UX Conventions
- All interactive elements have `aria-label` attributes
- Progress indicators with visual dots for young learners
- Large touch targets (min 72px height) for mobile/tablet use
- Auto-scroll ensures students don't lose context
- Positive reinforcement language in all feedback messages
- Keyboard navigation support with focus rings
- High contrast ratios for readability
- Screen reader compatibility

## Common Pitfalls to Avoid
- Don't add TypeScript or prop validation (project deliberately simple)
- Don't extract Tailwind classes to separate files (all inline per project style)
- Don't modify the STEPS array without preserving `questionId` continuity
- Don't expose API keys in client code (always proxy through serverless function)
- Don't use CommonJS syntax (`require`) - project is ESM-only (`"type": "module"` in package.json)
- Don't skip error handling in API calls - always provide fallbacks

## Educational Context
The app teaches Malaysian Year 1-4 students (ages 6-10) about:
- **Sentence Structure**: Subject + Verb + Object patterns
- **Grammar Rules**: Capitalization, punctuation, word order
- **Vocabulary**: Age-appropriate words in naming, describing, and action categories
- **Creative Writing**: Building coherent stories with proper sequence
- **Digital Literacy**: Using technology tools for learning and creation

## Deployment Instructions
1. **Setup Repository**: Push code to GitHub repository
2. **Connect to Vercel**: Import project in Vercel dashboard
3. **Set Environment Variable**: Add `GENERATIVE_API_KEY` in Project Settings → Environment Variables
4. **Deploy**: Vercel auto-deploys on push to main branch
5. **Test**: Verify sentence validation and image generation work correctly

## UI/UX Design Philosophy
The interface is designed specifically for young learners with:
- **High Engagement**: Bright gradients, animations, emoji avatars create playful atmosphere
- **Clear Hierarchy**: Large text (18px+ body, 24px headings), obvious interactive elements
- **Accessibility**: 72px min touch targets, high contrast ratios, ARIA labels, keyboard navigation
- **Positive Reinforcement**: Soft error colors (orange/rose gradients), encouraging language
- **Visual Feedback**: Animations on every interaction, loading states, progress visualization

See `UI_DESIGN_SYSTEM.md` for complete design guidelines.
