import axiosClient from "../axios";

const TeamService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get("/team");
      return Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/team/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch team with id ${id}:`, error);
      throw error;
    }
  },
  create: async (teamData) => {
    try {
      const response = await axiosClient.post("/team", teamData);
      return response.data;
    } catch (error) {
      console.error("Failed to create team:", error);
      throw error;
    }
  },
  update: async (id, teamData) => {
    try {
      const response = await axiosClient.put(`/team/${id}`, teamData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update team with id ${id}:`, error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axiosClient.delete(`/team/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete team with id ${id}:`, error);
      throw error;
    }
  },
};
export default TeamService;
