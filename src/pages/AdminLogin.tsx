import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, Mail, X } from "lucide-react";
import adminBg from "@/assets/admin-building-bg.jpg";



const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem("adminToken");
    if (token) navigate("/admin");
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Authentication Failed",
          description: data?.detail || data?.message || "Invalid credentials.",
          variant: "destructive",
        });
      } else {
        // ✅ Save session info
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminRefresh", data.refresh);

        toast({
          title: "Welcome Back!",
          description: "Redirecting to admin panel...",
        });

        setTimeout(() => navigate("/admin"), 1200);
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to reach the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${adminBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 z-20 text-white hover:text-white hover:bg-white/20"
        aria-label="Close"
      >
        <X size={24} />
      </Button>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Access
            </h1>
            <p className="text-muted-foreground font-medium">
              Authorized personnel only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In as Admin"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
