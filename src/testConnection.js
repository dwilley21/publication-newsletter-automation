require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to test Brevo API connection
async function testBrevoConnection() {
  console.log('Testing Brevo API connection...');
  
  // Check if .env file exists
  const envPath = path.resolve(process.cwd(), '.env');
  let envFileExists = false;
  let envFileContents = '';
  
  try {
    envFileExists = fs.existsSync(envPath);
    if (envFileExists) {
      envFileContents = fs.readFileSync(envPath, 'utf8');
      console.log('✅ .env file exists');
    } else {
      console.error('❌ .env file does not exist');
    }
  } catch (error) {
    console.error('❌ Error checking .env file:', error.message);
  }
  
  // Check if API key is set in environment variables
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: BREVO_API_KEY is not set in environment variables');
    
    if (envFileExists) {
      console.log('\nContents of .env file (showing only presence of key, not the actual value):');
      const lines = envFileContents.split('\n');
      for (const line of lines) {
        if (line.trim() === '') continue;
        
        const [key, value] = line.split('=');
        if (key === 'BREVO_API_KEY') {
          const valueLength = (value || '').length;
          console.log(`BREVO_API_KEY=${valueLength > 0 ? '********' : '[empty]'}`);
        } else {
          console.log(`${key}=********`);
        }
      }
      
      if (!envFileContents.includes('BREVO_API_KEY=')) {
        console.log('\nThe BREVO_API_KEY is not defined in your .env file.');
        console.log('Please add it in the following format:');
        console.log('BREVO_API_KEY=your_api_key_here');
      }
    } else {
      console.log('\nPlease create a .env file in the project root with the following content:');
      console.log('BREVO_API_KEY=your_api_key_here');
    }
    
    return false;
  }
  
  console.log('✅ BREVO_API_KEY is set in environment variables');
  
  // Mask the API key for logging
  const maskedKey = apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4);
  console.log(`API Key (masked): ${maskedKey}`);
  
  try {
    // Make a simple GET request to the Brevo API
    // We'll use the account endpoint which doesn't modify any data
    const response = await axios.get('https://api.brevo.com/v3/account', {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ Connection successful!');
    console.log('Account details:');
    console.log(`- Email: ${response.data.email}`);
    console.log(`- First Name: ${response.data.firstName}`);
    console.log(`- Last Name: ${response.data.lastName}`);
    console.log(`- Company: ${response.data.companyName}`);
    console.log(`- Plan: ${response.data.plan}`);
    return true;
  } catch (error) {
    console.error('\n❌ Connection failed!');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error(`Error message: ${JSON.stringify(error.response.data)}`);
      
      if (error.response.status === 401) {
        console.error('\nAuthentication failed. Please check your API key.');
        console.error('Make sure you are using the correct API key from your Brevo account.');
        console.error('You can find your API key in your Brevo account under:');
        console.error('  Settings > SMTP & API > API Keys');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error: ${error.message}`);
    }
    
    return false;
  }
}

// Run the test
testBrevoConnection()
  .then(result => {
    if (!result) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 