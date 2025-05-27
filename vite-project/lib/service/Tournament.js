import axiosClient from "../axios";

const TournamentService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get("/tournament");
      return Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/tournament/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch tournament with id ${id}:`, error);
      throw error;
    }
  },
  create: async (tournamentData) => {
    try {
      const response = await axiosClient.post("/tournament", tournamentData);
      return response.data;
    } catch (error) {
      console.error("Failed to create tournament:", error);
      throw error;
    }
  },
  update: async (id, tournamentData) => {
    try {
      const response = await axiosClient.put(
        `/tournament/${id}`,
        tournamentData
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update tournament with id ${id}:`, error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axiosClient.delete(`/tournament/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete tournament with id ${id}:`, error);
      throw error;
    }
  },
};
export default TournamentService;
