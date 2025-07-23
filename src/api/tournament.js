export const fetchAllTournamentsPublic = async () => {
  try {
    const response = await fetch("https://backend-esports.up.railway.app/api/tournaments");
    if (!response.ok) {
      throw new Error("Gagal memuat data turnamen.");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching public tournaments:", error);
    throw error;
  }
};

export const fetchPublicTournamentById = async (tournamentId) => {
  try {
    const response = await fetch(`https://backend-esports.up.railway.app/api/tournaments/${tournamentId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memuat detail turnamen.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching public tournament details:", error);
    throw error;
  }
};

export const createTournament = async (tournamentData) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;
    
  try {
    const response = await fetch("https://backend-esports.up.railway.app/api/admin/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tournamentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal membuat turnamen.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating tournament:", error);
    throw error;
  }
};

export const fetchTournamentById = async (tournamentId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;
    
  try {
    // Using admin endpoint to get full details including participants
    const response = await fetch(`https://backend-esports.up.railway.app/api/admin/tournaments/${tournamentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memuat detail turnamen.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tournament details:", error);
    throw error;
  }
};

export const updateTournament = async (tournamentId, tournamentData) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;
    
  try {
    const response = await fetch(`https://backend-esports.up.railway.app/api/admin/tournaments/${tournamentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tournamentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengupdate turnamen.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating tournament:", error);
    throw error;
  }
};

export const deleteTournament = async (tournamentId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;
    
  try {
    const response = await fetch(`https://backend-esports.up.railway.app/api/admin/tournaments/${tournamentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menghapus turnamen.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting tournament:", error);
    throw error;
  }
};
