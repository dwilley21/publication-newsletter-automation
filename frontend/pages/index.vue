<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Upload your CSV file</h2>
      
      <CsvFormatInfo />
      
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleFileDrop"
        :class="{ 'border-blue-500 bg-blue-50': isDragging }"
      >
        <div v-if="!selectedFile">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-gray-600 mb-2">Drag and drop your CSV file here</p>
          <p class="text-gray-500 text-sm mb-4">or</p>
          <label class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer">
            Browse Files
            <input type="file" class="hidden" accept=".csv" @change="handleFileSelect">
          </label>
        </div>
        <div v-else class="flex items-center justify-between">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ selectedFile.name }}</span>
          </div>
          <button @click="selectedFile = null" class="text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="flex justify-center">
        <button 
          @click="processFile" 
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!selectedFile || isProcessing"
        >
          <span v-if="isProcessing" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Process CSV</span>
        </button>
      </div>
    </div>
    
    <div v-if="jsonResult" class="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">JSON Result</h2>
        <div class="flex space-x-2">
          <button 
            @click="copyToClipboard" 
            class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Copy JSON
          </button>
          <button 
            @click="downloadJson" 
            class="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-lg text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download JSON
          </button>
          <button 
            @click="sendCampaign" 
            class="bg-purple-500 hover:bg-purple-600 text-white py-1 px-4 rounded-lg text-sm flex items-center"
            :disabled="isSending"
          >
            <svg v-if="isSending" class="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {{ isSending ? 'Sending...' : 'Send Campaign' }}
          </button>
        </div>
      </div>
      <pre class="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">{{ JSON.stringify(jsonResult, null, 2) }}</pre>
    </div>
    
    <!-- Campaign Results Section -->
    <div v-if="campaignResult" class="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Campaign Results</h2>
      
      <div v-if="campaignResult.success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-green-700 font-medium">{{ campaignResult.message }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="campaignResult.campaigns && campaignResult.campaigns.length > 0">
        <h3 class="text-lg font-medium mb-2">Successful Campaigns</h3>
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <div v-for="(campaign, index) in campaignResult.campaigns" :key="index" class="mb-2 last:mb-0">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="font-medium">{{ campaign.publicationName }}</span>
              <span class="ml-2 text-gray-500 text-sm">Campaign ID: {{ campaign.campaignId }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="campaignResult.errors && campaignResult.errors.length > 0">
        <h3 class="text-lg font-medium mb-2">Failed Campaigns</h3>
        <div class="bg-red-50 p-4 rounded-lg">
          <div v-for="(error, index) in campaignResult.errors" :key="index" class="mb-2 last:mb-0">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="font-medium">{{ error.publicationName }}</p>
                <p class="text-red-700 text-sm">{{ error.error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="max-w-2xl mx-auto mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    
    <div v-if="copySuccess" class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
      <span class="block sm:inline">{{ copySuccess }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Papa from 'papaparse';

const selectedFile = ref(null);
const isDragging = ref(false);
const isProcessing = ref(false);
const isSending = ref(false);
const jsonResult = ref(null);
const error = ref(null);
const copySuccess = ref(null);
const campaignResult = ref(null);

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'text/csv') {
    selectedFile.value = file;
    error.value = null;
  } else {
    error.value = 'Please select a valid CSV file';
  }
};

const handleFileDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type === 'text/csv') {
    selectedFile.value = file;
    error.value = null;
  } else {
    error.value = 'Please drop a valid CSV file';
  }
};

const processFile = () => {
  if (!selectedFile.value) return;
  
  isProcessing.value = true;
  error.value = null;
  jsonResult.value = null;
  
  Papa.parse(selectedFile.value, {
    header: true,
    complete: (results) => {
      try {
        if (results.errors && results.errors.length > 0) {
          error.value = `CSV parsing error: ${results.errors[0].message}`;
          isProcessing.value = false;
          return;
        }
        
        // Validate required columns
        const requiredColumns = ['Publication Name', 'Subject', 'Description', 'sender', 'HTML'];
        const headers = Object.keys(results.data[0] || {});
        
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          error.value = `CSV file is missing required columns: ${missingColumns.join(', ')}`;
          isProcessing.value = false;
          return;
        }
        
        // Filter out empty rows
        const filteredData = results.data.filter(row => 
          Object.values(row).some(val => val && val.trim() !== '')
        );
        
        jsonResult.value = filteredData;
        isProcessing.value = false;
      } catch (err) {
        error.value = `Error processing CSV: ${err.message}`;
        isProcessing.value = false;
      }
    },
    error: (err) => {
      error.value = `Error parsing CSV: ${err.message}`;
      isProcessing.value = false;
    }
  });
};

const downloadJson = () => {
  if (!jsonResult.value) return;
  
  const jsonString = JSON.stringify(jsonResult.value, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'brevo-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const copyToClipboard = () => {
  if (!jsonResult.value) return;
  
  const jsonString = JSON.stringify(jsonResult.value, null, 2);
  navigator.clipboard.writeText(jsonString)
    .then(() => {
      copySuccess.value = 'JSON copied to clipboard!';
      setTimeout(() => {
        copySuccess.value = null;
      }, 3000);
    })
    .catch(err => {
      error.value = `Failed to copy: ${err.message}`;
    });
};

const sendCampaign = async () => {
  if (!jsonResult.value) return;
  
  isSending.value = true;
  error.value = null;
  campaignResult.value = null;
  
  try {
    // Call the API endpoint to send the campaign
    const response = await fetch('/api/send-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: jsonResult.value }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send campaign');
    }
    
    campaignResult.value = result;
    
    // Scroll to the campaign results section
    setTimeout(() => {
      const campaignResultElement = document.querySelector('.campaign-result');
      if (campaignResultElement) {
        campaignResultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } catch (err) {
    error.value = `Error sending campaign: ${err.message}`;
  } finally {
    isSending.value = false;
  }
};
</script> 