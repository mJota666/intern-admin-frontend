import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)!;
  console.log("User Information:", user);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-12 p-8 rounded-3xl bg-white/20 backdrop-blur-xl shadow-xl text-center">
      <h1 className="text-4xl font-bold font-playwrite text-white drop-shadow">
        Welcome, {user?.name}
      </h1>

      <div className=" gap-6 flex justify-center items-center">
        {user?.role === "admin" && (
          <Link
            to="/users"
            className="px-6 py-4 rounded-xl bg-black/40 hover:bg-black/60 text-white font-mono shadow-lg transition-all duration-300"
          >
            👥 Users Management
          </Link>
        )}
        {(user?.role === "admin" || user?.role === "editor") && (
          <Link
            to="/contents"
            className="px-6 py-4 rounded-xl bg-black/40 hover:bg-black/60 text-white font-mono shadow-lg transition-all duration-300"
          >
            📝 Contents Management
          </Link>
        )}
      </div>
    </div>
  );
}
