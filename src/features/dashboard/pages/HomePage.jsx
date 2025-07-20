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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Ticket, Trophy, Users, Clock, Medal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import API functions
import { fetchAllTournaments, fetchTournamentById } from "@/api/tournament";
import { fetchMatchesByTournament } from "@/api/match";
import { fetchTeamsByTournament, generateTeamStandings } from "@/api/team";

export function HomePage() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teamStandings, setTeamStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch active tournaments (upcoming and ongoing)
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const allTournaments = await fetchAllTournaments();
        // Filter tournaments that are not completed
        const activeTournaments = allTournaments
          .filter((t) => t.status !== "completed")
          .slice(0, 6);

        setTournaments(activeTournaments);

        // Select the first tournament if available
        if (activeTournaments.length > 0) {
          setSelectedTournament(activeTournaments[0]._id);
          fetchTournamentDetails(activeTournaments[0]._id);
        }
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        setError("Gagal memuat data turnamen. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const fetchTournamentDetails = async (tournamentId) => {
    setLoading(true);
    try {
      // Fetch tournament details
      await fetchTournamentById(tournamentId);

      // Fetch matches for this tournament
      const matchesData = await fetchMatchesByTournament(tournamentId);
      setMatches(matchesData);

      // Fetch teams for this tournament
      const teamsData = await fetchTeamsByTournament(tournamentId);

      // Generate team standings
      if (teamsData.length > 0 && matchesData.length > 0) {
        const standings = generateTeamStandings(teamsData, matchesData);
        setTeamStandings(standings);
      } else {
        // If no match data, use mock data from the API
        setTeamStandings(teamsData);
      }
    } catch (error) {
      console.error("Error fetching tournament details:", error);
      setError("Gagal memuat detail turnamen. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleTournamentSelect = (tournamentId) => {
    setSelectedTournament(tournamentId);
    fetchTournamentDetails(tournamentId);
  };

  const handleBuyTicket = (matchId) => {
    // Implement ticket purchase logic here
    console.log(`Buy ticket for match ${matchId}`);
    // For demonstration purposes only
    alert("Fitur pembelian tiket akan segera tersedia!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMatchStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to="/home">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Esports Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Upcoming Tournaments Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Turnamen Mendatang</h2>
              <Link to="/tournaments">
                <Button variant="outline">Lihat Semua</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading && !error ? (
                // Loading state
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    </CardFooter>
                  </Card>
                ))
              ) : tournaments.length > 0 ? (
                tournaments.map((tournament) => (
                  <Card
                    key={tournament._id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedTournament === tournament._id
                        ? "border-primary"
                        : ""
                    }`}
                    onClick={() => handleTournamentSelect(tournament._id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {tournament.name}
                        </CardTitle>
                        <Badge className={getStatusColor(tournament.status)}>
                          {tournament.status === "upcoming"
                            ? "Mendatang"
                            : tournament.status === "ongoing"
                            ? "Berlangsung"
                            : "Selesai"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(tournament.start_date)} -{" "}
                        {formatDate(tournament.end_date)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {tournament.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center text-sm">
                        <Trophy className="h-4 w-4 mr-2" />
                        <span>Hadiah: {tournament.prize_pool}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-32">
                    {error
                      ? "Gagal memuat data"
                      : "Tidak ada turnamen mendatang"}
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Tournament Details and Team Standings Section */}
          {selectedTournament && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Detail Turnamen & Klasemen Team
              </h2>
              <Tabs defaultValue="standings">
                <TabsList className="mb-4">
                  <TabsTrigger value="standings">Klasemen Team</TabsTrigger>
                  <TabsTrigger value="schedule">
                    Jadwal Pertandingan
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="standings"
                  className="p-4 border rounded-md"
                >
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2">Memuat klasemen team...</p>
                    </div>
                  ) : teamStandings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableCaption>
                          Klasemen Team Turnamen Esports
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[60px]">Pos</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead className="text-center">MP</TableHead>
                            <TableHead className="text-center">W</TableHead>
                            <TableHead className="text-center">L</TableHead>
                            <TableHead className="text-center">
                              Points
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teamStandings.map((team, index) => (
                            <TableRow key={team._id || index}>
                              <TableCell className="font-medium">
                                {index + 1}
                                {index < 3 && (
                                  <Medal
                                    className={`inline-block ml-1 h-4 w-4 ${
                                      index === 0
                                        ? "text-yellow-500"
                                        : index === 1
                                        ? "text-gray-400"
                                        : "text-amber-700"
                                    }`}
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {team.logo_url && (
                                    <img
                                      src={team.logo_url}
                                      alt={team.team_name}
                                      className="h-6 w-6 mr-2 rounded-full"
                                    />
                                  )}
                                  <span>{team.team_name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {team.matches_played}
                              </TableCell>
                              <TableCell className="text-center text-green-600">
                                {team.matches_won}
                              </TableCell>
                              <TableCell className="text-center text-red-600">
                                {team.matches_lost}
                              </TableCell>
                              <TableCell className="text-center font-bold">
                                {team.points || team.score}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p>Klasemen team belum tersedia</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="schedule" className="border rounded-md">
                  <div className="overflow-hidden">
                    <div className="bg-white shadow-sm overflow-hidden">
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="mt-2">Memuat jadwal pertandingan...</p>
                        </div>
                      ) : matches.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {matches.map((match) => (
                            <li key={match._id} className="p-4">
                              <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      className={getMatchStatusColor(
                                        match.status
                                      )}
                                    >
                                      {match.status === "scheduled"
                                        ? "Terjadwal"
                                        : match.status === "ongoing"
                                        ? "Berlangsung"
                                        : "Selesai"}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {match.round}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex-1">
                                      <span className="font-medium">
                                        {match.team_a?.team_name || "TBD"}
                                      </span>
                                    </div>
                                    <div className="px-2 font-bold">VS</div>
                                    <div className="flex-1 text-right">
                                      <span className="font-medium">
                                        {match.team_b?.team_name || "TBD"}
                                      </span>
                                    </div>
                                  </div>
                                  {match.status === "completed" && (
                                    <div className="flex items-center justify-center text-center">
                                      <span className="font-bold">
                                        {match.result_team_a_score} -{" "}
                                        {match.result_team_b_score}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {formatDate(match.match_date)}
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {match.match_time}
                                  </div>
                                  {match.location && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Users className="h-4 w-4 mr-2" />
                                      {match.location}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  {match.status !== "completed" && (
                                    <Button
                                      className="w-full sm:w-auto"
                                      onClick={() => handleBuyTicket(match._id)}
                                    >
                                      <Ticket className="h-4 w-4 mr-2" />
                                      Beli Tiket
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-8">
                          <p>Tidak ada jadwal pertandingan tersedia</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
