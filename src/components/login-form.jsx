import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { GalleryVerticalEnd, Mail, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "../service/auth/auth";

export function LoginForm({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email dan password tidak boleh kosong!",
        background: "#1e1b4b",
        color: "#fff",
        confirmButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-xl shadow-lg border border-red-400",
        },
      });
      return;
    }

    try {
      await loginUser(email, password);
      Swal.fire({
        icon: "success",
        title: "Login sukses!",
        text: `Selamat datang kembali, ${email.split("@")[0].toUpperCase()}!`,
        background: "#1e1b4b",
        color: "#fff",
        confirmButtonColor: "#6366f1",
        timer: 1800,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-xl shadow-lg border border-purple-500",
        },
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: error.message,
        background: "#1e1b4b",
        color: "#fff",
        confirmButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-xl shadow-lg border border-red-400",
        },
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
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Esports App</span>
            </a>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
              Welcome to Esports App
            </h1>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="underline underline-offset-4 text-blue-400 hover:text-blue-600"
              >
                Sign up
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
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
                  required
                  className="pl-10 border border-purple-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-500 opacity-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M0 0h24v24H0z"
                    />
                  </svg>
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              Login
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
