import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Admin from "./Admin";
import ModeratorDashboard from "./ModeratorDashboard";
import { Loader2 } from "lucide-react";

interface User {
  id: number;
  role: "admin" | "moderator" | "user";
  email: string;
}

const ProtectedAdmin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin-login", { replace: true });
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        console.log("Fetched admin:", data);

        setUser(data);
      } catch (error) {
        console.error("Error verifying admin:", error);
        localStorage.removeItem("adminToken");
        navigate("/admin-login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Unauthorized access. Redirecting...
      </div>
    );
  }

  if (user.role === "admin") return <Admin />;
  if (user.role === "moderator") return <ModeratorDashboard />;

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Access Denied.
    </div>
  );
};

export default ProtectedAdmin;
