export const fetchAllMatches = async (tournamentId = null) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  // The tournamentId parameter is kept for potential future use, but the admin endpoint currently returns all matches.
  let url = "http://localhost:1010/api/admin/matches";
  if (tournamentId) {
    // Note: The backend admin endpoint GetAllMatches currently does not filter.
    // This is kept for UI compatibility.
    url += `?tournament_id=${tournamentId}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Gagal memuat data pertandingan.");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

export const createMatch = async (matchData) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch("http://localhost:1010/api/admin/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal membuat pertandingan.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating match:", error);
    throw error;
  }
};

export const fetchMatchById = async (matchId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(`http://localhost:1010/api/admin/matches/${matchId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Gagal memuat detail pertandingan.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching match by id:", error);
    throw error;
  }
};

export const updateMatch = async (matchId, matchData) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(`http://localhost:1010/api/admin/matches/${matchId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(matchData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal mengupdate pertandingan.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating match:", error);
    throw error;
  }
};

export const deleteMatch = async (matchId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(`http://localhost:1010/api/admin/matches/${matchId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal menghapus pertandingan.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting match:", error);
    throw error;
  }
};
