import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/common/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchMyTickets } from "@/api/user_ticket";
import { format } from "date-fns";
import { Calendar, Ticket } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function MyTicketsPage() {
  const [myTickets, setMyTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMyTickets = async () => {
      try {
        const data = await fetchMyTickets();
        setMyTickets(data || []);
      } catch (err) {
        toast.error("Gagal memuat tiket Anda.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMyTickets();
  }, []);

  const renderSkeletons = () => (
    Array.from({ length: 3 }).map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <CardHeader className="p-0">
          <Skeleton className="h-32 w-full" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
        <CardFooter className="p-4">
          <Skeleton className="h-6 w-20" />
        </CardFooter>
      </Card>
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
              <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Tiket Saya</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-bold">Tiket Saya</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              renderSkeletons()
            ) : myTickets.length > 0 ? (
              myTickets.map((ticket) => {
                const { match_details: match } = ticket;
                // if (!match) return null; // We will now handle the case where match is null
                return (
                  <Card key={ticket._id} className="flex flex-col overflow-hidden transition-transform hover:scale-105">
                    {match ? (
                      <>
                        <CardHeader className="relative p-0 h-32 bg-muted flex items-center justify-center">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-background">
                              <AvatarImage src={match.team_a?.logo_url} alt={match.team_a?.team_name} />
                              <AvatarFallback>{match.team_a?.team_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xl font-bold text-muted-foreground">VS</span>
                            <Avatar className="h-16 w-16 border-2 border-background">
                              <AvatarImage src={match.team_b?.logo_url} alt={match.team_b?.team_name} />
                              <AvatarFallback>{match.team_b?.team_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <Badge className="absolute top-2 right-2">{match.round}</Badge>
                        </CardHeader>
                        <CardContent className="flex-grow p-4">
                          <h3 className="text-lg font-bold text-center mb-2">
                            {match.team_a?.team_name || 'N/A'} vs {match.team_b?.team_name || 'N/A'}
                          </h3>
                          <div className="text-sm text-muted-foreground flex items-center justify-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {match.match_date ? format(new Date(match.match_date), "eeee, dd MMM yyyy") : 'N/A'} - {match.match_time || ''}
                          </div>
                          <p className="text-center text-2xl font-bold my-3">
                            {match.result_team_a_score ?? '-'} : {match.result_team_b_score ?? '-'}
                          </p>
                        </CardContent>
                      </>
                    ) : (
                      <CardContent className="flex-grow p-4 flex flex-col items-center justify-center text-center">
                         <h3 className="text-lg font-bold text-destructive mb-2">
                          Pertandingan Dihapus
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Detail pertandingan untuk tiket ini tidak lagi tersedia.
                        </p>
                      </CardContent>
                    )}
                    <CardFooter className="p-4 bg-muted/50 flex justify-between items-center">
                       <Badge variant={ticket.status === 'valid' ? 'default' : 'secondary'}>
                        {ticket.status.toUpperCase()}
                      </Badge>
                       <p className="text-xs text-muted-foreground">
                        Dibeli pada {ticket.purchase_date ? format(new Date(ticket.purchase_date), "dd MMM yyyy") : 'N/A'}
                      </p>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
               <div className="col-span-full text-center py-10">
                <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Anda Belum Memiliki Tiket</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Jelajahi turnamen yang tersedia dan beli tiket untuk mendukung tim favorit Anda!
                </p>
                <Button asChild className="mt-4">
                  <Link to="/home">Lihat Turnamen</Link>
                </Button>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
} 