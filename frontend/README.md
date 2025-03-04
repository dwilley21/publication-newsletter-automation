# Brevo CSV Processor Frontend

A modern web interface for the Brevo CSV Processor, built with Nuxt.js.

## Features

- Drag and drop CSV file upload
- CSV validation for required columns
- JSON conversion with proper formatting
- Download JSON results
- Copy JSON to clipboard
- Responsive design with Tailwind CSS

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
  - `AppFooter.vue`: Application footer
  - `CsvFormatInfo.vue`: Information about CSV format requirements
- `nuxt.config.ts`: Nuxt.js configuration
- `tailwind.config.js`: Tailwind CSS configuration

## License

MIT
