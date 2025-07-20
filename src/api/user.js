export const fetchAllUsers = async () => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(
      "https://embeck.onrender.com/api/admin/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch users data");
    }
    const data = await response.json();
    return data.data; // Return the 'data' array from the response
  } catch (error) {
    throw new Error("Error fetching users data: " + error.message);
  }
};

export const fetchUserById = async (userId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(
      `http://localhost:1010/api/admin/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data; // Return the user data object
  } catch (error) {
    throw new Error("Error fetching user data: " + error.message);
  }
};

export const updateUser = async (userId, userData) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(
      `http://localhost:1010/api/admin/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update user");
    }
    const data = await response.json();
    return data; // Return the updated user data or confirmation
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

export const deleteUser = async (userId) => {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  try {
    const response = await fetch(
      `http://localhost:1010/api/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete user");
    }
    const data = await response.json();
    return data; // Return confirmation message
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
};
