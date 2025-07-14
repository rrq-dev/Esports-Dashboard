import { useEffect, useState } from "react";
import axios from "axios";

const ScoreList = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/api/score-match")
      .then((res) => {
        const result = Array.isArray(res.data) ? res.data : res.data.data || [];
        setScores(result);
      })
      .catch((err) => console.error("Failed to fetch score matches", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Match Scores</h1>
      {scores.length === 0 ? (
        <p className="text-gray-500">No match scores found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {scores.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {match.team1_id} vs {match.team2_id}
              </h2>
              <p className="text-sm text-gray-700 mb-1">
                Score: {match.team1_score} - {match.team2_score}
              </p>
              <p className="text-xs text-gray-500">{match.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoreList;
