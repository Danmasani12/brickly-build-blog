import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Admin from "./Admin";
import ModeratorDashboard from "./ModeratorDashboard";
import { Loader2 } from "lucide-react";

const ProtectedAdmin = () => {
  const { user, isAdmin, isModerator, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        navigate("/admin-login");
      } else if (!isAdmin && !isModerator) {
        // Logged in but not admin or moderator, redirect to home
        navigate("/");
      }
    }
  }, [user, isAdmin, isModerator, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (!isAdmin && !isModerator)) {
    return null;
  }

  // Show admin dashboard for admins, moderator dashboard for moderators
  return isAdmin ? <Admin /> : <ModeratorDashboard />;
};

export default ProtectedAdmin;
