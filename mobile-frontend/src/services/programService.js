// src/services/programService.js
import { apiService } from './api';
import { API_URL_MOBILE } from '@env';

class ProgramService {
  // Create a new program
  async createProgram(programData) {
    // The base apiService handles the data transformation
    return await apiService.post('/api/programs', programData);
  }

  // Update an existing program
  async updateProgram(programId, programData) {
    return await apiService.put(`/api/programs/${programId}`, programData);
  }

  // Delete a program
  async deleteProgram(programId) {
    return await apiService.delete(`/api/programs/${programId}`);
  }

  // Get programs for a user
  async getUserPrograms(userId) {
    return await apiService.get(`/api/users/${userId}/programs`);
  }
}

export const programService = new ProgramService();
