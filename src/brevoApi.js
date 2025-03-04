const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure Brevo API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];

/**
 * Initialize the Brevo API client with the provided API key
 * @param {string} apiKeyValue - Brevo API key
 */
function initializeBrevoApi(apiKeyValue) {
  apiKey.apiKey = apiKeyValue;
  console.log('Brevo API client initialized');
}

/**
 * Validate the Brevo API key
 * @returns {Promise<boolean>} - True if the API key is valid
 */
async function validateApiKey() {
  try {
    const apiInstance = new SibApiV3Sdk.AccountApi();
    await apiInstance.getAccount();
    return true;
  } catch (error) {
    if (error.status === 401) {
      console.error('Invalid Brevo API key. Please check your API key in the .env file.');
      return false;
    }
    console.error(`Error validating API key: ${error.message}`);
    return false;
  }
}

/**
 * Create a contact in Brevo
 * @param {Object} contactData - Contact data
 * @returns {Promise<Object>} - API response
 */
async function createContact(contactData) {
  try {
    const apiInstance = new SibApiV3Sdk.ContactsApi();
    const createContact = new SibApiV3Sdk.CreateContact();
    
    createContact.email = contactData.sender;
    createContact.attributes = {
      PUBLICATION_NAME: contactData['Publication Name'],
      SUBJECT: contactData.Subject,
      DESCRIPTION: contactData.Description,
      HTML_CONTENT: contactData.HTML
    };
    
    const result = await apiInstance.createContact(createContact);
    console.log(`Contact created successfully: ${contactData.sender}`);
    return result;
  } catch (error) {
    console.error(`Error creating contact: ${error.message}`);
    throw error;
  }
}

/**
 * Send a transactional email using Brevo
 * @param {Object} emailData - Email data
 * @returns {Promise<Object>} - API response
 */
async function sendTransactionalEmail(emailData) {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = emailData.Subject;
    sendSmtpEmail.htmlContent = emailData.HTML;
    sendSmtpEmail.sender = { email: emailData.sender, name: emailData['Publication Name'] };
    sendSmtpEmail.to = [{ email: emailData.recipient }];
    
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent successfully to: ${emailData.recipient}`);
    return result;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw error;
  }
}

module.exports = {
  initializeBrevoApi,
  validateApiKey,
  createContact,
  sendTransactionalEmail
}; 