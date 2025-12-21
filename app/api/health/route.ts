import { NextResponse } from 'next/server';
import axios from 'axios';

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const response = await axios.get(`${CHATBOT_API_URL}/health`, {
      timeout: 5000,
    });
    
    return NextResponse.json({
      status: 'healthy',
      backend: response.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
