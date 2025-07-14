import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Gamepad2, ListOrdered } from "lucide-react";

import TournamentService from "@/lib/service/Tournament";
import TeamService from "@/lib/service/Team";
import PlayerService from "@/lib/service/Player";
import ScoreService from "@/lib/service/ScoreMatch";

export default function UserDashboard() {
  const [summary, setSummary] = useState({
    teams: 0,
    players: 0,
    tournaments: 0,
    matches: 0,
  });

  const [latestTournament, setLatestTournament] = useState(null);
  const [latestMatch, setLatestMatch] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teams, players, tournaments, matches] = await Promise.all([
          TeamService.getAll(),
          PlayerService.getAll(),
          TournamentService.getAll(),
          ScoreService.getAll(),
        ]);

        const latestTourney = tournaments?.[tournaments.length - 1] ?? null;
        const latestScore = matches?.[matches.length - 1] ?? null;

        setSummary({
          teams: teams.length,
          players: players.length,
          tournaments: tournaments.length,
          matches: matches.length,
        });

        setLatestTournament(latestTourney);
        setLatestMatch(latestScore);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const cardData = [
    {
      title: "Total Tim",
      value: summary.teams,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      link: "/team",
    },
    {
      title: "Total Pemain",
      value: summary.players,
      icon: <Gamepad2 className="w-6 h-6 text-green-600" />,
      link: "/player",
    },
    {
      title: "Total Turnamen",
      value: summary.tournaments,
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      link: "/tournament",
    },
    {
      title: "Total Pertandingan",
      value: summary.matches,
      icon: <ListOrdered className="w-6 h-6 text-red-500" />,
      link: "/score-match",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Pengguna</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cardData.map((item, index) => (
          <Card key={index} className="hover:shadow-xl transition">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                {item.icon}
              </div>
              <p className="text-3xl font-bold">{item.value}</p>
              <Link to={item.link}>
                <Button variant="outline" className="w-full">
                  Lihat Detail
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Tournament */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">Turnamen Terbaru</h2>
            {latestTournament ? (
              <>
                <p className="text-xl font-bold">{latestTournament.name}</p>
                <p className="text-sm text-gray-600">
                  {latestTournament.start_date} - {latestTournament.end_date}
                </p>
                <p className="text-sm">{latestTournament.location}</p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada turnamen.</p>
            )}
          </CardContent>
        </Card>

        {/* Latest Match */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">Pertandingan Terbaru</h2>
            {latestMatch ? (
              <>
                <p className="font-bold">
                  {latestMatch.team1_id} vs {latestMatch.team2_id}
                </p>
                <p className="text-sm">
                  Skor: {latestMatch.team1_score} - {latestMatch.team2_score}
                </p>
                <p className="text-xs text-gray-500">{latestMatch.date}</p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada pertandingan.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
