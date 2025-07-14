import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function PlayerDetail() {
  const { id } = useParams();

  // Simulasi data dummy (di implementasi real, fetch dari API/backend)
  const player = {
    id,
    name: "Albert",
    role: "Jungler",
    team: "RRQ",
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Detail Pemain</h1>
      <Card>
        <CardContent className="p-4 space-y-2">
          <p>
            <strong>ID:</strong> {player.id}
          </p>
          <p>
            <strong>Nama:</strong> {player.name}
          </p>
          <p>
            <strong>Role:</strong> {player.role}
          </p>
          <p>
            <strong>Tim:</strong> {player.team}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
