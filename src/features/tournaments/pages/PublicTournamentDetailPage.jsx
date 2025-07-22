import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AppSidebar } from "@/components/common/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchPublicTournamentById } from "@/api/tournament";
import { purchaseTicket } from "@/api/user_ticket";
import { format } from "date-fns";
import { Calendar, Ticket } from "lucide-react";

export function PublicTournamentDetailPage() {
  const { id: tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTournamentDetails = async () => {
      try {
        const data = await fetchPublicTournamentById(tournamentId);
        setTournament(data);
      } catch (err) {
        toast.error("Gagal memuat detail turnamen.");
      } finally {
        setIsLoading(false);
      }
    };
    loadTournamentDetails();
  }, [tournamentId]);
  
  const handlePurchase = async (matchId) => {
    try {
      await purchaseTicket(matchId);
      toast.success("Tiket berhasil dibeli!");
    } catch (error) {
       toast.error(error.message || "Gagal membeli tiket.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // TODO: Add Skeleton
  }

  if (!tournament) {
    return <div>Turnamen tidak ditemukan.</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{tournament.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{tournament.name}</CardTitle>
              <CardDescription>{tournament.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Hadiah:</strong> {tournament.prize_pool}</p>
              <p><strong>Tanggal:</strong> {format(new Date(tournament.start_date), "dd MMM")} - {format(new Date(tournament.end_date), "dd MMM yyyy")}</p>
            </CardContent>
          </Card>

          <section>
            <h2 className="text-2xl font-bold mb-4">Jadwal Pertandingan</h2>
            <div className="space-y-4">
              {tournament.matches && tournament.matches.length > 0 ? (
                tournament.matches.map(match => (
                  <Card key={match._id}>
                    <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex-1">
                        <Badge>{match.round}</Badge>
                        <div className="flex items-center justify-between text-xl font-bold my-2">
                          <span>{match.team_a.team_name}</span>
                          <span className="text-muted-foreground mx-4">vs</span>
                          <span>{match.team_b.team_name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(match.match_date), "eeee, dd MMMM yyyy")} - {match.match_time}
                        </div>
                      </div>
                      <Button onClick={() => handlePurchase(match._id)} disabled={match.status !== 'scheduled'}>
                        <Ticket className="h-4 w-4 mr-2" />
                        {match.status === 'scheduled' ? 'Beli Tiket' : 'Pertandingan Selesai'}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>Tidak ada jadwal pertandingan untuk turnamen ini.</p>
              )}
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
} 