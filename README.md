# Brevo CSV Processor

A Node.js application that processes CSV files and sends the data to the Brevo API.

## Features

- Reads CSV files with columns: Publication Name, Subject, Description, sender, HTML
- Converts CSV data to JSON format
- Sends the data to Brevo API
- Supports creating contacts and sending transactional emails
- Command-line interface for easy usage
- Modern web interface for CSV processing (Nuxt.js frontend)
- Individual campaign scheduling with date and time selection
- HTML preview functionality for campaign content
- Campaign sending to Brevo API with error handling
- Comprehensive test suite for both frontend and backend

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Brevo API key

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd brevo-csv-processor
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Brevo API key:
   ```
   BREVO_API_KEY=your_api_key_here
   ```

## Usage

### Using the CLI

The application provides a command-line interface for easy usage:

```
npm run cli -- --csv <path-to-csv> --output <path-to-output-json>
```

For example:
```
npm run cli -- --csv ./sample.csv --output ./output.json
```

To see all available options:
```
npm run cli -- --help
```

### Using as a Module

You can also use the application programmatically:

1. Place your CSV file in the project directory or update the file path in `src/index.js`.

2. Run the application:
   ```
   npm start
   ```

### Using the Web Interface

The project includes a modern web interface built with Nuxt.js:

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3001` (or the port shown in your terminal)

5. Use the web interface to upload CSV files, process them, and send campaigns to Brevo

### Global Installation

You can install the package globally to use the CLI from anywhere:

```
npm install -g .
brevo-csv --csv <path-to-csv> --output <path-to-output-json>
```

## CSV Format

The CSV file should have the following columns:
- Publication Name
- Subject
- Description
- sender
- HTML

Example:
```
Publication Name,Subject,Description,sender,HTML
Newsletter 1,Welcome to our newsletter,This is our first newsletter,info@example.com,"<h1>Welcome!</h1><p>This is our first newsletter.</p>"
```

## Testing

The application includes comprehensive test suites for both the backend and frontend components.

### Backend Tests

To run backend tests:

```
npm test
```

### Frontend Tests

To run frontend tests:

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Run the tests:
   ```
   npm test
   ```

3. For test coverage reports:
   ```
   npm run test:coverage
   ```

### Test Structure

- Backend tests: Test the CLI and API functionality
- Frontend tests:
  - Unit tests: Test individual components and utilities
  - Integration tests: Test API endpoints

## Project Structure

### Backend
- `src/index.js`: Main application file
- `src/cli.js`: Command-line interface
- `src/csvToJson.js`: Utility for converting CSV to JSON
- `src/brevoApi.js`: Utility for interacting with the Brevo API
- `sample.csv`: Sample CSV file for testing
- `.env`: Environment variables (API key)

### Frontend
- `frontend/`: Nuxt.js web application
  - `app.vue`: Main application component
  - `pages/index.vue`: Main landing page with CSV upload functionality
  - `components/`: Reusable Vue components
  - `server/api/`: API endpoints for sending campaigns
  - `tests/`: Test files (unit and integration tests)
  - `nuxt.config.ts`: Nuxt.js configuration
  - `tailwind.config.js`: Tailwind CSS configuration
  - `vitest.config.js`: Vitest configuration

## Customization

You can customize the application by modifying the following files:

- `src/brevoApi.js`: Add or modify Brevo API functions
- `src/index.js`: Change the main workflow or add additional processing steps
- `src/cli.js`: Modify the command-line interface
- `frontend/`: Modify the web interface

## License

MIT 