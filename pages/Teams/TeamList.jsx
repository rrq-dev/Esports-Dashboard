// src/pages/TeamList.jsx
import { useEffect, useState } from "react";
import TeamService from "@/lib/service/Team"; // sesuaikan path kalau perlu

function TeamList() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await TeamService.getAll();

        const enrichedData = data.map((team, index) => {
          const win = Math.floor(Math.random() * 10);
          const lose = Math.floor(Math.random() * 10);
          const match = win + lose;
          const point = win * 2;

          return {
            ...team,
            rank: index + 1,
            match,
            win,
            lose,
            point,
          };
        });

        setTeams(enrichedData);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        setTeams([]);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Klasemen Tim</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Nama Tim</th>
              <th className="border px-4 py-2 text-center">Match</th>
              <th className="border px-4 py-2 text-center">Win</th>
              <th className="border px-4 py-2 text-center">Lose</th>
              <th className="border px-4 py-2 text-center">Poin</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, idx) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2 font-semibold">{team.name}</td>
                <td className="border px-4 py-2 text-center">{team.match}</td>
                <td className="border px-4 py-2 text-center">{team.win}</td>
                <td className="border px-4 py-2 text-center">{team.lose}</td>
                <td className="border px-4 py-2 text-center font-bold text-blue-600">
                  {team.point}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeamList;
