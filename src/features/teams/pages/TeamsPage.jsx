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
import { useState, useEffect } from "react";
import { fetchAllTeams, deleteTeam } from "@/api/team";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const data = await fetchAllTeams();
        setTeams(data || []); // Pastikan data adalah array, atau array kosong jika null
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getTeams();
  }, []);

  const handleDeleteClick = (team) => {
    setTeamToDelete(team);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!teamToDelete) return;

    try {
      const response = await deleteTeam(teamToDelete._id);
      toast.success(response.message || 'Team has been deleted.');
      setTeams(teams.filter(team => team._id !== teamToDelete._id));
      setTeamToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete team.');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading teams...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
                    <Link to="/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Teams</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Team Management</h1>
            <Button className="flex items-center gap-2" asChild>
              <Link to="/dashboard/teams/add">
                <PlusCircle className="h-4 w-4" />
                Tambah Data Team
              </Link>
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableCaption>A list of registered teams.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead className="w-[150px]">Team Name</TableHead>
                  <TableHead>Captain</TableHead>
                  <TableHead>Members Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team._id}>
                    <TableCell>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={team.logo_url || "https://github.com/shadcn.png"}
                          alt={team.team_name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {team.team_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {team.team_name}
                    </TableCell>
                    <TableCell>{team.captain_details?.ml_nickname ?? '(Kapten tidak ditemukan)'}</TableCell>
                    <TableCell>
                      {team.members ? team.members.length : 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/dashboard/teams/edit/${team._id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(team)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this team.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
