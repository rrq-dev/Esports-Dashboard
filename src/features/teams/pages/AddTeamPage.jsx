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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createTeam } from "@/api/team";
import { fetchAllPlayers } from "@/api/player";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/cn";

const formSchema = z.object({
  team_name: z.string().min(3, { message: "Nama tim minimal 3 karakter." }).max(50, { message: "Nama tim maksimal 50 karakter." }),
  captain_id: z.string({ required_error: "Kapten harus dipilih." }),
  members: z.array(z.string()).min(1, { message: "Setidaknya satu anggota harus dipilih." }),
  logo_url: z.string().url({ message: "URL Logo tidak valid." }).optional().or(z.literal("")),
}).refine(data => data.members.includes(data.captain_id), {
  message: "Kapten harus termasuk dalam daftar anggota.",
  path: ["captain_id"],
});

export function AddTeamPage() {
  const navigate = useNavigate();
  const [allPlayers, setAllPlayers] = useState([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);

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
    const getPlayers = async () => {
      try {
        const data = await fetchAllPlayers();
        setAllPlayers(data || []);
      } catch (err) {
        toast.error("Gagal memuat data pemain: " + err.message);
      } finally {
        setIsLoadingPlayers(false);
      }
    };
    getPlayers();
  }, []);

  const onSubmit = async (values) => {
    try {
      const response = await createTeam(values);
      toast.success(response.message || "Tim berhasil ditambahkan!");
      form.reset();
      setTimeout(() => {
        navigate("/dashboard/teams");
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan saat menambahkan tim.");
    }
  };
  
  const selectedMembers = form.watch("members");
  const unselectedPlayers = allPlayers.filter(player => !selectedMembers.includes(player._id));

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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard">
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard/teams">
                      Teams
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Team</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-bold mb-4">Tambah Data Tim Baru</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
              <FormField
                control={form.control}
                name="team_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Tim</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., EVOS Legends" {...field} />
                    </FormControl>
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
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? allPlayers.find(
                                  (player) => player._id === field.value
                                )?.ml_nickname
                              : "Pilih Kapten"}
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
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      player._id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anggota Tim</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                         <div className="flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {selectedMembers.map(id => {
                                const player = allPlayers.find(p => p._id === id);
                                return (
                                  <Badge key={id} variant="secondary">
                                    {player?.ml_nickname}
                                    <button
                                      type="button"
                                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                      onClick={() => {
                                        const newMembers = selectedMembers.filter(memberId => memberId !== id);
                                        form.setValue("members", newMembers, { shouldValidate: true });
                                      }}
                                    >
                                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                  </Badge>
                                );
                              })}
                               <span className="text-muted-foreground">{selectedMembers.length === 0 && "Pilih anggota tim"}</span>
                            </div>
                           <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                         </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Cari pemain untuk ditambahkan..." />
                          <CommandList>
                            <CommandEmpty>Semua pemain sudah dipilih.</CommandEmpty>
                            <CommandGroup>
                              {unselectedPlayers.map((player) => (
                                <CommandItem
                                  key={player._id}
                                  value={player._id}
                                  onSelect={() => {
                                    form.setValue("members", [...selectedMembers, player._id], { shouldValidate: true });
                                  }}
                                >
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
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting || isLoadingPlayers}>
                {isLoadingPlayers ? "Memuat pemain..." : "Tambah Tim"}
              </Button>
            </form>
          </Form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 