import { Routes, Route } from "react-router-dom"
import { LoginPage, DashboardPage } from "@/pages"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}
