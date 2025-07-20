import { Routes, Route } from "react-router-dom"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage"
import { UsersPage } from "@/features/users/pages/UsersPage"
import { PlayersPage } from "@/features/players/pages/PlayersPage"
import { TeamsPage } from "@/features/teams/pages/TeamsPage"
import { TournamentsPage } from "@/features/tournaments/pages/TournamentsPage"
import { MatchesPage } from "@/features/matches/pages/MatchesPage"
import { TicketsPage } from "@/features/tickets/pages/TicketsPage"
import { AddUserPage } from "@/features/users/pages/AddUserPage"
import { EditUserPage } from "@/features/users/pages/EditUserPage"
import { AddPlayerPage } from "@/features/players/pages/AddPlayerPage"
import { EditPlayerPage } from "@/features/players/pages/EditPlayerPage"
import { ProtectedRoute } from "@/components/common/ProtectedRoute"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/users" element={
        <ProtectedRoute>
          <UsersPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/users/add" element={
        <ProtectedRoute>
          <AddUserPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/users/edit/:id" element={
        <ProtectedRoute>
          <EditUserPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/players" element={
        <ProtectedRoute>
          <PlayersPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/players/add" element={
        <ProtectedRoute>
          <AddPlayerPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/players/edit/:id" element={
        <ProtectedRoute>
          <EditPlayerPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/teams" element={
        <ProtectedRoute>
          <TeamsPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/tournaments" element={
        <ProtectedRoute>
          <TournamentsPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/matches" element={
        <ProtectedRoute>
          <MatchesPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/tickets" element={
        <ProtectedRoute>
          <TicketsPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
