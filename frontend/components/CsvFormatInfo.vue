<template>
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-semibold text-blue-800">CSV Format Requirements</h3>
      <button 
        @click="isInfoExpanded = !isInfoExpanded" 
        class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
      >
        <span>{{ isInfoExpanded ? 'Hide Details' : 'Show Details' }}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-4 w-4 ml-1 transition-transform duration-200" 
          :class="{ 'rotate-180': isInfoExpanded }"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
    
    <div v-if="isInfoExpanded">
      <p class="text-blue-700 mb-2">Your CSV file must include the following columns:</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div v-for="(desc, column) in columnDescriptions" :key="column" class="bg-white p-3 rounded border border-blue-100">
          <h4 class="font-medium text-blue-800">{{ column }}</h4>
          <p class="text-sm text-blue-700">{{ desc }}</p>
        </div>
      </div>
      
      <div class="mt-3">
        <button 
          @click="isExampleVisible = !isExampleVisible" 
          class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          <span>{{ isExampleVisible ? 'Hide' : 'Show' }} Example</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 ml-1 transition-transform duration-200" 
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
        <pre class="text-xs overflow-x-auto bg-gray-50 p-2 rounded">Publication Name,Subject,Description,sender,HTML
Newsletter 1,Welcome to our newsletter,This is our first newsletter,info@example.com,"&lt;h1&gt;Welcome!&lt;/h1&gt;&lt;p&gt;This is our first newsletter.&lt;/p&gt;"
Newsletter 2,Latest Updates,Check out our latest updates,updates@example.com,"&lt;h1&gt;Latest Updates&lt;/h1&gt;&lt;p&gt;Here are our latest updates.&lt;/p&gt;"</pre>
        <div class="mt-2 flex justify-between items-center">
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
          <span v-if="downloadSuccess" class="text-green-600 text-xs">Downloaded!</span>
        </div>
      </div>
      
      <div class="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800">
        <h4 class="font-medium mb-1">Important Notes:</h4>
        <ul class="list-disc list-inside space-y-1">
          <li>Make sure your HTML is properly formatted and escaped in the CSV</li>
          <li>The sender email must be a valid email address</li>
          <li>Each row will be processed as a separate campaign</li>
          <li>Empty rows will be automatically filtered out</li>
        </ul>
      </div>
    </div>
    <div v-else class="flex flex-wrap gap-2">
      <span v-for="column in Object.keys(columnDescriptions)" :key="column" class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
        {{ column }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isExampleVisible = ref(false);
const isInfoExpanded = ref(false);
const downloadSuccess = ref(false);

const columnDescriptions = {
  'Publication Name': 'The name of your publication or newsletter',
  'Subject': 'Email subject line that recipients will see',
  'Description': 'Brief description of the campaign content',
  'sender': 'Email address that will appear as the sender',
  'HTML': 'The complete HTML content of your newsletter'
};

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
  
  // Show success message
  downloadSuccess.value = true;
  setTimeout(() => {
    downloadSuccess.value = false;
  }, 2000);
};
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style> 