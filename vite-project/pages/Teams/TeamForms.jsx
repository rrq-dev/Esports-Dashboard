import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function TeamForm() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Form Tim</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="name">Nama Tim</Label>
          <Input id="name" placeholder="Masukkan nama tim" />
        </div>
        <Button type="submit">Simpan</Button>
      </form>
    </div>
  );
}
