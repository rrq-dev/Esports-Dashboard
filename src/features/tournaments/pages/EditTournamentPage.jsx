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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchTournamentById, updateTournament, deleteTournament } from "@/api/tournament";
import { fetchAllTeams } from "@/api/team";
  import { CalendarIcon, ChevronsUpDown, X, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/cn";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const formSchema = z.object({
  name: z.string().min(5, "Nama turnamen minimal 5 karakter."),
  description: z.string().min(10, "Deskripsi minimal 10 karakter."),
  start_date: z.date({ required_error: "Tanggal mulai harus diisi." }),
  end_date: z.date({ required_error: "Tanggal selesai harus diisi." }),
  prize_pool: z.string().min(1, "Total hadiah harus diisi."),
  rules_document_url: z.string().url("URL tidak valid.").optional().or(z.literal("")),
  status: z.string({ required_error: "Status harus dipilih." }),
  teams_participating: z.array(z.string()).optional(),
}).refine(data => data.end_date > data.start_date, {
  message: "Tanggal selesai harus setelah tanggal mulai.",
  path: ["end_date"],
});

export function EditTournamentPage() {
  const navigate = useNavigate();
  const { id: tournamentId } = useParams();
  const [allTeams, setAllTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teams_participating: [],
    },
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (!tournamentId) throw new Error("ID Turnamen tidak ditemukan.");
        
        const [tournamentData, teamsData] = await Promise.all([
          fetchTournamentById(tournamentId),
          fetchAllTeams(),
        ]);

        setAllTeams(teamsData || []);
        
        form.reset({
          ...tournamentData,
          start_date: new Date(tournamentData.start_date),
          end_date: new Date(tournamentData.end_date),
          teams_participating: tournamentData.teams_participating?.map(team => team._id) || [],
        });

      } catch (err) {
        setError(err.message);
        toast.error("Gagal memuat data: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [tournamentId, form]);

  const selectedTeamIds = form.watch("teams_participating") || [];
  const unselectedTeams = allTeams.filter(team => !selectedTeamIds.includes(team._id));

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
      };
      const response = await updateTournament(tournamentId, payload);
      toast.success(response.message || "Turnamen berhasil diupdate!");
      navigate("/dashboard/tournaments");
    } catch (err) {
      toast.error(err.message || "Gagal mengupdate turnamen.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteTournament(tournamentId);
      toast.success(response.message || "Turnamen berhasil dihapus!");
      navigate("/dashboard/tournaments");
    } catch (err) {
      toast.error(err.message || "Gagal menghapus turnamen.");
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-6 max-w-2xl">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-1/4" />
    </div>
  );

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
              <BreadcrumbItem><Link to="/dashboard/tournaments">Tournaments</Link></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Edit Tournament</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-bold mb-4">Detail & Edit Turnamen</h1>
          
          {isLoading ? renderSkeleton() : error ? (
            <div className="text-red-500 text-center py-10">{error}</div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                {/* Form Fields Identical to AddTournamentPage */}
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Nama Turnamen</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField name="description" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <div className="flex gap-4">
                  <FormField name="start_date" control={form.control} render={({ field }) => (
                    <FormItem className="flex flex-col flex-1"><FormLabel>Tanggal Mulai</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )}/>
                  <FormField name="end_date" control={form.control} render={({ field }) => (
                    <FormItem className="flex flex-col flex-1"><FormLabel>Tanggal Selesai</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < form.getValues("start_date")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )}/>
                </div>
                <FormField name="prize_pool" control={form.control} render={({ field }) => (
                   <FormItem><FormLabel>Total Hadiah</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField name="status" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="ongoing">Ongoing</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
                <FormField
                  name="teams_participating"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tim Partisipan</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between h-auto min-h-10"
                          >
                            <div className="flex flex-wrap gap-1">
                              {selectedTeamIds.length > 0 ? (
                                selectedTeamIds.map(id => {
                                  const team = allTeams.find(t => t._id === id);
                                  return (
                                    <Badge
                                      key={id}
                                      variant="secondary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange(selectedTeamIds.filter(teamId => teamId !== id));
                                      }}
                                    >
                                      {team?.team_name || "..."}
                                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                                    </Badge>
                                  );
                                })
                              ) : (
                                <span className="text-muted-foreground">Pilih tim...</span>
                              )}
                            </div>
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Cari tim..." />
                            <CommandList>
                              <CommandEmpty>Tim tidak ditemukan.</CommandEmpty>
                              <CommandGroup>
                                {unselectedTeams.map(team => (
                                  <CommandItem
                                    key={team._id}
                                    value={team.team_name}
                                    onSelect={() => {
                                      field.onChange([...selectedTeamIds, team._id]);
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", selectedTeamIds.includes(team._id) ? "opacity-100" : "opacity-0")} />
                                    {team.team_name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField name="rules_document_url" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>URL Dokumen Peraturan (Opsional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <div className="flex gap-2">
                  <Button type="submit" disabled={form.formState.isSubmitting}>Update Turnamen</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive">Hapus Turnamen</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan. Ini akan menghapus turnamen secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </form>
            </Form>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 