<template>
  <footer class="bg-white mt-12 py-6 border-t">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <p class="text-gray-600 text-sm">
            &copy; {{ new Date().getFullYear() }} Publication Newsletter Automation. All rights reserved.
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="https://www.brevo.com/" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Brevo
          </a>
          <a href="https://www.brevo.com/docs/api/" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            API Docs
          </a>
          <a href="https://github.com/dwilley21/publication-newsletter-automation/issues" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Report Issue
          </a>
        </div>
      </div>
      <div class="mt-4 text-center text-xs text-gray-400">
        <p>This application is not affiliated with Brevo. Brevo is a registered trademark of its respective owners.</p>
      </div>
    </div>
  </footer>
</template> 