import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon } from "lucide-react";

// API Functions
import { fetchMatchById, updateMatch, deleteMatch } from "@/api/match";

const formSchema = z.object({
  match_date: z.date({ required_error: "Tanggal harus diisi." }),
  match_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu salah (HH:MM)."),
  round: z.string().min(1, "Ronde harus diisi."),
  status: z.string({ required_error: "Status harus dipilih." }),
  location: z.string().optional(),
  result_team_a_score: z.coerce.number().min(0).optional(),
  result_team_b_score: z.coerce.number().min(0).optional(),
  winner_team_id: z.string().optional(),
});

export function EditMatchPage() {
  const navigate = useNavigate();
  const { id: matchId } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const loadMatchData = async () => {
      try {
        const data = await fetchMatchById(matchId);
        setMatchData(data);
        form.reset({
          ...data,
          match_date: new Date(data.match_date),
          result_team_a_score: data.result_team_a_score ?? 0,
          result_team_b_score: data.result_team_b_score ?? 0,
        });
      } catch (err) {
        toast.error("Gagal memuat data pertandingan.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMatchData();
  }, [matchId, form]);

  const onSubmit = async (values) => {
    try {
      await updateMatch(matchId, values);
      toast.success("Pertandingan berhasil diupdate!");
      navigate("/dashboard/matches");
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  const handleDelete = async () => {
     try {
      await deleteMatch(matchId);
      toast.success("Pertandingan berhasil dihapus!");
      navigate("/dashboard/matches");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading) return <div>Loading...</div>; // Replace with a proper skeleton loader if desired

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
              <BreadcrumbItem><BreadcrumbPage>Edit Match</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
           <div className="flex justify-between items-center">
             <h1 className="text-2xl font-bold">Edit Pertandingan</h1>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Hapus Pertandingan</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
           </div>
          <div className="text-lg font-semibold">{matchData?.team_a?.team_name} vs {matchData?.team_b?.team_name}</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
              {/* Form fields */}
              <div className="flex gap-4">
                 <FormField name="result_team_a_score" control={form.control} render={({ field }) => (
                  <FormItem className="flex-1"><FormLabel>Skor Tim A</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField name="result_team_b_score" control={form.control} render={({ field }) => (
                  <FormItem className="flex-1"><FormLabel>Skor Tim B</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <FormField name="winner_team_id" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Pemenang</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Pilih Pemenang (jika selesai)" /></SelectTrigger></FormControl>
                  <SelectContent><SelectItem value={matchData?.team_a_id}>
                      {matchData?.team_a?.team_name}
                    </SelectItem><SelectItem value={matchData?.team_b_id}>
                      {matchData?.team_b?.team_name}
                    </SelectItem></SelectContent>
                </Select><FormMessage /></FormItem>
              )}/>
              <div className="flex gap-4">
                 <FormField name="match_date" control={form.control} render={({ field }) => (
                  <FormItem className="flex flex-col flex-1"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )}/>
                <FormField name="match_time" control={form.control} render={({ field }) => (
                  <FormItem className="flex-1"><FormLabel>Waktu</FormLabel><FormControl><Input placeholder="HH:MM" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <FormField name="round" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Ronde</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField name="status" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="ongoing">Ongoing</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )}/>
              <Button type="submit" disabled={form.formState.isSubmitting}>Update Pertandingan</Button>
            </form>
          </Form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 