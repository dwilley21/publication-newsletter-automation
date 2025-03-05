# Brevo CSV Processor Frontend

A modern web interface for the Brevo CSV Processor, built with Nuxt.js.

## Features

- Drag and drop CSV file upload
- CSV validation for required columns
- JSON conversion with proper formatting
- Download JSON results
- Copy JSON to clipboard
- Responsive design with Tailwind CSS
- Individual campaign scheduling
- HTML preview functionality
- Campaign sending to Brevo API

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd brevo-csv-processor/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3001` (or the port shown in your terminal)

## CSV Format Requirements

The CSV file must include the following columns:
- Publication Name
- Subject
- Description
- sender
- HTML

Example CSV:
```
Publication Name,Subject,Description,sender,HTML
Newsletter 1,Welcome to our newsletter,This is our first newsletter,info@example.com,"<h1>Welcome!</h1><p>This is our first newsletter.</p>"
Newsletter 2,Latest Updates,Check out our latest updates,updates@example.com,"<h1>Latest Updates</h1><p>Here are our latest updates.</p>"
```

## Testing

The application includes a comprehensive test suite built with Vitest. Tests are organized into unit tests and integration tests.

### Running Tests

To run all tests:

```
npm test
```

To run tests in watch mode (useful during development):

```
npm run test:watch
```

To generate test coverage reports:

```
npm run test:coverage
```

### Test Structure

- `tests/unit/`: Unit tests for individual components and utilities
  - `csv-processor.test.js`: Tests for CSV processing functionality
  - `CsvFormatInfo.test.js`: Tests for the CsvFormatInfo component
- `tests/integration/`: Integration tests for API endpoints
  - `send-campaign.test.js`: Tests for the send-campaign API endpoint

### Test Coverage

The test suite covers:

- CSV parsing and validation
- Required column validation
- Empty row filtering
- Component functionality
- API endpoint behavior
- Error handling

## Building for Production

To build the application for production:

```
npm run build
```

To preview the production build:

```
npm run preview
```

## Project Structure

- `app.vue`: Main application component
- `pages/index.vue`: Main landing page with CSV upload functionality
- `components/`: Reusable Vue components
  - `AppHeader.vue`: Application header
  - `CsvFormatInfo.vue`: Information about CSV format requirements
- `server/api/`: API endpoints
  - `send-campaign.post.js`: Endpoint for sending campaigns to Brevo
- `tests/`: Test files
  - `unit/`: Unit tests
  - `integration/`: Integration tests
- `nuxt.config.ts`: Nuxt.js configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `vitest.config.js`: Vitest configuration

## License

MIT
