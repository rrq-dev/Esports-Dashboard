import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/common/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllMatches, deleteMatch } from "@/api/match";
import { fetchAllTournamentsPublic } from "@/api/tournament";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [matchToDelete, setMatchToDelete] = useState(null);

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await fetchAllTournamentsPublic();
        setTournaments(data);
      } catch (err) {
        toast.error("Gagal memuat daftar turnamen.");
      }
    };
    loadTournaments();
  }, []);

  useEffect(() => {
    const loadMatches = async () => {
      setIsLoading(true);
      try {
        const tournamentIdToFetch = selectedTournament === 'all' ? null : selectedTournament;
        const data = await fetchAllMatches(tournamentIdToFetch);
        setMatches(data);
      } catch (err) {
        toast.error("Gagal memuat data pertandingan.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMatches();
  }, [selectedTournament]);

  const handleDeleteClick = (match) => {
    setMatchToDelete(match);
  };

  const confirmDelete = async () => {
    if (!matchToDelete) return;
    try {
      await deleteMatch(matchToDelete._id);
      toast.success("Pertandingan berhasil dihapus.");
      setMatches(matches.filter(m => m._id !== matchToDelete._id));
      setMatchToDelete(null); // Close the dialog
    } catch (err) {
      toast.error(err.message || "Gagal menghapus pertandingan.");
    }
  };

  const renderSkeletons = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><Link to="/dashboard">Dashboard</Link></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Matches</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Manajemen Pertandingan</h1>
            <div className="flex items-center gap-4">
               <Select onValueChange={setSelectedTournament} value={selectedTournament || 'all'}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Pilih Turnamen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Turnamen</SelectItem>
                  {tournaments.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button asChild><Link to="/dashboard/matches/add"><PlusCircle className="h-4 w-4 mr-2" />Buat Pertandingan</Link></Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Tim Bertanding</TableHead>
                  <TableHead>Skor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? renderSkeletons() : matches.length > 0 ? matches.map((match) => (
                  <TableRow key={match._id}>
                    <TableCell>
                      <div>{format(new Date(match.match_date), "dd MMM yyyy")}</div>
                      <div className="text-xs text-muted-foreground">{match.match_time}</div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-1/2 justify-end">
                           <span className="text-right">{match.team_a?.team_name ?? "(Tim tidak ditemukan)"}</span>
                           <Avatar className="h-8 w-8"><AvatarImage src={match.team_a?.logo_url} /><AvatarFallback>{match.team_a?.team_name?.charAt(0)}</AvatarFallback></Avatar>
                        </div>
                        <span className="text-muted-foreground">vs</span>
                        <div className="flex items-center gap-2 w-1/2">
                           <Avatar className="h-8 w-8"><AvatarImage src={match.team_b?.logo_url} /><AvatarFallback>{match.team_b?.team_name?.charAt(0)}</AvatarFallback></Avatar>
                           <span>{match.team_b?.team_name ?? "(Tim tidak ditemukan)"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-lg">
                      {match.result_team_a_score != null && match.result_team_b_score != null ? `${match.result_team_a_score} - ${match.result_team_b_score}` : '-'}
                    </TableCell>
                     <TableCell><Badge>{match.status}</Badge></TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" asChild><Link to={`/dashboard/matches/edit/${match._id}`}><Pencil className="h-4 w-4" /></Link></Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(match)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={5} className="text-center h-24">
                    {selectedTournament === 'all' ? "Tidak ada data pertandingan." : "Tidak ada data pertandingan untuk turnamen ini."}
                  </TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <AlertDialog open={!!matchToDelete} onOpenChange={(isOpen) => !isOpen && setMatchToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak bisa dibatalkan. Pertandingan akan dihapus secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
} 