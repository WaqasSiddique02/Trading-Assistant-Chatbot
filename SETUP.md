# Trading Bot Assistant - Frontend

A professional, modern chatbot frontend for your trading bot with real-time market insights, AI-powered recommendations, and comprehensive chat history management.

## ✨ Features

- **🤖 AI-Powered Chat Interface**: Interactive chatbot with intelligent responses
- **📊 Real-Time Market Data**: Live cryptocurrency prices for BTC and ETH
- **📈 Data Visualization**: Beautiful charts and graphs using Recharts
- **💾 Chat History**: Persistent storage using MongoDB Atlas
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **🌓 Dark Mode Support**: Automatic dark/light theme support
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **⚡ Loading States**: Beautiful loading animations with progress indicators
- **🔍 Context Display**: Shows sources and market context for each response

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB Atlas account (free tier works fine)
- Your trading bot server running on `http://localhost:5000`

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd tradingbot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Edit the `.env.local` file and add your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tradingbot?retryWrites=true&w=majority
   CHATBOT_API_URL=http://localhost:5000
   ```

   **To get your MongoDB URI:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (if you haven't already)
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database credentials

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
tradingbot/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Chat API endpoint
│   │   └── history/
│   │       └── route.ts           # History API endpoint
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── ChatInterface.tsx          # Main chat component
│   ├── LoadingMessage.tsx         # Loading animation
│   ├── MarketChart.tsx            # Market data visualization
│   └── Message.tsx                # Individual message component
├── lib/
│   ├── mongodb.ts                 # MongoDB connection
│   └── utils.ts                   # Utility functions
├── models/
│   └── ChatSession.ts             # MongoDB schema
└── .env.local                     # Environment variables
```

## 🎨 Features Breakdown

### Chat Interface
- Send messages to the trading bot
- View real-time responses with context
- Automatic session management with localStorage
- Clear chat history functionality

### Loading States
The app shows intelligent loading messages:
1. "Connecting to trading bot..."
2. "Fetching market data..."
3. "Analyzing news data..."
4. "Fetching past user trends..."
5. "Processing request..."
6. "Generating response..."

Each with a beautiful progress bar showing completion percentage.

### Market Data Display
- Live BTC and ETH prices
- Visual charts using Recharts
- Color-coded badges for different cryptocurrencies
- Timestamp for each price update

### Chat History
- Automatically saved to MongoDB Atlas
- Persists across sessions
- Can be cleared with one click
- Organized by session ID

## 🔧 Configuration

### MongoDB Schema
The app stores chat sessions with the following structure:
```typescript
{
  sessionId: string,
  messages: [{
    role: 'user' | 'assistant',
    content: string,
    timestamp: Date,
    context?: string[],
    marketData?: {
      BTCUSDT?: { price, symbol, timestamp },
      ETHUSDT?: { price, symbol, timestamp }
    }
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

**POST /api/chat**
- Sends message to trading bot
- Saves chat history to MongoDB
- Returns bot response with market data and context

**GET /api/history?sessionId={id}**
- Retrieves chat history for a session

**DELETE /api/history?sessionId={id}**
- Clears chat history for a session

## 🎯 Usage Examples

Try asking:
- "What's the current price of BTC?"
- "Should I buy or sell ETH?"
- "Show me market trends"
- "Latest crypto news?"
- "Compare BTC and ETH prices"

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Database**: MongoDB with Mongoose
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### "Failed to connect to MongoDB"
- Check your MongoDB URI in `.env.local`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify your database credentials

### "Failed to get response from trading bot"
- Ensure your trading bot server is running on `http://localhost:5000`
- Check that the `/query` endpoint is working
- Verify CORS settings on your backend

### "Module not found" errors
- Run `npm install` to install all dependencies
- Clear `.next` folder: `rm -rf .next`
- Restart the development server

## 🎨 Customization

### Colors
The app uses a beautiful gradient color scheme. To customize:
- Edit color variables in `app/globals.css`
- Modify gradient classes in components (e.g., `from-blue-600 to-purple-600`)

### Components
All UI components are in the `components/` directory and can be easily customized.

## 📝 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts by [Recharts](https://recharts.org/)
- Icons by [Lucide](https://lucide.dev/)
