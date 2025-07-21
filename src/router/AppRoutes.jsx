import { Routes, Route } from "react-router-dom";
import { LoginPage, RegisterPage } from "@/features/auth/pages";
import { DashboardPage, HomePage } from "@/features/dashboard/pages";
import { UsersPage, AddUserPage, EditUserPage } from "@/features/users/pages";
import { PlayersPage, AddPlayerPage, EditPlayerPage } from "@/features/players/pages";
import { TeamsPage, AddTeamPage, EditTeamPage } from "@/features/teams/pages";
import { TournamentsPage, AddTournamentPage, EditTournamentPage, PublicTournamentDetailPage } from "@/features/tournaments/pages";
import { MatchesPage, AddMatchPage, EditMatchPage } from "@/features/matches/pages";
import { MyTicketsPage } from "@/features/tickets/pages";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* User-facing Routes */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/tournaments/:id" element={<ProtectedRoute><PublicTournamentDetailPage /></ProtectedRoute>} />
      <Route path="/my-tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />

      {/* Admin Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute requiredRole="admin"><DashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/users" element={<ProtectedRoute requiredRole="admin"><UsersPage /></ProtectedRoute>} />
      <Route path="/dashboard/users/add" element={<ProtectedRoute requiredRole="admin"><AddUserPage /></ProtectedRoute>} />
      <Route path="/dashboard/users/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditUserPage /></ProtectedRoute>} />
      <Route path="/dashboard/players" element={<ProtectedRoute requiredRole="admin"><PlayersPage /></ProtectedRoute>} />
      <Route path="/dashboard/players/add" element={<ProtectedRoute requiredRole="admin"><AddPlayerPage /></ProtectedRoute>} />
      <Route path="/dashboard/players/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditPlayerPage /></ProtectedRoute>} />
      <Route path="/dashboard/teams" element={<ProtectedRoute requiredRole="admin"><TeamsPage /></ProtectedRoute>} />
      <Route path="/dashboard/teams/add" element={<ProtectedRoute requiredRole="admin"><AddTeamPage /></ProtectedRoute>} />
      <Route path="/dashboard/teams/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditTeamPage /></ProtectedRoute>} />
      <Route path="/dashboard/tournaments" element={<ProtectedRoute requiredRole="admin"><TournamentsPage /></ProtectedRoute>} />
      <Route path="/dashboard/tournaments/add" element={<ProtectedRoute requiredRole="admin"><AddTournamentPage /></ProtectedRoute>} />
      <Route path="/dashboard/tournaments/:id" element={<ProtectedRoute requiredRole="admin"><EditTournamentPage /></ProtectedRoute>} />
      <Route path="/dashboard/matches" element={<ProtectedRoute requiredRole="admin"><MatchesPage /></ProtectedRoute>} />
      <Route path="/dashboard/matches/add" element={<ProtectedRoute requiredRole="admin"><AddMatchPage /></ProtectedRoute>} />
      <Route path="/dashboard/matches/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditMatchPage /></ProtectedRoute>} />
    </Routes>
  );
}
