import { useEffect, useState } from "react";
import axios from "axios";

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/api/tournament")
      .then((res) => {
        const result = Array.isArray(res.data) ? res.data : res.data.data || [];
        setTournaments(result);
      })
      .catch((err) => console.error("Failed to fetch tournaments", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tournament List</h1>
      {tournaments.length === 0 ? (
        <p className="text-gray-500">No tournaments available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tournaments.map((tourney) => (
            <div
              key={tourney.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {tourney.name}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                {tourney.start_date} — {tourney.end_date}
              </p>
              <p className="text-sm text-gray-700 mb-2">{tourney.location}</p>
              <p className="text-xs text-gray-400">
                Total Teams: {tourney.teams?.length || 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentList;
