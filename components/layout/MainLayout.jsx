import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Teams", path: "/team" },
    { name: "Players", path: "/player" },
    { name: "Tournaments", path: "/tournament" },
    { name: "Scores", path: "/score-match" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Esports App</h1>
        <nav className="space-x-2">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={
                  location.pathname === link.path ? "secondary" : "ghost"
                }
              >
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-3 text-sm">
        &copy; {new Date().getFullYear()} Esports App | All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
