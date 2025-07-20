export const fetchAllTeams = async () => {
  const token = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).token : null;

  try {
    const response = await fetch('http://localhost:1010/api/teams', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch teams data');
    }
    const data = await response.json();
    return data; // Sesuaikan jika ada struktur data lain di respons backend
  } catch (error) {
    throw new Error('Error fetching teams data: ' + error.message);
  }
}; 