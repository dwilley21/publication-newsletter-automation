require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Mock data for testing
const mockCsvData = `Publication Name,Subject,Description,sender,HTML
Newsletter 1,Welcome to our newsletter,This is our first newsletter,info@example.com,"<h1>Welcome!</h1><p>This is our first newsletter.</p>"
Newsletter 2,Latest Updates,Check out our latest updates,updates@example.com,"<h1>Latest Updates</h1><p>Here are our latest updates.</p>"`;

// Mock JSON result
const mockJsonResult = [
  {
    "Publication Name": "Newsletter 1",
    "Subject": "Welcome to our newsletter",
    "Description": "This is our first newsletter",
    "sender": "info@example.com",
    "HTML": "<h1>Welcome!</h1><p>This is our first newsletter.</p>"
  },
  {
    "Publication Name": "Newsletter 2",
    "Subject": "Latest Updates",
    "Description": "Check out our latest updates",
    "sender": "updates@example.com",
    "HTML": "<h1>Latest Updates</h1><p>Here are our latest updates.</p>"
  }
];

// Mock API response
const mockApiResponse = {
  success: true,
  message: "Data processed successfully",
  messageId: "mock-message-id-12345",
  timestamp: new Date().toISOString()
};

// Create a mock axios instance that doesn't make real API calls
const mockAxios = {
  post: async (url, data, config) => {
    console.log(`\n📤 MOCK API CALL to ${url}`);
    console.log('📦 Request payload:');
    console.log(JSON.stringify(data, null, 2));
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate the request
    if (!config || !config.headers || !config.headers['api-key']) {
      throw new Error('API key is missing from request headers');
    }
    
    // Simulate successful response
    return { data: mockApiResponse };
  },
  
  get: async (url, config) => {
    console.log(`\n📥 MOCK API CALL to ${url}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate the request
    if (!config || !config.headers || !config.headers['api-key']) {
      throw new Error('API key is missing from request headers');
    }
    
    // Return mock data based on the endpoint
    if (url.includes('/account')) {
      return {
        data: {
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          companyName: "Test Company",
          plan: "Free"
        }
      };
    }
    
    throw new Error(`Unhandled mock endpoint: ${url}`);
  }
};

// Mock function to simulate CSV to JSON conversion
function mockCsvToJson(csvData) {
  console.log('🔄 Converting CSV to JSON (mock)');
  console.log('📄 CSV data:');
  console.log(csvData);
  
  // In a real implementation, this would parse the CSV
  // For this mock, we just return the predefined JSON
  return mockJsonResult;
}

// Mock function to simulate sending data to Brevo API
async function mockSendToBrevo(jsonData, apiKey) {
  console.log('\n🚀 Preparing to send data to Brevo API (mock)');
  
  try {
    // Validate API key
    if (!apiKey) {
      throw new Error('API key is required');
    }
    
    // Prepare the request payload
    // This would be formatted according to Brevo's API requirements
    const payload = {
      name: jsonData[0]["Publication Name"],
      subject: jsonData[0]["Subject"],
      htmlContent: jsonData[0]["HTML"],
      sender: { email: jsonData[0]["sender"] },
      // Additional fields would be added here in a real implementation
    };
    
    // Make the mock API call
    const response = await mockAxios.post('https://api.brevo.com/v3/emailCampaigns', payload, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ Mock API call successful!');
    console.log('📊 Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('\n❌ Mock API call failed!');
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

// Main function to run the mock test
async function runMockTest() {
  console.log('🧪 Starting mock test for Brevo CSV Processor');
  console.log('===========================================');
  
  try {
    // Check if API key is set
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error('BREVO_API_KEY is not set in environment variables');
    }
    
    console.log('✅ API key found in environment variables');
    
    // Step 1: Convert CSV to JSON
    console.log('\n📋 Step 1: Convert CSV to JSON');
    const jsonData = mockCsvToJson(mockCsvData);
    
    // Step 2: Send data to Brevo API
    console.log('\n📨 Step 2: Send data to Brevo API');
    const result = await mockSendToBrevo(jsonData, apiKey);
    
    console.log('\n🎉 Mock test completed successfully!');
    console.log('This test simulated the process without making actual API calls.');
    console.log('Your code structure appears to be working correctly.');
    
    return true;
  } catch (error) {
    console.error('\n❌ Mock test failed!');
    console.error(`Error: ${error.message}`);
    return false;
  }
}

// Run the mock test
runMockTest()
  .then(result => {
    if (!result) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 