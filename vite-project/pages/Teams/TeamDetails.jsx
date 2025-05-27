import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function TeamDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Detail Tim</h1>
      <Card>
        <CardContent className="p-4">
          <p>
            <strong>ID:</strong> {id}
          </p>
          <p>
            <strong>Nama Tim:</strong> (Dummy Tim Info)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
