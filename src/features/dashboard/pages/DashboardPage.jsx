import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/common/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { fetchAllTournamentsPublic } from "@/api/tournament";
import { fetchAllTeams } from "@/api/team";
import { fetchAllMatches } from "@/api/match";

export function DashboardPage() {
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tournamentsData = await fetchAllTournamentsPublic();
        const teamsData = await fetchAllTeams();
        const matchesData = await fetchAllMatches();

        setTournaments(tournamentsData);
        setTeams(teamsData);
        setMatches(matchesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate match status data
  const completedMatches =
    matches.filter((match) => match.status === "completed").length || 0;
  const upcomingMatches =
    matches.filter((match) => match.status === "scheduled").length || 0;
  const completedPercentage = matches.length
    ? Math.round((completedMatches / matches.length) * 100)
    : 0;
  const upcomingPercentage = matches.length
    ? Math.round((upcomingMatches / matches.length) * 100)
    : 0;

  // Calculate match distribution by tournament
  const getMatchesByTournament = () => {
    const tournamentMatches = {};

    matches.forEach((match) => {
      if (match.tournament_id) {
        tournamentMatches[match.tournament_id] =
          (tournamentMatches[match.tournament_id] || 0) + 1;
      }
    });

    // Get tournament names
    const result = Object.keys(tournamentMatches).map((tournamentId) => {
      const tournament = tournaments.find((t) => t._id === tournamentId);
      return {
        name: tournament ? tournament.name : "Unknown",
        value: tournamentMatches[tournamentId],
      };
    });

    return result.slice(0, 10); // Limit to 10 tournaments for better visualization
  };

  const matchesByTournament = getMatchesByTournament();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
          {/* Welcome Card */}
          <Card className="bg-background border-border">
            <CardContent className="p-6 flex gap-4 items-center">
              <div className="rounded-full bg-primary p-3 text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M3 7V5c0-1.1.9-2 2-2h2"></path>
                  <path d="M17 3h2c1.1 0 2 .9 2 2v2"></path>
                  <path d="M21 17v2c0 1.1-.9 2-2 2h-2"></path>
                  <path d="M7 21H5c-1.1 0-2-.9-2-2v-2"></path>
                  <rect width="7" height="5" x="7" y="7" rx="1"></rect>
                  <rect width="7" height="5" x="10" y="12" rx="1"></rect>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Selamat datang, Admin!</h2>
                <p className="text-muted-foreground">
                  Kelola data esports dengan mudah. Pantau statistik, update
                  data, dan pastikan layanan berjalan lancar.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-background border-border">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">
                  <div className="bg-muted/80 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center py-2">
                <CardTitle className="text-4xl font-bold">
                  {tournaments.length}
                </CardTitle>
                <p className="text-center text-muted-foreground mt-1">
                  Total Tournaments
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">
                  <div className="bg-muted/80 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center py-2">
                <CardTitle className="text-4xl font-bold">
                  {teams.length}
                </CardTitle>
                <p className="text-center text-muted-foreground mt-1">
                  Team Aktif
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">
                  <div className="bg-muted/80 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"></path>
                      <path d="M8 9v7"></path>
                      <path d="M16 9v7"></path>
                      <path d="M12 12v4"></path>
                      <path d="M12 8v0"></path>
                    </svg>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center py-2">
                <CardTitle className="text-4xl font-bold">
                  {matches.length}
                </CardTitle>
                <p className="text-center text-muted-foreground mt-1">
                  Total Match
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Management Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-background border-border border-l-[3px] border-l-primary">
              <CardContent className="p-6">
                <div className="flex mb-2">
                  <div className="bg-muted/80 p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Users</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Kelola data users
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link to="/dashboard/users">
                    <span>Manage</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-background border-border border-l-[3px] border-l-primary">
              <CardContent className="p-6">
                <div className="flex mb-2">
                  <div className="bg-muted/80 p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Players</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Kelola data players
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link to="/dashboard/players">
                    <span>Manage</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-background border-border border-l-[3px] border-l-primary">
              <CardContent className="p-6">
                <div className="flex mb-2">
                  <div className="bg-muted/80 p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Teams</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Kelola data tim
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link to="/dashboard/teams">
                    <span>Manage</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-background border-border border-l-[3px] border-l-primary">
              <CardContent className="p-6">
                <div className="flex mb-2">
                  <div className="bg-muted/80 p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"></path>
                      <path d="M8 9v7"></path>
                      <path d="M16 9v7"></path>
                      <path d="M12 12v4"></path>
                      <path d="M12 8v0"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Matches</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Kelola data match
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link to="/dashboard/matches">
                    <span>Manage</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-background border-border border-l-[3px] border-l-primary">
              <CardContent className="p-6">
                <div className="flex mb-2">
                  <div className="bg-muted/80 p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Tournaments</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Kelola data tournament
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link to="/dashboard/tournaments">
                    <span>Manage</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Match Status Chart using shadcn styling */}
            <Card className="bg-background border-border">
              <CardHeader>
                <CardTitle>Status Match</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span>Completed</span>
                      </div>
                      <span>{completedMatches} matches</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${completedPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-muted-foreground"></div>
                        <span>Upcoming</span>
                      </div>
                      <span>{upcomingMatches} matches</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-muted-foreground"
                        style={{ width: `${upcomingPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matches by Tournament Chart using shadcn styling */}
            <Card className="bg-background border-border">
              <CardHeader>
                <CardTitle>Distribusi Match Berdasarkan Tournament</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {matchesByTournament.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary opacity-80"></div>
                          <span
                            className="text-sm truncate max-w-[200px]"
                            title={item.name}
                          >
                            {item.name}
                          </span>
                        </div>
                        <span>{item.value} matches</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(
                              100,
                              (item.value /
                                Math.max(
                                  ...matchesByTournament.map((t) => t.value)
                                )) *
                                100
                            )}%`,
                            opacity:
                              0.7 + 0.3 * (index / matchesByTournament.length),
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
