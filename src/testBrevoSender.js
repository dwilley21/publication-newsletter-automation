require('dotenv').config();
const { sendToBrevo } = require('./brevoSender');

// Mock data for testing
const mockJsonData = [
  {
    "Publication Name": "Tech Weekly",
    "Subject": "Latest Tech News",
    "Description": "Weekly technology newsletter",
    "sender": "tech@example.com",
    "HTML": "<h1>Tech Weekly</h1><p>Here are the latest tech updates.</p>"
  },
  {
    "Publication Name": "Finance Monthly",
    "Subject": "Market Updates",
    "Description": "Monthly financial insights",
    "sender": "finance@example.com",
    "HTML": "<h1>Finance Monthly</h1><p>This month's financial highlights.</p>"
  }
];

// Function to test the Brevo sender with mock data
async function testBrevoSender() {
  console.log('🧪 Testing Brevo Sender with mock data');
  console.log('======================================');
  
  try {
    // Check if API key is set
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not set in environment variables');
    }
    
    console.log('✅ API key found in environment variables');
    console.log(`\n📋 Test data: ${mockJsonData.length} campaigns`);
    
    for (const entry of mockJsonData) {
      console.log(`- ${entry['Publication Name']}: ${entry['Subject']}`);
    }
    
    // Ask for confirmation before proceeding
    console.log('\n⚠️  WARNING: This will create REAL campaigns in your Brevo account.');
    console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');
    
    // Wait for 5 seconds to give time to cancel
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n🚀 Proceeding with campaign creation...');
    
    // Send the data to Brevo
    const result = await sendToBrevo(mockJsonData);
    
    console.log('\n🎉 Test completed successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    return true;
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error(`Error: ${error.message}`);
    return false;
  }
}

// Run the test
testBrevoSender()
  .then(result => {
    if (!result) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 