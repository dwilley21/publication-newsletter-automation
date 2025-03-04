const fs = require('fs');
const csv = require('csv-parser');

/**
 * Validate CSV file structure
 * @param {Array} data - CSV data as array of objects
 * @returns {Object} - Validation result
 */
function validateCsvStructure(data) {
  if (!data || data.length === 0) {
    return { valid: false, message: 'CSV file is empty' };
  }

  const requiredColumns = ['Publication Name', 'Subject', 'Description', 'sender', 'HTML'];
  const firstRow = data[0];
  const missingColumns = [];

  for (const column of requiredColumns) {
    if (!(column in firstRow)) {
      missingColumns.push(column);
    }
  }

  if (missingColumns.length > 0) {
    return {
      valid: false,
      message: `CSV file is missing required columns: ${missingColumns.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Convert CSV file to JSON
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} - Array of JSON objects
 */
function csvToJson(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`Converted ${results.length} records from CSV to JSON`);
        
        // Validate CSV structure
        const validation = validateCsvStructure(results);
        if (!validation.valid) {
          reject(new Error(validation.message));
          return;
        }
        
        resolve(results);
      })
      .on('error', (error) => {
        console.error(`Error converting CSV to JSON: ${error.message}`);
        reject(error);
      });
  });
}

/**
 * Save JSON data to a file
 * @param {Array} data - JSON data to save
 * @param {string} outputPath - Path to save the JSON file
 * @returns {Promise<void>}
 */
function saveJsonToFile(data, outputPath) {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(data, null, 2);
    
    fs.writeFile(outputPath, jsonString, (err) => {
      if (err) {
        console.error(`Error saving JSON to file: ${err.message}`);
        reject(err);
        return;
      }
      
      console.log(`JSON data saved to ${outputPath}`);
      resolve();
    });
  });
}

module.exports = {
  csvToJson,
  saveJsonToFile,
  validateCsvStructure
}; 