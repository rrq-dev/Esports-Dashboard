import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function TournamentForm() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Form Turnamen</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="name">Nama Turnamen</Label>
          <Input id="name" placeholder="Masukkan nama turnamen" />
        </div>
        <div>
          <Label htmlFor="season">Musim</Label>
          <Input id="season" placeholder="Contoh: Season 1" />
        </div>
        <div>
          <Label htmlFor="start">Tanggal Mulai</Label>
          <Input id="start" type="date" />
        </div>
        <div>
          <Label htmlFor="end">Tanggal Selesai</Label>
          <Input id="end" type="date" />
        </div>
        <Button type="submit">Simpan</Button>
      </form>
    </div>
  );
}
