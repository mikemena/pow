import {
  transformRequestData,
  transformResponseData
} from '../utils/apiTransformers';
import { API_URL_MOBILE } from '@env';

class ApiService {
  // The transformation happens behind the scenes in the service layer
  async getPrograms() {
    const response = await fetch(`${API_URL_MOBILE}/api/users/2/programs`);
    const data = await response.json();
    // Data transformation happens here, hidden from components
    return transformResponseData(data);
  }

  // POST new program
  async createProgram(programData) {
    try {
      // Transform to snake_case for backend
      const backendData = transformRequestData(programData);

      console.log(
        'After API transformer:',
        JSON.stringify(backendData, null, 2)
      );

      const response = await fetch(`${API_URL_MOBILE}/api/programs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(backendData)
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      return transformResponseData(data);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // DELETE program
  async deleteProgram(programId) {
    try {
      if (!programId) {
        throw new Error('Program ID is required for deletion');
      }

      // Log the request details
      console.log('Attempting to delete program:', {
        programId,
        url: `${API_URL_MOBILE}/api/programs/${programId}`,
        method: 'DELETE'
      });

      const response = await fetch(
        `${API_URL_MOBILE}/api/programs/${programId}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      // If the backend returns data after deletion, transform it
      if (response.status !== 204) {
        // 204 means no content
        const data = await response.json();
        return transformResponseData(data);
      }

      // If no content is returned, just return a success indicator
      console.log('Program deleted successfully:', programId);
      return { success: true };
    } catch (error) {
      console.error('Delete API Error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();