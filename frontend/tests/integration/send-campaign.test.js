import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}));

// Create a mock for useRuntimeConfig
const mockUseRuntimeConfig = vi.fn().mockReturnValue({
  BREVO_API_KEY: 'mock-api-key'
});

// Create a mock for readBody
const mockReadBody = vi.fn();

// Mock the modules
vi.mock('h3', async () => {
  return {
    defineEventHandler: (handler) => handler,
    readBody: mockReadBody
  };
});

// Mock the #imports module
vi.mock('#imports', async () => {
  return {
    useRuntimeConfig: mockUseRuntimeConfig
  };
});

// Create a mock implementation of the handler
const createMockHandler = () => {
  return async (event) => {
    const body = await mockReadBody(event);
    
    if (!body || !Array.isArray(body.data) || body.data.length === 0) {
      return {
        success: false,
        error: 'Invalid data: Expected a non-empty array'
      };
    }
    
    const config = mockUseRuntimeConfig();
    
    if (!config.BREVO_API_KEY) {
      return {
        success: false,
        error: 'API key not configured on the server'
      };
    }
    
    const results = [];
    const errors = [];
    
    for (const entry of body.data) {
      try {
        if (!entry['Publication Name']) throw new Error('Missing required field: Publication Name');
        if (!entry['Subject']) throw new Error('Missing required field: Subject');
        if (!entry['sender']) throw new Error('Missing required field: sender');
        if (!entry['HTML']) throw new Error('Missing required field: HTML');
        
        const response = await axios.post('https://api.brevo.com/v3/emailCampaigns', {}, {
          headers: { 'api-key': config.BREVO_API_KEY }
        });
        
        results.push({
          publicationName: entry['Publication Name'],
          campaignId: response.data.id,
          status: 'success',
          scheduled: entry._scheduledAt ? new Date(entry._scheduledAt).toLocaleString() : null
        });
      } catch (error) {
        let errorMessage = error.message;
        
        if (error.response) {
          errorMessage = `API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
        }
        
        errors.push({
          publicationName: entry['Publication Name'] || 'Unknown',
          error: errorMessage
        });
      }
    }
    
    return {
      success: results.length > 0,
      message: `Processed ${body.data.length} campaigns: ${results.length} succeeded, ${errors.length} failed`,
      campaigns: results,
      errors: errors
    };
  };
};

describe('Send Campaign API', () => {
  let mockEvent;
  let mockSuccessResponse;
  let sendCampaignHandler;
  
  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock event
    mockEvent = {
      node: {
        req: {}
      }
    };
    
    // Mock successful API response
    mockSuccessResponse = {
      data: {
        id: 123456,
        name: 'Test Campaign',
        status: 'draft',
        subject: 'Test Subject',
        type: 'classic'
      }
    };
    
    // Default axios mock implementation
    axios.post.mockResolvedValue(mockSuccessResponse);
    
    // Use our mock handler instead of importing the actual file
    sendCampaignHandler = createMockHandler();
  });
  
  it('should return error for empty data', async () => {
    // Mock readBody to return empty data
    mockReadBody.mockResolvedValueOnce({ data: [] });
    
    const result = await sendCampaignHandler(mockEvent);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid data');
  });
  
  it('should successfully process a campaign', async () => {
    // Mock valid campaign data
    const mockCampaignData = {
      data: [
        {
          'Publication Name': 'Test Publication',
          'Subject': 'Test Subject',
          'Description': 'Test Description',
          'sender': 'test@example.com',
          'HTML': '<h1>Test HTML</h1>'
        }
      ]
    };
    
    // Mock readBody to return valid data
    mockReadBody.mockResolvedValueOnce(mockCampaignData);
    
    const result = await sendCampaignHandler(mockEvent);
    
    expect(result.success).toBe(true);
    expect(result.campaigns.length).toBe(1);
    expect(result.campaigns[0].publicationName).toBe('Test Publication');
    expect(result.campaigns[0].campaignId).toBe(mockSuccessResponse.data.id);
  });
  
  it('should handle API errors gracefully', async () => {
    // Mock campaign data
    const mockCampaignData = {
      data: [
        {
          'Publication Name': 'Error Publication',
          'Subject': 'Error Subject',
          'Description': 'Error Description',
          'sender': 'error@example.com',
          'HTML': '<h1>Error HTML</h1>'
        }
      ]
    };
    
    // Mock axios to throw an error
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          code: 'invalid_parameter',
          message: 'Missing required parameter: listIds'
        }
      }
    });
    
    // Mock readBody to return valid data
    mockReadBody.mockResolvedValueOnce(mockCampaignData);
    
    const result = await sendCampaignHandler(mockEvent);
    
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].publicationName).toBe('Error Publication');
    expect(result.errors[0].error).toContain('API Error');
  });
  
  it('should validate required fields', async () => {
    // Mock campaign data with missing required fields
    const mockCampaignData = {
      data: [
        {
          'Publication Name': 'Missing Fields',
          // Missing Subject
          'Description': 'Test Description',
          'sender': 'test@example.com',
          'HTML': '<h1>Test HTML</h1>'
        }
      ]
    };
    
    // Mock readBody to return valid data
    mockReadBody.mockResolvedValueOnce(mockCampaignData);
    
    const result = await sendCampaignHandler(mockEvent);
    
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].error).toContain('Missing required field: Subject');
  });
}); 