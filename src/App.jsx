import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Layout
import MainLayout from "../components/layout/MainLayout";

// Pages
import UserDashboard from "../pages/DashboardUser";

// Team Pages
import TeamList from "../pages/Teams/TeamList";
import TeamDetail from "../pages/Teams/TeamDetails";
import TeamForm from "../pages/Teams/TeamForms";

// Player Pages
import PlayerList from "../pages/Players/PlayerList";
import PlayerDetail from "../pages/Players/PlayerDetails";
import PlayerForm from "../pages/Players/PlayerForms";

// Tournament Pages
import TournamentList from "../pages/Tournaments/TournamentList";
import TournamentDetail from "../pages/Tournaments/TournamentDetails";
import TournamentForm from "../pages/Tournaments/TournamentForms";

// ScoreMatch Pages
import ScoreList from "../pages/ScoreMatch/ScoreList";
import ScoreDetail from "../pages/ScoreMatch/ScoreDetails";
import ScoreForm from "../pages/ScoreMatch/ScoreForms";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<UserDashboard />} />

          {/* Team Routes */}
          <Route path="/team" element={<TeamList />} />
          <Route path="/team/new" element={<TeamForm />} />
          <Route path="/team/edit/:id" element={<TeamForm />} />
          <Route path="/team/:id" element={<TeamDetail />} />

          {/* Player Routes */}
          <Route path="/player" element={<PlayerList />} />
          <Route path="/player/new" element={<PlayerForm />} />
          <Route path="/player/edit/:id" element={<PlayerForm />} />
          <Route path="/player/:id" element={<PlayerDetail />} />

          {/* Tournament Routes */}
          <Route path="/tournament" element={<TournamentList />} />
          <Route path="/tournament/new" element={<TournamentForm />} />
          <Route path="/tournament/edit/:id" element={<TournamentForm />} />
          <Route path="/tournament/:id" element={<TournamentDetail />} />

          {/* Score Match Routes */}
          <Route path="/score-match" element={<ScoreList />} />
          <Route path="/score-match/new" element={<ScoreForm />} />
          <Route path="/score-match/edit/:id" element={<ScoreForm />} />
          <Route path="/score-match/:id" element={<ScoreDetail />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
