const API_URL = "https://backend-esports.up.railway.app/api/auth";

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Simpan data user lengkap ke localStorage
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      token: data.token,
      role: data.role,
      userId: data.user_id,
      username: data.username,
      email: data.email,
    })
  );

  return data;
}

export async function registerUser(username, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Register failed");
  }

  return data;
}

// Fungsi untuk mengambil data user dari API
export const fetchUserData = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:1010/api/admin/users/${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching user data: " + error.message);
  }
};
