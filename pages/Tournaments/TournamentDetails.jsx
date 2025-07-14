import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function TournamentDetail() {
  const { id } = useParams();

  const tournament = {
    id,
    name: "MLBB Championship",
    season: "Season 1",
    startDate: "2025-06-01",
    endDate: "2025-06-10",
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Detail Turnamen</h1>
      <Card>
        <CardContent className="p-4 space-y-2">
          <p>
            <strong>ID:</strong> {tournament.id}
          </p>
          <p>
            <strong>Nama:</strong> {tournament.name}
          </p>
          <p>
            <strong>Musim:</strong> {tournament.season}
          </p>
          <p>
            <strong>Mulai:</strong> {tournament.startDate}
          </p>
          <p>
            <strong>Selesai:</strong> {tournament.endDate}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
