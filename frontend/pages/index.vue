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
            {{ isSending ? 'Sending...' : 'Send Campaigns' }}
          </button>
        </div>
      </div>
      
      <div class="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 class="text-md font-medium mb-2">CSV Data Summary</h3>
        <p class="text-gray-700">{{ jsonResult.length }} campaign(s) ready to send</p>
      </div>
      
      <!-- Individual Campaign Cards -->
      <div class="space-y-4 mt-4">
        <div v-for="(campaign, index) in campaignData" :key="index" class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div class="flex justify-between items-start">
            <div class="flex items-start">
              <!-- HTML Preview Toggle Button -->
              <button 
                @click="togglePreview(index)" 
                class="mr-3 text-gray-500 hover:text-gray-700 flex flex-col items-center"
                :class="{'text-blue-500 hover:text-blue-700': campaign.showPreview}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span class="text-xs mt-1">{{ campaign.showPreview ? 'Hide' : 'Preview' }}</span>
              </button>
              
              <div>
                <h3 class="font-medium text-lg">{{ campaign.original['Publication Name'] }}</h3>
                <p class="text-gray-600">{{ campaign.original['Subject'] }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <button 
                @click="toggleSchedule(index)" 
                class="text-blue-500 hover:text-blue-700 mr-2 text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ campaign.isScheduled ? 'Edit Schedule' : 'Schedule' }}
              </button>
            </div>
          </div>
          
          <!-- HTML Preview Section -->
          <div v-if="campaign.showPreview" class="mt-3 border-t border-gray-200 pt-3">
            <h4 class="text-sm font-medium text-gray-700 mb-2">HTML Preview</h4>
            <div class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden" style="max-height: 300px;">
              <div class="relative">
                <div class="absolute top-0 right-0 bg-gray-100 p-1 rounded-bl-md">
                  <button 
                    @click="openFullPreview(index)" 
                    class="text-blue-500 hover:text-blue-700 text-xs flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                    Expand
                  </button>
                </div>
                <iframe 
                  :srcdoc="campaign.original.HTML" 
                  class="w-full border-0"
                  style="height: 300px;"
                  sandbox="allow-same-origin"
                ></iframe>
              </div>
            </div>
          </div>
          
          <!-- Schedule Options for this campaign -->
          <div v-if="campaign.isScheduled" class="mt-3 border-t border-gray-200 pt-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  v-model="campaign.scheduledDate" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  :min="minDate"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input 
                  type="time" 
                  v-model="campaign.scheduledTime" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
            </div>
            
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Brevo List ID (optional)</label>
              <div class="flex items-center">
                <input 
                  type="number" 
                  v-model="campaign.listId" 
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
            
            <p class="text-sm text-gray-500">
              Will be scheduled for {{ getFormattedScheduleDate(campaign) }}
            </p>
          </div>
          
          <div class="mt-2 flex justify-end">
            <button 
              v-if="campaign.isScheduled" 
              @click="toggleSchedule(index)" 
              class="text-red-500 hover:text-red-700 text-sm"
            >
              Cancel Schedule
            </button>
          </div>
        </div>
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
              <span v-if="campaign.scheduled" class="ml-2 text-blue-500 text-sm">
                Scheduled: {{ campaign.scheduled }}
              </span>
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
import { ref, computed, watch } from 'vue';
import Papa from 'papaparse';

const selectedFile = ref(null);
const isDragging = ref(false);
const isProcessing = ref(false);
const isSending = ref(false);
const jsonResult = ref(null);
const error = ref(null);
const campaignResult = ref(null);
const campaignData = ref([]);
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

// Minimum date should be today
const minDate = formatDateForInput(today);

// Watch for changes to jsonResult and update campaignData
watch(jsonResult, (newValue) => {
  if (newValue) {
    campaignData.value = newValue.map(item => ({
      original: item,
      isScheduled: false,
      scheduledDate: formatDateForInput(tomorrow),
      scheduledTime: formatTimeForInput(today),
      listId: '',
      showPreview: false
    }));
  } else {
    campaignData.value = [];
  }
});

// Toggle preview for a specific campaign
const togglePreview = (index) => {
  if (campaignData.value[index]) {
    campaignData.value[index].showPreview = !campaignData.value[index].showPreview;
  }
};

// Open full preview in a modal or new window
const openFullPreview = (index) => {
  if (!campaignData.value[index]) return;
  
  // Create a new window with the HTML content
  const htmlContent = campaignData.value[index].original.HTML;
  const previewWindow = window.open('', '_blank', 'width=800,height=600');
  previewWindow.document.write(htmlContent);
  previewWindow.document.close();
};

// Toggle schedule for a specific campaign
const toggleSchedule = (index) => {
  if (campaignData.value[index]) {
    campaignData.value[index].isScheduled = !campaignData.value[index].isScheduled;
  }
};

// Get formatted schedule date for a campaign
const getFormattedScheduleDate = (campaign) => {
  if (!campaign.scheduledDate || !campaign.scheduledTime) return 'Invalid date';
  
  const dateObj = new Date(`${campaign.scheduledDate}T${campaign.scheduledTime}`);
  return dateObj.toLocaleString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

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
  if (!campaignData.value || campaignData.value.length === 0) return;
  
  isSending.value = true;
  error.value = null;
  campaignResult.value = null;
  
  try {
    // Prepare the campaign data with individual scheduling information
    const campaignsToSend = campaignData.value.map(campaign => {
      const result = { ...campaign.original };
      
      // Add scheduling information if this campaign is scheduled
      if (campaign.isScheduled && campaign.scheduledDate && campaign.scheduledTime) {
        const dateTimeString = `${campaign.scheduledDate}T${campaign.scheduledTime}:00`;
        const scheduledDateTime = new Date(dateTimeString);
        
        // Validate the date is in the future
        if (scheduledDateTime <= new Date()) {
          throw new Error(`Scheduled time for ${campaign.original['Publication Name']} must be in the future`);
        }
        
        result._scheduledAt = scheduledDateTime.toISOString();
        result._listId = campaign.listId ? parseInt(campaign.listId, 10) : 2;
      }
      
      return result;
    });
    
    // Call the API endpoint to send the campaigns
    const response = await fetch('/api/send-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        data: campaignsToSend
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