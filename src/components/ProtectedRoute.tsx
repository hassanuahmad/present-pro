import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    navigate("/");  
    return null;
  }

  return <>{children}</>;
};
