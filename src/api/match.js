// Base URL for match endpoints
const API_URL = "https://embeck.onrender.com/api";

/**
 * Fetch all matches
 * @returns {Promise<Array>} Array of matches
 */
export const fetchAllMatches = async () => {
  try {
    const response = await fetch(`${API_URL}/matches`);
    if (!response.ok) {
      throw new Error("Failed to fetch matches data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching matches data: " + error.message);
  }
};

/**
 * Fetch matches by tournament ID
 * @param {string} tournamentId - The tournament ID
 * @returns {Promise<Array>} Array of matches for the specified tournament
 */
export const fetchMatchesByTournament = async (tournamentId) => {
  try {
    const response = await fetch(
      `${API_URL}/matches?tournament_id=${tournamentId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tournament matches");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching tournament matches: " + error.message);
  }
};

/**
 * Fetch match details by ID
 * @param {string} matchId - The match ID
 * @returns {Promise<Object>} Match details
 */
export const fetchMatchById = async (matchId) => {
  try {
    const response = await fetch(`${API_URL}/matches/${matchId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch match details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching match details: " + error.message);
  }
};
