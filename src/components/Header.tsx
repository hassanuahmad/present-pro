import { useNavigate } from "react-router";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";

interface HeaderProps {
  theme?: string;
}

export function Header({ theme = "dark" }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1
          className={`text-3xl font-bold ${
            theme === "dark"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400"
              : "text-teal-700"
          } cursor-pointer`}
          onClick={() => navigate("/")}
        >
          PresentPro
        </h1>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate("/dashboard")}
                className={`${
                  theme === "dark"
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "bg-teal-600 hover:bg-teal-700"
                } text-white`}
              >
                Dashboard
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
