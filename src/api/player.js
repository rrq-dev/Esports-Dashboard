export const fetchAllPlayers = async () => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch("http://localhost:1010/api/admin/players", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch players data");
    }
    const data = await response.json();
    return data; // Sesuaikan jika ada struktur data lain di respons backend
  } catch (error) {
    throw new Error("Error fetching players data: " + error.message);
  }
};

export const createPlayer = async (playerData) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch("http://localhost:1010/api/admin/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(playerData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create player");
    }
    const data = await response.json();
    return data; // Return the created player data or confirmation
  } catch (error) {
    throw new Error("Error creating player: " + error.message);
  }
};

export const fetchPlayerById = async (playerId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(
      `http://localhost:1010/api/admin/players/${playerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch player data");
    }
    const data = await response.json();
    return data; // Return the player data object
  } catch (error) {
    throw new Error("Error fetching player data: " + error.message);
  }
};

export const updatePlayer = async (playerId, playerData) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(
      `http://localhost:1010/api/admin/players/${playerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(playerData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update player");
    }
    const data = await response.json();
    return data; // Return the updated player data or confirmation
  } catch (error) {
    throw new Error("Error updating player: " + error.message);
  }
};

export const deletePlayer = async (playerId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(
      `http://localhost:1010/api/admin/players/${playerId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete player");
    }
    const data = await response.json();
    return data; // Return confirmation message
  } catch (error) {
    throw new Error("Error deleting player: " + error.message);
  }
};
