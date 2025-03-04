require('dotenv').config();
const path = require('path');
const { csvToJson, saveJsonToFile } = require('./csvToJson');
const { initializeBrevoApi, createContact, sendTransactionalEmail } = require('./brevoApi');

// Initialize Brevo API with the API key from .env
initializeBrevoApi(process.env.BREVO_API_KEY);

/**
 * Main function to process CSV and send to Brevo
 */
async function main() {
  try {
    const csvFilePath = path.resolve(__dirname, '../sample.csv');
    const jsonOutputPath = path.resolve(__dirname, '../output.json');
    
    // Process CSV file and convert to JSON
    const jsonData = await csvToJson(csvFilePath);
    console.log('CSV converted to JSON successfully');
    
    // Save JSON data to file (optional)
    await saveJsonToFile(jsonData, jsonOutputPath);
    
    // Send each record to Brevo
    console.log('Sending data to Brevo API...');
    for (const record of jsonData) {
      // For demonstration, we'll create a contact for each record
      // In a real application, you might want to do different operations based on your requirements
      await createContact(record);
      
      // If you want to send transactional emails, you would need to specify recipients
      // This is just an example and would need to be adapted to your specific use case
      // const emailData = { ...record, recipient: 'recipient@example.com' };
      // await sendTransactionalEmail(emailData);
    }
    
    console.log('All data sent to Brevo successfully');
  } catch (error) {
    console.error(`Error in main process: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main();
} 