# Getting a Valid Brevo API Key

To use the Brevo CSV Processor, you need a valid API key from Brevo. Follow these steps to obtain one:

## Steps to Get Your Brevo API Key

1. **Create a Brevo Account**
   - Go to [Brevo's website](https://www.brevo.com/)
   - Sign up for an account if you don't already have one
   - Verify your email address

2. **Access API Keys Section**
   - Log in to your Brevo account
   - Navigate to "Settings" (gear icon in the top-right corner)
   - Select "SMTP & API" from the left sidebar
   - Click on the "API Keys" tab

3. **Generate a New API Key**
   - Click on the "Generate a New API Key" button
   - Enter a name for your API key (e.g., "Brevo CSV Processor")
   - Select the appropriate permissions (at minimum, you need "Contacts" and "SMTP")
   - Click "Generate"

4. **Copy Your API Key**
   - Copy the generated API key
   - **Important**: Store this key securely as it won't be shown again

5. **Add the API Key to Your Project**
   - Create or edit the `.env` file in the root of your project
   - Add the following line, replacing `your_actual_api_key` with your copied key:
     ```
     BREVO_API_KEY=your_actual_api_key
     ```

## Testing Your API Key

After adding your API key to the `.env` file, you can test the connection:

```bash
npm run test-connection
```

If successful, you should see your account details displayed.

## Troubleshooting

If you encounter an "unauthorized" or "Key not found" error:

1. Double-check that you've copied the entire API key correctly
2. Ensure there are no extra spaces or characters in your `.env` file
3. Verify that your Brevo account is active and not suspended
4. Check if your API key has the necessary permissions

## API Key Security

- Never commit your `.env` file to version control
- Don't share your API key publicly
- Consider using environment variables for production deployments
- Rotate your API keys periodically for better security 