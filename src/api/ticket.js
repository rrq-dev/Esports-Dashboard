// Base URL for ticket endpoints
const API_URL = "http://localhost:1010/api";

/**
 * Fetch all tickets
 * @returns {Promise<Array>} Array of tickets
 */
export const fetchAllTickets = async () => {
  try {
    const response = await fetch(`${API_URL}/tickets`);
    if (!response.ok) {
      throw new Error("Failed to fetch tickets data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching tickets data: " + error.message);
  }
};

/**
 * Fetch tickets by tournament ID
 * @param {string} tournamentId - The tournament ID
 * @returns {Promise<Array>} Array of tickets for the specified tournament
 */
export const fetchTicketsByTournament = async (tournamentId) => {
  try {
    const response = await fetch(
      `${API_URL}/tournaments/${tournamentId}/tickets`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tournament tickets");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching tournament tickets: " + error.message);
  }
};

/**
 * Fetch tickets by user ID
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of tickets owned by the specified user
 */
export const fetchTicketsByUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/tickets/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user tickets");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching user tickets: " + error.message);
  }
};
