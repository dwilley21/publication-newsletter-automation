<template>
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
    <h3 class="text-lg font-semibold text-blue-800 mb-2">CSV Format Requirements</h3>
    <p class="text-blue-700 mb-2">Your CSV file must include the following columns:</p>
    <ul class="list-disc list-inside text-blue-700 mb-2">
      <li>Publication Name</li>
      <li>Subject</li>
      <li>Description</li>
      <li>sender</li>
      <li>HTML</li>
    </ul>
    <div class="mt-3">
      <button 
        @click="isExampleVisible = !isExampleVisible" 
        class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
      >
        <span>{{ isExampleVisible ? 'Hide' : 'Show' }} Example</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-4 w-4 ml-1" 
          :class="{ 'rotate-180': isExampleVisible }"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
    
    <div v-if="isExampleVisible" class="mt-3 bg-white p-3 rounded border border-blue-200 text-sm">
      <p class="font-semibold mb-1">Example CSV:</p>
      <pre class="text-xs overflow-x-auto">Publication Name,Subject,Description,sender,HTML
Newsletter 1,Welcome to our newsletter,This is our first newsletter,info@example.com,"&lt;h1&gt;Welcome!&lt;/h1&gt;&lt;p&gt;This is our first newsletter.&lt;/p&gt;"
Newsletter 2,Latest Updates,Check out our latest updates,updates@example.com,"&lt;h1&gt;Latest Updates&lt;/h1&gt;&lt;p&gt;Here are our latest updates.&lt;/p&gt;"</pre>
      <div class="mt-2">
        <a 
          href="#" 
          @click.prevent="downloadSampleCsv" 
          class="text-blue-600 hover:text-blue-800 text-xs flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Sample CSV
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isExampleVisible = ref(false);

const downloadSampleCsv = () => {
  const csvContent = `Publication Name,Subject,Description,sender,HTML
Newsletter 1,Welcome to our newsletter,This is our first newsletter,info@example.com,"<h1>Welcome!</h1><p>This is our first newsletter.</p>"
Newsletter 2,Latest Updates,Check out our latest updates,updates@example.com,"<h1>Latest Updates</h1><p>Here are our latest updates.</p>"
Newsletter 3,Special Offer,Don't miss our special offer,offers@example.com,"<h1>Special Offer</h1><p>Limited time offer!</p>"`;
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
</script> 