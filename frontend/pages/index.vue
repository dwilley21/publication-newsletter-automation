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
        <h2 class="text-xl font-semibold">Campaign Data</h2>
        <div class="flex space-x-2">
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
      
      <!-- Schedule Options -->
      <div class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center mb-2">
          <input 
            type="checkbox" 
            id="scheduleToggle" 
            v-model="isScheduled" 
            class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          >
          <label for="scheduleToggle" class="ml-2 text-sm font-medium text-gray-700">
            Schedule campaign for later
          </label>
        </div>
        
        <div v-if="isScheduled" class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              v-model="scheduledDate" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :min="minDate"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input 
              type="time" 
              v-model="scheduledTime" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
        </div>
        
        <div v-if="isScheduled" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Brevo List ID (optional)</label>
          <div class="flex items-center">
            <input 
              type="number" 
              v-model="listId" 
              placeholder="Default: 2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <div class="ml-2">
              <button 
                type="button"
                @click="showListHelp = !showListHelp"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
          <div v-if="showListHelp" class="mt-2 text-sm text-gray-500 bg-gray-100 p-2 rounded">
            <p>The List ID is required by Brevo when scheduling campaigns. You can find your list IDs in your Brevo account under Contacts > Lists.</p>
            <p class="mt-1">If not specified, the default list ID (2) will be used, which is typically the default list in Brevo.</p>
          </div>
        </div>
        
        <p v-if="isScheduled" class="mt-2 text-sm text-gray-500">
          Your campaign will be scheduled to send on {{ formattedScheduleDate }}.
        </p>
      </div>
      
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-md font-medium mb-2">CSV Data Summary</h3>
        <p class="text-gray-700">{{ jsonResult.length }} campaign(s) ready to send</p>
        <ul class="mt-2 space-y-1">
          <li v-for="(item, index) in jsonResult.slice(0, 3)" :key="index" class="text-sm text-gray-600">
            • {{ item['Publication Name'] }} - {{ item['Subject'] }}
          </li>
          <li v-if="jsonResult.length > 3" class="text-sm text-gray-500 italic">
            ...and {{ jsonResult.length - 3 }} more
          </li>
        </ul>
      </div>
    </div>
    
    <div v-if="campaignResult" class="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Campaign Results</h2>
      
      <div v-if="campaignResult.success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-green-700 font-medium">{{ campaignResult.message }}</p>
            <p v-if="isScheduled" class="text-green-600 text-sm mt-1">
              Campaigns scheduled for {{ formattedScheduleDate }}
            </p>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Papa from 'papaparse';

const selectedFile = ref(null);
const isDragging = ref(false);
const isProcessing = ref(false);
const isSending = ref(false);
const jsonResult = ref(null);
const error = ref(null);
const campaignResult = ref(null);

// Scheduling options
const isScheduled = ref(false);
const scheduledDate = ref('');
const scheduledTime = ref('');
const listId = ref('');
const showListHelp = ref(false);

// Set default date to today and time to current time + 1 hour
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// Format date as YYYY-MM-DD for the input
const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format time as HH:MM for the input
const formatTimeForInput = (date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Initialize with tomorrow's date and current time
scheduledDate.value = formatDateForInput(tomorrow);
scheduledTime.value = formatTimeForInput(today);

// Minimum date should be today
const minDate = formatDateForInput(today);

// Formatted schedule date for display
const formattedScheduleDate = computed(() => {
  if (!scheduledDate.value || !scheduledTime.value) return 'Invalid date';
  
  const dateObj = new Date(`${scheduledDate.value}T${scheduledTime.value}`);
  return dateObj.toLocaleString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
});

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

const sendCampaign = async () => {
  if (!jsonResult.value) return;
  
  isSending.value = true;
  error.value = null;
  campaignResult.value = null;
  
  try {
    // Prepare scheduled date if needed
    let scheduledAt = null;
    if (isScheduled.value && scheduledDate.value && scheduledTime.value) {
      // Create ISO string from date and time inputs
      const dateTimeString = `${scheduledDate.value}T${scheduledTime.value}:00`;
      const scheduledDateTime = new Date(dateTimeString);
      
      // Validate the date is in the future
      if (scheduledDateTime <= new Date()) {
        throw new Error('Scheduled time must be in the future');
      }
      
      scheduledAt = scheduledDateTime.toISOString();
    }
    
    // Prepare the list ID if provided
    const listIdValue = listId.value ? parseInt(listId.value, 10) : null;
    
    // Call the API endpoint to send the campaign
    const response = await fetch('/api/send-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        data: jsonResult.value,
        scheduledAt: scheduledAt,
        listId: listIdValue
      }),
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