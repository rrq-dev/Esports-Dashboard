import axiosClient from "../axios";

const ScoreMatchService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get("/score-match");
      return Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch score matches:", error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/score-match/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch score match with id ${id}:`, error);
      throw error;
    }
  },

  create: async (scoreMatchData) => {
    try {
      const response = await axiosClient.post("/score-match", scoreMatchData);
      return response.data;
    } catch (error) {
      console.error("Failed to create score match:", error);
      throw error;
    }
  },
  update: async (id, scoreMatchData) => {
    try {
      const response = await axiosClient.put(
        `/score-match/${id}`,
        scoreMatchData
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update score match with id ${id}:`, error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axiosClient.delete(`/score-match/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete score match with id ${id}:`, error);
      throw error;
    }
  },
};

export default ScoreMatchService;
