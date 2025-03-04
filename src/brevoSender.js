require('dotenv').config();
const axios = require('axios');

/**
 * Sends campaign data to Brevo API
 * @param {Array} jsonData - The JSON data from CSV conversion
 * @returns {Promise<Object>} - The API response
 */
async function sendToBrevo(jsonData) {
  if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
    throw new Error('Invalid JSON data: Data must be a non-empty array');
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not set in environment variables');
  }

  // Get current month and year for campaign name
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  try {
    const results = [];

    // Process each entry in the JSON data
    for (const entry of jsonData) {
      // Validate required fields
      if (!entry['Publication Name']) {
        throw new Error('Missing required field: Publication Name');
      }
      if (!entry['Subject']) {
        throw new Error('Missing required field: Subject');
      }
      if (!entry['sender']) {
        throw new Error('Missing required field: sender');
      }
      if (!entry['HTML']) {
        throw new Error('Missing required field: HTML');
      }

      // Format the campaign data according to Brevo API requirements
      const campaignData = {
        name: `${entry['Publication Name']} - ${month} ${year} Newsletter`,
        subject: entry['Subject'],
        sender: { 
          name: entry['Publication Name'],
          email: entry['sender']
        },
        type: "classic",
        htmlContent: entry['HTML'],
        // You can add more fields as needed:
        // recipients: { ... },
        // scheduledAt: "YYYY-MM-DD HH:mm:ss", // For scheduling
      };

      console.log(`\nPreparing to send campaign: ${campaignData.name}`);
      
      // Make the API call to Brevo
      const response = await axios.post('https://api.brevo.com/v3/emailCampaigns', campaignData, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Campaign created successfully: ${campaignData.name}`);
      console.log(`Campaign ID: ${response.data.id}`);
      
      results.push({
        publicationName: entry['Publication Name'],
        campaignId: response.data.id,
        status: 'success'
      });
    }

    return {
      success: true,
      message: `Successfully created ${results.length} campaigns`,
      campaigns: results
    };
  } catch (error) {
    console.error('❌ Error sending to Brevo API:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error(`Error message: ${JSON.stringify(error.response.data)}`);
      
      throw new Error(`Brevo API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the server');
      throw new Error('No response received from Brevo API');
    } else {
      // Something happened in setting up the request
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { sendToBrevo }; 