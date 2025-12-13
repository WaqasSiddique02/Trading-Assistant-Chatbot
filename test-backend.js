// Test script to check backend connectivity
// Run with: node test-backend.js

const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('Testing backend at:', BACKEND_URL);
  console.log('-----------------------------------\n');

  // Test 1: Basic connectivity
  console.log('Test 1: Checking if backend is reachable...');
  try {
    const response = await axios.get(BACKEND_URL, { timeout: 5000 });
    console.log('✅ Backend is reachable');
    console.log('Response:', response.status, response.statusText);
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
  }
  console.log('');

  // Test 2: Test /query endpoint with your format
  console.log('Test 2: Testing /query endpoint...');
  try {
    const response = await axios.post(
      `${BACKEND_URL}/query`,
      { query: 'What is the current BTC price?' },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );
    console.log('✅ /query endpoint works!');
    console.log('Status:', response.status);
    console.log('Response keys:', Object.keys(response.data));
    console.log('Full response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ /query endpoint failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status text:', error.response.statusText);
      console.log('Error data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
  console.log('');

  // Test 3: Try alternative payload formats
  console.log('Test 3: Testing alternative payload formats...');
  const testPayloads = [
    { message: 'What is the current BTC price?' },
    { question: 'What is the current BTC price?' },
    { text: 'What is the current BTC price?' },
    'What is the current BTC price?', // Direct string
  ];

  for (const [index, payload] of testPayloads.entries()) {
    try {
      console.log(`Trying payload ${index + 1}:`, JSON.stringify(payload));
      const response = await axios.post(
        `${BACKEND_URL}/query`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
      console.log(`✅ Payload ${index + 1} works! Status:`, response.status);
    } catch (error) {
      console.log(`❌ Payload ${index + 1} failed:`, error.response?.status || error.message);
    }
  }
}

testBackend().catch(console.error);
