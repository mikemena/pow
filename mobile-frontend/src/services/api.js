import {
  transformRequestData,
  transformResponseData
} from '../utils/apiTransformers';
import { API_URL_MOBILE } from '@env';

class ApiService {
  // The transformation happens behind the scenes in the service layer

  // GET all programs for a user
  async getPrograms() {
    const response = await fetch(`${API_URL_MOBILE}/api/users/2/programs`);
    const data = await response.json();
    // Data transformation happens here, hidden from components
    return transformResponseData(data);
  }

  // Get active program
  async getActiveProgram() {
    try {
      const response = await fetch(
        `${API_URL_MOBILE}/api/active-programs/user/2`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const rawData = await response.json();
      console.log('Raw data:', rawData);

      const transformedData = transformResponseData(rawData);
      console.log('Transformed data:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error fetching active program:', error);
      throw error;
    }
  }

  // POST new active program
  async createActiveProgram(programData) {
    try {
      // Validate using camelCase (frontend convention)
      if (!programData?.userId || !programData?.programId) {
        console.error('Validation failed:', {
          hasUserId: !!programData?.userId,
          hasProgramId: !!programData?.programId,
          programData
        });
        throw new Error('Both userId and programId are required');
      }

      // Create a clean object with just the required fields
      const frontendData = {
        userId: programData.userId,
        programId: programData.programId
      };

      // Transform to snake_case for backend
      const backendData = transformRequestData(frontendData);

      const response = await fetch(`${API_URL_MOBILE}/api/active-programs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(backendData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const responseData = await response.json();

      const transformedResponse = transformResponseData(responseData);

      return transformedResponse;
    } catch (error) {
      console.error('Detailed error in createActiveProgram:', {
        error,
        originalData: programData,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // POST new program
  async createProgram(programData) {
    try {
      // Transform to snake_case for backend
      const backendData = transformRequestData(programData);

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

  // POST new active program
  async createActiveProgram(programData) {
    try {
      // Transform to snake_case for backend
      const backendData = transformRequestData(programData);

      const response = await fetch(`${API_URL_MOBILE}/api/active-programs`, {
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

  // Edit a program

  async updateProgram(programData) {
    try {
      // Transform to snake_case for backend
      const backendData = transformRequestData(programData);

      const response = await fetch(
        `${API_URL_MOBILE}/api/programs/${programData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(backendData)
        }
      );

      // Handle non-200 responses
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();

      // If it's just a success message, return it directly
      if (data.message) {
        return data;
      }

      // Otherwise, transform the response data
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

      return { success: true };
    } catch (error) {
      console.error('Delete API Error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
