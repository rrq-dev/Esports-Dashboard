import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PlayerForm() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Form Pemain</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="name">Nama Pemain</Label>
          <Input id="name" placeholder="Masukkan nama pemain" />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" placeholder="Ex: Jungler, Roamer, etc." />
        </div>
        <div>
          <Label htmlFor="team">Tim</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Tim" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RRQ">RRQ</SelectItem>
              <SelectItem value="EVOS">EVOS</SelectItem>
              <SelectItem value="ONIC">ONIC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Simpan</Button>
      </form>
    </div>
  );
}
