/** @jsxImportSource @emotion/react */
import { ArrowLeft, LogOut, User } from "lucide-react";
import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { css } from "@emotion/react";

export default function ManagementLayout({ title }: { title: string }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext)!;

  const hideScrollBarCss = css`
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  `;

  return (
    <div className="relative w-full h-screen bg-[url('/dashboard-background.png')] bg-cover bg-center overflow-hidden">
      {/* Dark blur overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-5 z-10">
        <div className="flex items-center gap-4">
          {title !== "Home Page" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
          )}
          <h1 className="text-white text-2xl font-semibold font-playwrite">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            aria-label="Profile"
          >
            <User size={20} className="text-white" />
          </Link>
          <button
            onClick={logout}
            className="p-2 bg-red-500/80 rounded-full hover:bg-red-600/90 transition"
            aria-label="Logout"
          >
            <LogOut size={18} className="text-white" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="absolute left-1/2 top-[10vh] bottom-[5vh] transform -translate-x-1/2 w-[90%] max-w-5xl bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-6 overflow-auto"
        css={hideScrollBarCss}
      >
        <Outlet />
      </main>
    </div>
  );
}
