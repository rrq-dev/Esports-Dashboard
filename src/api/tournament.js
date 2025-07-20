// Base URL for tournament endpoints
const API_URL = "https://embeck.onrender.com/api";

/**
 * Fetch all tournaments
 * @returns {Promise<Array>} Array of tournaments
 */
export const fetchAllTournaments = async () => {
  try {
    const response = await fetch(`${API_URL}/tournaments`);
    if (!response.ok) {
      throw new Error("Failed to fetch tournaments data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching tournaments data: " + error.message);
  }
};

/**
 * Fetch tournament details by ID
 * @param {string} tournamentId - The tournament ID
 * @returns {Promise<Object>} Tournament details with teams and matches
 */
export const fetchTournamentById = async (tournamentId) => {
  try {
    const response = await fetch(`${API_URL}/tournaments/${tournamentId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch tournament details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching tournament details: " + error.message);
  }
};

/**
 * Fetch tournaments by status (upcoming, ongoing, completed)
 * @param {string} status - Tournament status
 * @returns {Promise<Array>} Array of tournaments with the specified status
 */
export const fetchTournamentsByStatus = async (status) => {
  try {
    const allTournaments = await fetchAllTournaments();
    return allTournaments.filter((tournament) => tournament.status === status);
  } catch (error) {
    throw new Error(`Error fetching ${status} tournaments: ${error.message}`);
  }
};
