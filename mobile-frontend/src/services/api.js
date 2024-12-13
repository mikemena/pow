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

  async createProgram(programData) {
    // Data is transformed to snake_case before sending to backend
    const backendData = transformRequestData(programData);
    const response = await fetch(`${API_URL_MOBILE}/api/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendData)
    });
    const data = await response.json();
    // Response is transformed back to camelCase before returning
    return transformResponseData(data);
  }
}

export const apiService = new ApiService();
