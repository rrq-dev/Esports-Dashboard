import axiosClient from "../axios";

const PlayerService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get("/player");
      return Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch players:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/player/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch player with id ${id}:`, error);
      throw error;
    }
  },

  create: async (playerData) => {
    try {
      const response = await axiosClient.post("/player", playerData);
      return response.data;
    } catch (error) {
      console.error("Failed to create player:", error);
      throw error;
    }
  },

  update: async (id, playerData) => {
    try {
      const response = await axiosClient.put(`/player/${id}`, playerData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update player with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosClient.delete(`/player/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete player with id ${id}:`, error);
      throw error;
    }
  },
};

export default PlayerService;
