# AI Assistant Chat Application

A modern, real-time chat application powered by AI, built with React, TypeScript, and Tailwind CSS. This application features a beautiful bilingual (English/Persian) interface with real-time streaming responses, code highlighting, and Google authentication.

![AI Assistant Preview](https://your-screenshot-url.png)

## 🌟 Features

- **Real-time AI Responses**: Streaming responses from GROQ API with llama-3.2-90b model
- **Bilingual Support**: Automatic RTL/LTR text direction for Persian and English
- **Authentication**: Secure Google OAuth 2.0 authentication
- **Dark Mode**: Automatic and manual dark mode switching
- **Code Highlighting**: Syntax highlighting for multiple programming languages
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Chat Sessions**: Multiple chat sessions with history management
- **Auto-scroll**: Automatic scrolling to latest messages
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Google OAuth 2.0
- **AI Integration**: GROQ API
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Code Highlighting**: PrismJS
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Platform account for OAuth
- GROQ API key

## 🚀 Getting Started

1. **Clone the repository**

bash
git clone https://github.com/yourusername/ai-assistant-chat.git
cd ai-assistant-chat

2. **Install dependencies**

ash
npm install


3. **Environment Setup**

Create a `.env` file in the root directory:

env
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id


4. **Start Development Server**


bash
npm run dev


## 🏗️ Project Structure

src/
├── components/ # Reusable UI components
├── contexts/ # React context providers
├── lib/ # Utility functions and API clients
├── pages/ # Main application pages
├── types/ # TypeScript type definitions
└── main.tsx # Application entry point


## 🔑 Key Components

### Authentication (AuthContext)


typescript:src/contexts/AuthContext.tsx
startLine: 1
endLine: 57


### Chat Interface


typescript:src/components/ChatMessage.tsx
startLine: 1
endLine: 105


## 🔒 Security Features

- Secure Google OAuth 2.0 implementation
- Environment variable protection
- XSS prevention through React's built-in protections
- CORS-protected API endpoints

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Smooth transitions and animations
- Intuitive chat interface
- Real-time typing indicators
- Error feedback system
- Loading states and indicators

## 📝 API Integration

The application integrates with GROQ's API for AI responses:

typescript:src/lib/api.ts
startLine: 16
endLine: 100


## 🌐 Deployment

This application can be deployed to various platforms:

1. **Vercel**

bash
vercel deploy


2. **Netlify**


bash
netlify deploy



3. **Docker**


dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]




## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- GROQ for providing the AI API
- Google Cloud Platform for OAuth services
- The React and TypeScript communities
- All contributors and users of this project

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/bananbenbadr) - banan.badr@gmail.com

Project Link: [GitHub]([https://github.com/yourusername/ai-assistant-chat](https://github.com/realBenBadr/simple-90B-ChatBot-with-Groq))
