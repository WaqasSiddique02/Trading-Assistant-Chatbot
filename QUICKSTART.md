# 🚀 Quick Start Guide - Trading Bot Assistant

## ⚡ Quick Setup (5 minutes)

### Step 1: Add MongoDB Connection String

1. Open the file: `.env.local`
2. Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas URI

**To get your MongoDB URI:**
- Visit: https://www.mongodb.com/cloud/atlas/register
- Create a FREE account (no credit card required)
- Create a FREE cluster (M0 tier)
- Click "Connect" → "Connect your application"
- Copy the connection string
- Replace `<username>` and `<password>` with your credentials

Your `.env.local` should look like:
```env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/tradingbot?retryWrites=true&w=majority
CHATBOT_API_URL=http://localhost:5000
```

### Step 2: Make Sure Your Trading Bot Server is Running

Your backend server should be running on `http://localhost:5000` with a `/query` endpoint that accepts POST requests.

Example backend request/response:
```bash
# Request
POST http://localhost:5000/query
Content-Type: application/json

{
  "query": "What's the current BTC price?"
}

# Response
{
  "answer": "Based on the recent market data...",
  "context": [...],
  "market_data": {...},
  "status": "success",
  "timestamp": "..."
}
```

### Step 3: Start the Frontend

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

## 🎉 You're Done!

You should now see a beautiful chat interface where you can:
- Ask questions about crypto markets
- Get real-time BTC and ETH prices
- View market charts and trends
- Access your chat history across sessions

## 🔍 Features Tour

### 1. Send a Message
Type any question in the input box at the bottom and press Enter or click the send button.

**Try these examples:**
- "What's the current price of Bitcoin?"
- "Should I buy or sell ETH?"
- "Show me the latest market trends"
- "What's happening in crypto news?"

### 2. View Market Data
When the bot responds with market data, you'll see:
- Current BTC and ETH prices
- Beautiful color-coded cards
- Interactive charts
- Timestamp for each price

### 3. See Context & Sources
Each response shows:
- The bot's answer
- Context from market data
- News sources
- Historical price information

### 4. Loading Animation
While waiting for a response, enjoy:
- Animated loading indicator
- Progress bar (0-100%)
- Dynamic status messages
- Estimated completion time

### 5. Clear History
Click the "Clear History" button in the header to delete all chat history for your session.

## 🎨 Screenshots

The app features:
- **Modern gradient backgrounds** (blue, purple, pink)
- **Professional card-based design**
- **Smooth animations and transitions**
- **Responsive layout** (works on mobile, tablet, desktop)
- **Dark mode support** (automatic based on system preference)

## 🐛 Troubleshooting

### Issue: "Failed to connect to MongoDB"
**Solution:**
1. Check your `.env.local` file has the correct MongoDB URI
2. Go to MongoDB Atlas → Network Access → Add IP Address → Add "0.0.0.0/0" (allow from anywhere)
3. Verify your database username and password

### Issue: "Failed to get response from trading bot"
**Solution:**
1. Make sure your backend is running: `http://localhost:5000`
2. Test your backend directly:
   ```bash
   curl -X POST http://localhost:5000/query -H "Content-Type: application/json" -d "{\"query\":\"test\"}"
   ```
3. Check the browser console (F12) for detailed error messages

### Issue: "Cannot find module" or build errors
**Solution:**
```bash
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Clear Next.js cache
Remove-Item -Recurse -Force .next
npm run build
```

### Issue: "Port 3000 is already in use"
**Solution:**
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `CHATBOT_API_URL` | Your trading bot backend URL | `http://localhost:5000` |

## 🔐 Security Notes

- Never commit your `.env.local` file to git (it's already in `.gitignore`)
- Keep your MongoDB credentials secure
- Use environment-specific URLs for production

## 📞 Need Help?

Common issues and solutions:
1. **White screen**: Check browser console for errors
2. **No response**: Verify backend is running and accessible
3. **Database errors**: Double-check MongoDB connection string
4. **Build fails**: Delete `.next` folder and rebuild

## 🎯 Next Steps

1. **Customize the design**: Edit components in the `components/` folder
2. **Add more features**: Create new components or API routes
3. **Deploy to production**: Use Vercel, Netlify, or any Node.js hosting
4. **Add authentication**: Integrate NextAuth.js for user login

## 📚 Tech Stack Reference

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: MongoDB Atlas
- **Charts**: Recharts
- **Icons**: Lucide React

Enjoy your new Trading Bot Assistant! 🚀
