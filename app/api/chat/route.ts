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
        timeout: 240000, // 4 minute timeout (matches backend LLM timeout)
      }
    );

    console.log('Backend response status:', response.status);
    console.log('Backend response data:', response.data);

    const botResponse = response.data;

    // Validate response structure
    if (!botResponse || !botResponse.answer) {
      throw new Error('Invalid response from backend');
    }

    // Add assistant message - ONLY store essential data, not context/marketData/graphData
    // These are large and don't need persistence (they're regenerated on each query)
    chatSession.messages.push({
      role: 'assistant',
      content: botResponse.answer,
      timestamp: new Date(),
    });

    await chatSession.save();

    return NextResponse.json({
      success: true,
      response: {
        answer: botResponse.answer,
        context: botResponse.context || [],
        market_data: botResponse.market_data,
        graph_data: botResponse.graph_data,
        status: botResponse.status || 'success',
        timestamp: botResponse.timestamp,
      },
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
            success: false,
            error: 'Request timeout',
            details: 'The AI model took longer than 4 minutes to respond. This can happen with:\n' +
                    '• Complex market analysis requests\n' +
                    '• Heavy backtest queries\n' +
                    '• Multiple data sources being analyzed\n\n' +
                    'Try simplifying your question or ask again.',
            timeout: true
          },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to process chat message',
          details: error.response?.data || error.message,
          status: error.response?.status,
          backendError: true
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process chat message', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
