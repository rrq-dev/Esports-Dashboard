import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { GalleryVerticalEnd, Mail, Eye, EyeOff, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ⬅️ updated

import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ⬅️ added

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Semua field harus diisi!",
        background: "#1e1b4b",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Registrasi sukses!",
        text: `Selamat datang, ${username}!`,
        background: "#1e1b4b",
        color: "#fff",
        confirmButtonColor: "#6366f1",
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        navigate("/"); // ⬅️ redirect ke halaman login setelah success
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <form onSubmit={handleRegister}>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Arena</span>
            </Link>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
              Create your account
            </h1>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/"
                className="underline underline-offset-4 text-blue-400 hover:text-blue-600"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {/* Username */}
            <div className="grid gap-1">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-500">
                  <User className="size-4" />
                </span>
                <Input
                  id="username"
                  placeholder="gamer_legend"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 border border-purple-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-500">
                  <Mail className="size-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border border-purple-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border border-purple-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 inset-y-0 flex items-center text-purple-500"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-md transition-all duration-300"
            >
              Register
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
