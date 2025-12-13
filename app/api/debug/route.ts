import { NextResponse } from 'next/server';
import axios from 'axios';

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5000';

export async function GET() {
  const testPayloads = [
    { query: 'test message' },
    { message: 'test message' },
    { question: 'test message' },
    { text: 'test message' },
    { q: 'test message' },
  ];

  const results = [];

  // Test 1: Check if backend is reachable
  try {
    const response = await axios.get(CHATBOT_API_URL, { timeout: 5000 });
    results.push({
      test: 'Backend reachable',
      status: 'success',
      statusCode: response.status,
    });
  } catch (error) {
    results.push({
      test: 'Backend reachable',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 2: Try different payload formats
  for (const [index, payload] of testPayloads.entries()) {
    try {
      const response = await axios.post(
        `${CHATBOT_API_URL}/query`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );
      
      results.push({
        test: `Payload format ${index + 1}`,
        payload: JSON.stringify(payload),
        status: 'success',
        statusCode: response.status,
        responseKeys: Object.keys(response.data),
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        results.push({
          test: `Payload format ${index + 1}`,
          payload: JSON.stringify(payload),
          status: 'failed',
          statusCode: error.response?.status,
          error: error.response?.data || error.message,
        });
      } else {
        results.push({
          test: `Payload format ${index + 1}`,
          payload: JSON.stringify(payload),
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  return NextResponse.json({
    backendUrl: CHATBOT_API_URL,
    results,
    recommendation: 'Look for the payload format with status: success',
  });
}
