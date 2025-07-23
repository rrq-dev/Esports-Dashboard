export const fetchAllTeams = async () => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch("https://backend-esports.up.railway.app/api/admin/teams", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch teams data");
    }
    const data = await response.json();
    return data; // Sesuaikan jika ada struktur data lain di respons backend
  } catch (error) {
    throw new Error("Error fetching teams data: " + error.message);
  }
};

/**
 * Create a new team
 * @param {Object} teamData - The team data to create (TeamName, CaptainID, Members, LogoURL)
 * @returns {Promise<Object>} Created team data or confirmation
 */
export const createTeam = async (teamData) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch("https://backend-esports.up.railway.app/api/admin/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(teamData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create team");
    }
    const data = await response.json();
    return data; // Return the created team data or confirmation
  } catch (error) {
    throw new Error("Error creating team: " + error.message);
  }
};

/**
 * Fetch team by ID
 * @param {string} teamId - The team ID
 * @returns {Promise<Object>} Team data
 */
export const fetchTeamById = async (teamId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(
      `https://backend-esports.up.railway.app/api/admin/teams/${teamId}`,
      { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch team data");
    }
    const data = await response.json();
    return data; // Return the team data object
  } catch (error) {
    throw new Error("Error fetching team data: " + error.message);
  }
};

/**
 * Update a team
 * @param {string} teamId - The team ID
 * @param {Object} teamData - The team data to update
 * @returns {Promise<Object>} Updated team data or confirmation
 */
export const updateTeam = async (teamId, teamData) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(
      `https://backend-esports.up.railway.app/api/admin/teams/${teamId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teamData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update team");
    }
    const data = await response.json();
    return data; // Return the updated team data or confirmation
  } catch (error) {
    throw new Error("Error updating team: " + error.message);
  }
};

/**
 * Delete a team
 * @param {string} teamId - The team ID
 * @returns {Promise<Object>} Confirmation message
 */
export const deleteTeam = async (teamId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(
      `https://backend-esports.up.railway.app/api/admin/teams/${teamId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete team");
    }
    const data = await response.json();
    return data; // Return confirmation message
  } catch (error) {
    throw new Error("Error deleting team: " + error.message);
  }
};

/**
 * Fetch team details by ID along with full player details for each team member
 * @param {string} teamId - The team ID
 * @returns {Promise<Object>} Team details with array of player objects
 */
export const fetchTeamWithPlayers = async (teamId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    // First, fetch the team details
    const teamResponse = await fetch(
      `https://backend-esports.up.railway.app/api/admin/teams/${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!teamResponse.ok) {
      throw new Error("Failed to fetch team details");
    }

    const teamData = await teamResponse.json();

    // If team doesn't have members or there's no members array
    if (
      !teamData.members ||
      !Array.isArray(teamData.members) ||
      teamData.members.length === 0
    ) {
      return { ...teamData, players: [] };
    }

    // Fetch all players data to avoid multiple API calls
    const playersResponse = await fetch(
      "https://backend-esports.up.railway.app/api/admin/players",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!playersResponse.ok) {
      throw new Error("Failed to fetch players data");
    }

    const allPlayers = await playersResponse.json();

    // Filter players that are in the team
    const teamPlayers = allPlayers.filter((player) =>
      teamData.members.includes(player._id)
    );

    // Fetch captain details if available
    let captain = null;
    if (teamData.captain_id) {
      captain = allPlayers.find((player) => player._id === teamData.captain_id);
    }

    // Return team data with players and captain details
    return {
      ...teamData,
      players: teamPlayers,
      captain: captain,
    };
  } catch (error) {
    throw new Error(`Error fetching team with players: ${error.message}`);
  }
};

/**
 * Fetch teams by tournament ID
 * @param {string} tournamentId - The tournament ID
 * @returns {Promise<Array>} Array of teams participating in the specified tournament
 */
export const fetchTeamsByTournament = async (tournamentId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    // First fetch tournament details to get participating teams
    const tournamentResponse = await fetch(
      `https://backend-esports.up.railway.app/api/admin/tournaments/${tournamentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!tournamentResponse.ok) {
      throw new Error("Failed to fetch tournament details");
    }

    const tournamentData = await tournamentResponse.json();

    if (
      !tournamentData.teams_participating ||
      tournamentData.teams_participating.length === 0
    ) {
      return [];
    }

    // For the purpose of creating standings, we'll return the teams with additional win/loss stats
    // In a real app, you would fetch this data from the backend
    return tournamentData.teams_participating.map((team) => ({
      ...team,
      matches_played: Math.floor(Math.random() * 10) + 1,
      matches_won: Math.floor(Math.random() * 8),
      matches_lost: Math.floor(Math.random() * 5),
      score: Math.floor(Math.random() * 30),
    }));
  } catch (error) {
    throw new Error("Error fetching teams for tournament: " + error.message);
  }
};

/**
 * Generate team standings from match results
 * @param {Array} teams - Array of teams
 * @param {Array} matches - Array of matches
 * @returns {Array} Array of teams with standings data
 */
export const generateTeamStandings = (teams, matches) => {
  // Create a map to store team statistics
  const teamStats = {};

  // Initialize team stats
  teams.forEach((team) => {
    teamStats[team._id] = {
      ...team,
      matches_played: 0,
      matches_won: 0,
      matches_lost: 0,
      score_for: 0,
      score_against: 0,
      points: 0,
    };
  });

  // Calculate statistics based on completed matches
  matches.forEach((match) => {
    if (match.status === "completed") {
      // Update team A stats
      if (teamStats[match.team_a_id]) {
        teamStats[match.team_a_id].matches_played += 1;
        teamStats[match.team_a_id].score_for += match.result_team_a_score;
        teamStats[match.team_a_id].score_against += match.result_team_b_score;

        if (match.winner_team_id === match.team_a_id) {
          teamStats[match.team_a_id].matches_won += 1;
          teamStats[match.team_a_id].points += 3; // 3 points for a win
        } else {
          teamStats[match.team_a_id].matches_lost += 1;
        }
      }

      // Update team B stats
      if (teamStats[match.team_b_id]) {
        teamStats[match.team_b_id].matches_played += 1;
        teamStats[match.team_b_id].score_for += match.result_team_b_score;
        teamStats[match.team_b_id].score_against += match.result_team_a_score;

        if (match.winner_team_id === match.team_b_id) {
          teamStats[match.team_b_id].matches_won += 1;
          teamStats[match.team_b_id].points += 3; // 3 points for a win
        } else {
          teamStats[match.team_b_id].matches_lost += 1;
        }
      }
    }
  });

  // Convert to array and sort by points (descending)
  return Object.values(teamStats).sort((a, b) => b.points - a.points);
};

