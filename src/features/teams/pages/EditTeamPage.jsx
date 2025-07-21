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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchTeamById, updateTeam } from "@/api/team";
import { fetchAllPlayers } from "@/api/player";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/cn";

const formSchema = z.object({
  team_name: z.string().min(3, "Nama tim minimal 3 karakter.").max(50, "Nama tim maksimal 50 karakter."),
  captain_id: z.string({ required_error: "Kapten harus dipilih." }),
  members: z.array(z.string()).min(1, "Setidaknya satu anggota harus dipilih."),
  logo_url: z.string().url("URL Logo tidak valid.").optional().or(z.literal("")),
}).refine(data => data.members.includes(data.captain_id), {
  message: "Kapten harus termasuk dalam daftar anggota.",
  path: ["captain_id"],
});

export function EditTeamPage() {
  const navigate = useNavigate();
  const { id: teamId } = useParams();
  
  const [allPlayers, setAllPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      team_name: "",
      captain_id: "",
      members: [],
      logo_url: "",
    },
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (!teamId) {
          throw new Error("Team ID tidak ditemukan.");
        }
        const [teamData, playersData] = await Promise.all([
          fetchTeamById(teamId),
          fetchAllPlayers(),
        ]);

        setAllPlayers(playersData || []);
        
        form.reset({
          team_name: teamData.team_name || "",
          captain_id: teamData.captain_id || "",
          members: teamData.members || [],
          logo_url: teamData.logo_url || "",
        });

      } catch (err) {
        setError(err.message || "Gagal memuat data awal.");
        toast.error(err.message || "Gagal memuat data awal.");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [teamId, form]);
  
  const onSubmit = async (values) => {
    try {
      const response = await updateTeam(teamId, values);
      toast.success(response.message || "Tim berhasil diupdate!");
      setTimeout(() => {
        navigate("/dashboard/teams");
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan saat mengupdate tim.");
    }
  };

  const selectedMembers = form.watch("members");
  const unselectedPlayers = allPlayers.filter(player => !selectedMembers.includes(player._id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2 text-muted-foreground">Memuat data tim...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block"><Link to="/dashboard">Dashboard</Link></BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem><Link to="/dashboard/teams">Teams</Link></BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem><BreadcrumbPage>Edit Team</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-bold mb-4">Edit Data Tim</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
               <FormField
                control={form.control}
                name="team_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Tim</FormLabel>
                    <FormControl><Input placeholder="e.g., EVOS Legends" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="captain_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kapten Tim</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                            {field.value ? allPlayers.find((p) => p._id === field.value)?.ml_nickname : "Pilih Kapten"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Cari pemain..." />
                          <CommandList>
                            <CommandEmpty>Pemain tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {allPlayers.map((player) => (
                                <CommandItem
                                  value={player._id}
                                  key={player._id}
                                  onSelect={() => {
                                    form.setValue("captain_id", player._id, { shouldValidate: true });
                                    const currentMembers = form.getValues("members");
                                    if (!currentMembers.includes(player._id)) {
                                      form.setValue("members", [...currentMembers, player._id], { shouldValidate: true });
                                    }
                                  }}>
                                  <Check className={cn("mr-2 h-4 w-4", player._id === field.value ? "opacity-100" : "opacity-0")} />
                                  {player.ml_nickname}
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

              <FormField
                control={form.control}
                name="members"
                render={() => (
                  <FormItem>
                    <FormLabel>Anggota Tim</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                         <div className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <div className="flex flex-wrap gap-1">
                              {selectedMembers.map(id => {
                                const player = allPlayers.find(p => p._id === id);
                                return (
                                  <Badge key={id} variant="secondary">
                                    {player?.ml_nickname}
                                    <button type="button" className="ml-1" onClick={() => {
                                      const newMembers = selectedMembers.filter(memberId => memberId !== id);
                                      form.setValue("members", newMembers, { shouldValidate: true });
                                    }}> <X className="h-3 w-3" /> </button>
                                  </Badge>
                                );
                              })}
                               <span className="text-muted-foreground">{selectedMembers.length === 0 && "Pilih anggota"}</span>
                            </div>
                           <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                         </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Cari pemain..." />
                          <CommandList>
                            <CommandEmpty>Semua pemain sudah dipilih.</CommandEmpty>
                            <CommandGroup>
                              {unselectedPlayers.map((player) => (
                                <CommandItem
                                  key={player._id}
                                  value={player._id}
                                  onSelect={() => form.setValue("members", [...selectedMembers, player._id], { shouldValidate: true })}>
                                  {player.ml_nickname}
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

              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Logo (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://example.com/logo.png" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>Update Tim</Button>
            </form>
          </Form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 