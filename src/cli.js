#!/usr/bin/env node

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { csvToJson, saveJsonToFile } = require('./csvToJson');
const { initializeBrevoApi, createContact } = require('./brevoApi');

// Check if API key is provided
if (!process.env.BREVO_API_KEY) {
  console.error('Error: Brevo API key is not set. Please set it in the .env file.');
  process.exit(1);
}

// Initialize Brevo API
initializeBrevoApi(process.env.BREVO_API_KEY);

/**
 * Create a sample CSV file
 * @param {string} outputPath - Path to save the sample CSV file
 */
function createSampleCsvFile(outputPath) {
  const sampleContent = `Publication Name,Subject,Description,sender,HTML
Newsletter 1,Welcome to our newsletter,This is our first newsletter,info@example.com,"<h1>Welcome!</h1><p>This is our first newsletter.</p>"
Newsletter 2,Latest Updates,Check out our latest updates,updates@example.com,"<h1>Latest Updates</h1><p>Here are our latest updates.</p>"
Newsletter 3,Special Offer,Don't miss our special offer,offers@example.com,"<h1>Special Offer</h1><p>Limited time offer!</p>"`;

  try {
    fs.writeFileSync(outputPath, sampleContent);
    console.log(`Sample CSV file created at: ${outputPath}`);
  } catch (error) {
    console.error(`Error creating sample CSV file: ${error.message}`);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const usage = `
Usage: node src/cli.js [options]

Options:
  --csv <path>     Path to the CSV file (required unless --create-sample is used)
  --output <path>  Path to save the JSON output (optional)
  --create-sample <path>  Create a sample CSV file at the specified path
  --help           Show this help message

Examples:
  node src/cli.js --csv ./data.csv --output ./output.json
  node src/cli.js --create-sample ./sample.csv
`;

// Show help if requested or no arguments provided
if (args.includes('--help') || args.length === 0) {
  console.log(usage);
  process.exit(0);
}

// Check if create-sample option is used
const createSampleIndex = args.indexOf('--create-sample');
if (createSampleIndex !== -1 && createSampleIndex + 1 < args.length) {
  const samplePath = path.resolve(args[createSampleIndex + 1]);
  createSampleCsvFile(samplePath);
  process.exit(0);
}

// Parse arguments
let csvPath = '';
let outputPath = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--csv' && i + 1 < args.length) {
    csvPath = args[i + 1];
    i++;
  } else if (args[i] === '--output' && i + 1 < args.length) {
    outputPath = args[i + 1];
    i++;
  }
}

// Validate CSV path
if (!csvPath) {
  console.error('Error: CSV file path is required.');
  console.log(usage);
  process.exit(1);
}

// Resolve paths
csvPath = path.resolve(csvPath);
if (outputPath) {
  outputPath = path.resolve(outputPath);
}

// Check if CSV file exists
if (!fs.existsSync(csvPath)) {
  console.error(`Error: CSV file not found at ${csvPath}`);
  process.exit(1);
}

// Main function
async function main() {
  try {
    console.log(`Processing CSV file: ${csvPath}`);
    
    // Convert CSV to JSON
    const jsonData = await csvToJson(csvPath);
    console.log(`Successfully converted ${jsonData.length} records from CSV to JSON`);
    
    // Save JSON to file if output path is provided
    if (outputPath) {
      await saveJsonToFile(jsonData, outputPath);
      console.log(`JSON data saved to ${outputPath}`);
    }
    
    // Send data to Brevo
    console.log('Sending data to Brevo API...');
    for (const record of jsonData) {
      await createContact(record);
    }
    
    console.log('All data sent to Brevo successfully');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main(); 