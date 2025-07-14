// src/pages/PlayerList.jsx
import { useEffect, useState } from "react";
import PlayerService from "@/lib/service/Player"; // ganti path ini sesuai struktur project-mu

function PlayerList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await PlayerService.getAll();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
        setPlayers([]); // fallback biar UI tetap jalan
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Player List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {player.in_game_name}
            </h2>
            <p className="text-sm text-gray-600 mb-1">Role: {player.role}</p>
            <p className="text-sm text-gray-500">Team ID: {player.team_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;
