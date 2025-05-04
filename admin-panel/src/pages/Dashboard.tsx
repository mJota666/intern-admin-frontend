import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)!;
  console.log("User Information:");
  console.log(user);
  return (
    <div className="w-[100vw] h-[100vh] bg-[url('/dashboard-background.png')] bg-center bg-cover flex justify-center items-center">
      {/* Blur */}
      <div className="absolute w-full h-full bg-black/30 backdrop-blur-sm"></div>
      {/* Main */}
      <div className="relative w-1/3 h-1/3 flex flex-col gap-8 justify-center items-center rounded-3xl bg-white/20 backdrop-blur-xl">
        <h1 className="text-3xl mb-4 font-playwrite text-white">
          Welcome, {user!.name}
        </h1>
        <nav className="space-x-4 mb-6">
          {user!.role === "admin" && (
            <Link
              to="/users"
              className="text-white font-mono bg-black/30 p-4 rounded-xl backdrop-blur-xl shadow hover:bg-black/50 transition-all duration-300"
            >
              Users Management
            </Link>
          )}
          {(user!.role === "admin" || user!.role === "editor") && (
            <Link
              to="/contents"
              className="text-white font-mono bg-black/30 p-4 rounded-xl backdrop-blur-xl shadow hover:bg-black/50 transition-all duration-300"
            >
              Contents Management
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
