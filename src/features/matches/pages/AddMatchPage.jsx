import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/cn";

// Shadcn UI Components
import { AppSidebar } from "@/components/common/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

// API Functions
import { fetchAllTournamentsPublic, fetchTournamentById } from "@/api/tournament";
import { createMatch } from "@/api/match";

const formSchema = z.object({
  tournament_id: z.string({ required_error: "Turnamen harus dipilih." }),
  team_a_id: z.string({ required_error: "Tim A harus dipilih." }),
  team_b_id: z.string({ required_error: "Tim B harus dipilih." }),
  match_date: z.date({ required_error: "Tanggal pertandingan harus diisi." }),
  match_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid (HH:MM)."),
  round: z.string().min(1, "Ronde harus diisi."),
  status: z.string({ required_error: "Status harus dipilih." }),
  location: z.string().optional(),
}).refine(data => data.team_a_id !== data.team_b_id, {
  message: "Tim A dan Tim B tidak boleh sama.",
  path: ["team_b_id"],
});

export function AddMatchPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [participatingTeams, setParticipatingTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({ resolver: zodResolver(formSchema) });
  const selectedTournamentId = form.watch("tournament_id");

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

  useEffect(() => {
    const loadParticipatingTeams = async () => {
      if (!selectedTournamentId) {
        setParticipatingTeams([]);
        return;
      }
      try {
        const tournamentDetails = await fetchTournamentById(selectedTournamentId);
        setParticipatingTeams(tournamentDetails.teams_participating || []);
      } catch (err) {
        toast.error("Gagal memuat tim untuk turnamen ini.");
        setParticipatingTeams([]);
      }
    };
    loadParticipatingTeams();
  }, [selectedTournamentId]);
  
  const onSubmit = async (values) => {
    try {
      await createMatch(values);
      toast.success("Pertandingan berhasil dibuat!");
      navigate("/dashboard/matches");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><Link to="/dashboard">Dashboard</Link></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><Link to="/dashboard/matches">Matches</Link></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Add Match</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-bold mb-4">Buat Pertandingan Baru</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
              <FormField name="tournament_id" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Turnamen</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih turnamen" /></SelectTrigger></FormControl>
                    <SelectContent>{tournaments.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              
              <div className="flex gap-4">
                <FormField name="team_a_id" control={form.control} render={({ field }) => (
                   <FormItem className="flex-1">
                     <FormLabel>Tim A</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedTournamentId || participatingTeams.length === 0}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Pilih Tim A" /></SelectTrigger></FormControl>
                       <SelectContent>{participatingTeams.map(t => <SelectItem key={t._id} value={t._id}>{t.team_name}</SelectItem>)}</SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                )}/>
                 <FormField name="team_b_id" control={form.control} render={({ field }) => (
                   <FormItem className="flex-1">
                     <FormLabel>Tim B</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedTournamentId || participatingTeams.length === 0}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Pilih Tim B" /></SelectTrigger></FormControl>
                       <SelectContent>{participatingTeams.map(t => <SelectItem key={t._id} value={t._id}>{t.team_name}</SelectItem>)}</SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                )}/>
              </div>

              <div className="flex gap-4">
                <FormField name="match_date" control={form.control} render={({ field }) => (
                  <FormItem className="flex flex-col flex-1"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )}/>
                <FormField name="match_time" control={form.control} render={({ field }) => (
                  <FormItem className="flex-1"><FormLabel>Waktu</FormLabel><FormControl><Input placeholder="HH:MM" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>

              <FormField name="round" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Ronde</FormLabel><FormControl><Input placeholder="e.g., Regular Season - Week 1" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>

              <FormField name="status" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="ongoing">Ongoing</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )}/>

              <Button type="submit" disabled={isLoading || form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Menyimpan..." : "Buat Pertandingan"}
              </Button>
            </form>
          </Form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 