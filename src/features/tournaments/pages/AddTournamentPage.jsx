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
import { Link, useNavigate } from "react-router-dom";
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
import { createTournament } from "@/api/tournament";
import { fetchAllTeams } from "@/api/team";
import { CalendarIcon, ChevronsUpDown, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/cn";


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


export function AddTournamentPage() {
  const navigate = useNavigate();
  const [allTeams, setAllTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      prize_pool: "",
      rules_document_url: "",
      teams_participating: [],
    },
  });

  useEffect(() => {
    const getTeams = async () => {
      try {
        const data = await fetchAllTeams();
        setAllTeams(data || []);
      } catch (err) {
        toast.error("Gagal memuat data tim: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getTeams();
  }, []);

  const onSubmit = async (values) => {
    try {
      const response = await createTournament(values);
      toast.success(response.message || "Turnamen berhasil dibuat!");
      navigate("/dashboard/tournaments");
    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan saat membuat turnamen.");
    }
  };

  const selectedTeams = form.watch("teams_participating") || [];
  const unselectedTeams = allTeams.filter(team => !selectedTeams.includes(team._id));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          {/* Breadcrumb Header */}
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block"><Link to="/dashboard">Dashboard</Link></BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem><Link to="/dashboard/tournaments">Tournaments</Link></BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem><BreadcrumbPage>Create Tournament</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-bold mb-4">Buat Turnamen Baru</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
              {/* Form Fields */}
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
                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih status turnamen" /></SelectTrigger></FormControl><SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="ongoing">Ongoing</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )}/>
              <FormField name="teams_participating" control={form.control} render={() => (
                  <FormItem><FormLabel>Tim Partisipan (Opsional)</FormLabel>
                   <Popover>
                      <PopoverTrigger asChild>
                         <div className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <div className="flex flex-wrap gap-1">
                              {selectedTeams.map(id => {
                                const team = allTeams.find(t => t._id === id);
                                return <Badge key={id} variant="secondary">{team?.team_name}<button type="button" className="ml-1" onClick={() => form.setValue("teams_participating", selectedTeams.filter(teamId => teamId !== id))}><X className="h-3 w-3" /></button></Badge>;
                              })}
                              {selectedTeams.length === 0 && <span className="text-muted-foreground">Pilih tim</span>}
                            </div>
                           <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                         </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Cari tim..." />
                          <CommandList>
                            <CommandEmpty>Tim tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {unselectedTeams.map((team) => (
                                <CommandItem key={team._id} value={team._id} onSelect={() => form.setValue("teams_participating", [...selectedTeams, team._id])}>
                                  {team.team_name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  <FormMessage /></FormItem>
              )}/>
               <FormField name="rules_document_url" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>URL Dokumen Peraturan (Opsional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>{isLoading ? "Memuat..." : "Buat Turnamen"}</Button>
            </form>
          </Form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 