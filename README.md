# ChatGPT Clone

A pixel-perfect ChatGPT clone built with React, TypeScript, Tailwind CSS, and OpenRouter API for real-time AI streaming responses.

## Features

- 🎨 **Beautiful UI** - Pixel-perfect replication of ChatGPT's interface
- 💬 **Real-time Streaming** - Live AI responses using OpenRouter API
- 💾 **Local Storage** - All chats saved locally in your browser
- 🌓 **Dark/Light Mode** - Toggle between themes
- 📝 **Markdown Support** - Full markdown rendering with syntax-highlighted code blocks
- 🔍 **Search Chats** - Quickly find your conversations
- ⌨️ **Keyboard Shortcuts** - Efficient navigation
- 📤 **Export/Import** - Backup and restore your chat history
- 🎯 **Chat Management** - Rename, delete, and organize conversations

## Keyboard Shortcuts

- `Ctrl+Enter` / `Cmd+Enter` - Send message
- `Ctrl+K` / `Cmd+K` - New chat
- `Ctrl+B` / `Cmd+B` - Toggle sidebar
- `Ctrl+Shift+L` / `Cmd+Shift+L` - Toggle theme

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd chatgpt-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure OpenRouter API Key

1. Get your API key from [OpenRouter](https://openrouter.ai/)
2. Open the `.env` file in the project root
3. Replace `-------------------` with your actual API key:

```env
VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

⚠️ **Important:** Never commit your `.env` file with real API keys to version control!

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variable:
   - Name: `VITE_OPENROUTER_API_KEY`
   - Value: Your OpenRouter API key
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variable:
   - Key: `VITE_OPENROUTER_API_KEY`
   - Value: Your OpenRouter API key
6. Deploy!

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx         # Left sidebar with chat history
│   ├── ChatWindow.tsx      # Main chat area
│   ├── Message.tsx         # Individual message component
│   └── Composer.tsx        # Message input component
├── store/
│   └── chatStore.ts        # Zustand store for state management
├── pages/
│   └── Index.tsx           # Main page
└── index.css               # Global styles and design system
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Zustand** - State management
- **OpenRouter API** - AI completions
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code highlighting

## Features in Detail

### Chat Management
- Create unlimited conversations
- Auto-generate chat titles from first message
- Rename any chat
- Delete individual chats
- Search through chat history

### Message Features
- Real-time streaming responses
- Markdown formatting
- Syntax-highlighted code blocks
- Copy button for code blocks
- Copy entire messages
- User/AI message distinction

### Data Persistence
- All chats saved to localStorage
- Export chat history as JSON
- Import previously exported chats
- Settings persisted across sessions

### UI/UX
- Smooth animations and transitions
- Responsive design (mobile-friendly)
- Collapsible sidebar
- Dark/light theme toggle
- Loading states
- Error handling

## Configuration

The app uses OpenRouter's API with the `anthropic/claude-3.5-sonnet` model by default. You can change the model in `src/components/ChatWindow.tsx`:

```typescript
model: 'anthropic/claude-3.5-sonnet', // Change to your preferred model
```

Available models: See [OpenRouter Models](https://openrouter.ai/models)

## Troubleshooting

### API Key Issues
- Make sure your `.env` file has the correct format
- Restart the dev server after changing environment variables
- Check that your OpenRouter API key is valid and has credits

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

### Chat Not Saving
- Check browser localStorage is enabled
- Try clearing localStorage and starting fresh
- Check browser console for errors

## License

MIT License - feel free to use this project for learning or production!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
