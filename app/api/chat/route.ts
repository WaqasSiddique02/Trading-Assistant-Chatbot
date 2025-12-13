import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';
import axios from 'axios';

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { message, sessionId } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Find or create chat session
    let chatSession = await ChatSession.findOne({ sessionId });
    
    if (!chatSession) {
      chatSession = new ChatSession({
        sessionId,
        messages: [],
      });
    }

    // Add user message
    chatSession.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Call the chatbot API
    console.log('Sending request to:', `${CHATBOT_API_URL}/query`);
    console.log('Request payload:', { question: message });
    console.log('Waiting for backend response (this may take a while)...');
    
    const response = await axios.post(
      `${CHATBOT_API_URL}/query`,
      { question: message },  // Backend expects "question" not "query"
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 180000, // 3 minute timeout for long-running queries (fetching market data, news, etc.)
      }
    );

    console.log('Backend response status:', response.status);
    console.log('Backend response data:', response.data);

    const botResponse = response.data;

    // Add assistant message
    chatSession.messages.push({
      role: 'assistant',
      content: botResponse.answer,
      timestamp: new Date(),
      context: botResponse.context,
      marketData: botResponse.market_data,
    });

    await chatSession.save();

    return NextResponse.json({
      success: true,
      response: botResponse,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Enhanced error logging
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:');
      console.error('- Status:', error.response?.status);
      console.error('- Data:', error.response?.data);
      console.error('- Headers:', error.response?.headers);
      console.error('- Request data:', error.config?.data);
      console.error('- Error code:', error.code);
      
      // Handle timeout specifically
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return NextResponse.json(
          { 
            error: 'Request timeout',
            details: 'The backend is taking longer than expected to process your request. This usually happens when:\n' +
                    '1. Fetching real-time market data\n' +
                    '2. Analyzing large amounts of news data\n' +
                    '3. Processing complex queries\n\n' +
                    'Please try again, or check if your backend is running properly.',
            timeout: true
          },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to process chat message',
          details: error.response?.data || error.message,
          status: error.response?.status,
          backendError: true
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process chat message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
