const API_BASE_URL = "http://localhost:1010/api";

/**
 * "Purchases" a ticket for a specific match for the logged-in user.
 * @param {string} matchId The ID of the match to purchase a ticket for.
 * @returns {Promise<object>} The newly created user ticket object.
 */
export const purchaseTicket = async (matchId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  if (!token) {
    throw new Error("Anda harus login untuk membeli tiket.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tickets/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ match_id: matchId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal membeli tiket.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error purchasing ticket:", error);
    throw error;
  }
};

/**
 * Fetches all tickets owned by the currently authenticated user.
 * @returns {Promise<Array<object>>} An array of user ticket objects with populated match details.
 */
export const fetchMyTickets = async () => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  if (!token) {
    throw new Error("Anda harus login untuk melihat tiket Anda.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/me/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memuat tiket.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching my tickets:", error);
    throw error;
  }
}; 