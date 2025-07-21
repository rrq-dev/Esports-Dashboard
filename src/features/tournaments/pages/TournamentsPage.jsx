import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/common/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllTournamentsPublic } from "@/api/tournament";
import { toast } from "sonner";
import { PlusCircle, CalendarDays, Award } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/cn";

const statusColors = {
  upcoming: "bg-blue-500 hover:bg-blue-600",
  ongoing: "bg-green-500 hover:bg-green-600",
  completed: "bg-gray-500 hover:bg-gray-600",
};

export function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTournaments = async () => {
      try {
        const data = await fetchAllTournamentsPublic();
        setTournaments(data);
      } catch (err) {
        setError(err.message);
        toast.error("Gagal memuat turnamen: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getTournaments();
  }, []);

  const renderSkeletons = () => (
    Array.from({ length: 3 }).map((_, index) => (
      <Card key={index}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex items-center pt-2">
              <Skeleton className="h-5 w-5 mr-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    ))
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild><Link to="/dashboard">Dashboard</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem><BreadcrumbPage>Tournaments</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Daftar Turnamen</h1>
            <Button className="flex items-center gap-2" asChild>
              <Link to="/dashboard/tournaments/add">
                <PlusCircle className="h-4 w-4" />
                Buat Turnamen Baru
              </Link>
            </Button>
          </div>

          {error && <div className="text-red-500 text-center py-4">Error: {error}</div>}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? renderSkeletons() : tournaments.map((tournament) => (
              <Card key={tournament._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="pr-2">{tournament.name}</CardTitle>
                    <Badge className={cn("whitespace-nowrap", statusColors[tournament.status])}>
                      {tournament.status}
                    </Badge>
                  </div>
                  <CardDescription>{tournament.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                       <CalendarDays className="mr-2 h-4 w-4" />
                       <span>
                         {format(new Date(tournament.start_date), "dd MMM yyyy")} - {format(new Date(tournament.end_date), "dd MMM yyyy")}
                       </span>
                    </div>
                     <div className="flex items-center text-sm text-muted-foreground">
                       <Award className="mr-2 h-4 w-4" />
                       <span>{tournament.prize_pool}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                   <Button asChild className="w-full">
                     <Link to={`/dashboard/tournaments/${tournament._id}`}>Lihat Detail</Link>
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
           {!isLoading && tournaments.length === 0 && !error && (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold">Belum ada turnamen</h3>
              <p className="text-muted-foreground mt-2">Buat turnamen baru untuk memulai.</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 