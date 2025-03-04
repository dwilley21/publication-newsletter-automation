import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    if (!body || !Array.isArray(body.data) || body.data.length === 0) {
      return {
        success: false,
        error: 'Invalid data: Expected a non-empty array'
      };
    }

    // Get the API key from runtime config
    const config = useRuntimeConfig();
    const apiKey = config.BREVO_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        error: 'API key not configured on the server'
      };
    }

    // Get current month and year for campaign name
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const results = [];
    const errors = [];

    // Process each entry in the JSON data
    for (const entry of body.data) {
      try {
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
          htmlContent: entry['HTML']
        };
        
        // Make the API call to Brevo
        const response = await axios.post('https://api.brevo.com/v3/emailCampaigns', campaignData, {
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json'
          }
        });

        results.push({
          publicationName: entry['Publication Name'],
          campaignId: response.data.id,
          status: 'success'
        });
      } catch (error) {
        let errorMessage = error.message;
        
        if (error.response) {
          errorMessage = `API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
        }
        
        errors.push({
          publicationName: entry['Publication Name'] || 'Unknown',
          error: errorMessage
        });
      }
    }

    return {
      success: results.length > 0,
      message: `Processed ${body.data.length} campaigns: ${results.length} succeeded, ${errors.length} failed`,
      campaigns: results,
      errors: errors
    };
  } catch (error) {
    console.error('Error in send-campaign API:', error);
    
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}); 