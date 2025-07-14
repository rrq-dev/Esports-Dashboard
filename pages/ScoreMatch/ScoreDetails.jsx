import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function ScoreDetail() {
  const { id } = useParams();

  const match = {
    id,
    teamA: "RRQ",
    teamB: "EVOS",
    scoreA: 2,
    scoreB: 1,
    date: "2025-06-02",
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Detail Pertandingan</h1>
      <Card>
        <CardContent className="p-4 space-y-2">
          <p>
            <strong>ID:</strong> {match.id}
          </p>
          <p>
            <strong>Pertandingan:</strong> {match.teamA} vs {match.teamB}
          </p>
          <p>
            <strong>Skor:</strong> {match.scoreA} - {match.scoreB}
          </p>
          <p>
            <strong>Tanggal:</strong> {match.date}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
