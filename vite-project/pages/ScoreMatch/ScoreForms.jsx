import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ScoreForm() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Form Skor Pertandingan</h1>
      <form className="space-y-4">
        <div>
          <Label>Tim A</Label>
          <Input placeholder="Masukkan nama Tim A" />
        </div>
        <div>
          <Label>Skor Tim A</Label>
          <Input type="number" />
        </div>
        <div>
          <Label>Tim B</Label>
          <Input placeholder="Masukkan nama Tim B" />
        </div>
        <div>
          <Label>Skor Tim B</Label>
          <Input type="number" />
        </div>
        <div>
          <Label>Tanggal Pertandingan</Label>
          <Input type="date" />
        </div>
        <Button type="submit">Simpan</Button>
      </form>
    </div>
  );
}
