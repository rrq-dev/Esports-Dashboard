import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/common/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchMyTickets } from "@/api/user_ticket";
import { format } from "date-fns";
import { Calendar, Ticket } from "lucide-react";

export function MyTicketsPage() {
  const [myTickets, setMyTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMyTickets = async () => {
      try {
        const data = await fetchMyTickets();
        setMyTickets(data);
      } catch (err) {
        toast.error("Gagal memuat tiket Anda.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMyTickets();
  }, []);

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
            ) : myTickets.length > 0 ? (
              myTickets.map((ticket, index) => (
                <Card key={`${ticket._id}-${index}`} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">Tiket Pertandingan</CardTitle>
                    <CardDescription>
                      Purchased on {format(new Date(ticket.purchase_date), "dd MMM yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {ticket.match_details ? (
                      <>
                        <div className="font-bold text-center text-xl my-2">
                          {ticket.match_details.team_a.team_name} vs {ticket.match_details.team_b.team_name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(ticket.match_details.match_date), "eeee, dd MMMM yyyy")} - {ticket.match_details.match_time}
                        </div>
                      </>
                    ) : (
                      <p>Detail pertandingan tidak tersedia.</p>
                    )}
                  </CardContent>
                  <div className="p-6 pt-0 text-center">
                     <Badge variant={ticket.status === 'valid' ? 'default' : 'secondary'}>
                      {ticket.status.toUpperCase()}
                    </Badge>
                  </div>
                </Card>
              ))
            ) : (
              <p>Anda belum memiliki tiket.</p>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
} 