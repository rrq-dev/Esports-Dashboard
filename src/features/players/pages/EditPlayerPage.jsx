import { AppSidebar } from "@/components/common/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { fetchPlayerById, updatePlayer } from "@/api/player"
import { useState, useEffect } from "react"

const formSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter." }).max(50, { message: "Nama maksimal 50 karakter." }).optional().or(z.literal("")),
  ml_nickname: z.string().min(3, { message: "ML Nickname minimal 3 karakter." }).max(50, { message: "ML Nickname maksimal 50 karakter." }).optional().or(z.literal("")),
  ml_id: z.string().min(1, { message: "ML ID tidak boleh kosong." }).optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "pending"], { message: "Status tidak valid." }).optional(),
  avatar_url: z.string().url({ message: "URL Avatar tidak valid." }).optional().or(z.literal("")),
}).refine(data => data.name !== "" || data.ml_nickname !== "" || data.ml_id !== "" || data.status !== undefined || data.avatar_url !== "", {
  message: "Setidaknya satu field harus diisi untuk update.",
  path: ["name"], 
});

export function EditPlayerPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ml_nickname: "",
      ml_id: "",
      status: undefined,
      avatar_url: "",
    },
  });

  useEffect(() => {
    const getPlayerData = async () => {
      try {
        const playerData = await fetchPlayerById(id);
        form.reset({
          name: playerData.name,
          ml_nickname: playerData.ml_nickname,
          ml_id: playerData.ml_id,
          status: playerData.status,
          avatar_url: playerData.avatar_url,
        });
      } catch (err) {
        setError(err.message || "Gagal mengambil data pemain.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getPlayerData();
    } else {
      setError("Player ID tidak ditemukan.");
      setIsLoading(false);
    }
  }, [id, form]);

  const onSubmit = async (values) => {
    try {
      const updatePayload = {};
      if (values.name !== "") updatePayload.name = values.name;
      if (values.ml_nickname !== "") updatePayload.ml_nickname = values.ml_nickname;
      if (values.ml_id !== "") updatePayload.ml_id = values.ml_id;
      if (values.status !== undefined) updatePayload.status = values.status;
      if (values.avatar_url !== "") updatePayload.avatar_url = values.avatar_url;

      const response = await updatePlayer(id, updatePayload);
      toast.success(response.message || "Pemain berhasil diupdate!");
      setTimeout(() => {
        navigate("/dashboard/players");
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan saat mengupdate pemain.");
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
              <p className="mt-2 text-muted-foreground">Loading player data...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error && !isLoading) {
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
                    <Link to="/dashboard">
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard/players">
                      Players
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Player</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-bold mb-4">Edit Data Pemain</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ml_nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ML Nickname</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JD_Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ml_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ML ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., https://example.com/avatar.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>Update Pemain</Button>
            </form>
          </Form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 