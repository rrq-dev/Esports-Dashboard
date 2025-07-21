import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/common/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchAllTournamentsPublic } from "@/api/tournament";
import { format } from "date-fns";

export function HomePage() {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await fetchAllTournamentsPublic();
        setTournaments(data);
      } catch (err) {
        toast.error("Gagal memuat turnamen.");
      } finally {
        setIsLoading(false);
      }
    };
    loadTournaments();
  }, []);

  const renderSkeletons = () => (
    Array.from({ length: 3 }).map((_, index) => (
      <Card key={index}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-24" />
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
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Selamat Datang, {currentUser?.username || "Pengguna"}!</h1>
            <p className="text-muted-foreground">Jelajahi turnamen yang akan datang dan saksikan pertandingannya.</p>
          </div>

          <h2 className="text-xl font-semibold">Turnamen Tersedia</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? renderSkeletons() : tournaments.map(t => (
              <Card key={t._id}>
                <CardHeader>
                  <CardTitle>{t.name}</CardTitle>
                  <CardDescription>{t.status === 'upcoming' ? `Mulai ${format(new Date(t.start_date), "dd MMMM yyyy")}` : `Berakhir ${format(new Date(t.end_date), "dd MMMM yyyy")}`}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{t.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link to={`/tournaments/${t._id}`}>Lihat Detail</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
