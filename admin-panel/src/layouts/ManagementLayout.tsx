import { ArrowLeft, LogOut, User } from "lucide-react";
import { ReactNode, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { css } from "@emotion/react";

export default function ManagementLayout({ title }: { title: String }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext)!;
  const hideScrollBarCss = css`
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  `;
  return (
    <div className="relative w-[100vw] h-[100vh] bg-[url('/dashboard-background.png')] bg-cover bg-center overflow-hidden">
      {/* Dark blur overlay */}
      <div className="w-full h-full absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Glassy Header */}
      <header className="absolute inset-x-0 top-0 flex justify-between items-center p-4 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-white/30 rounded-lg hover:bg-white/40 transition"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-semibold font-playwrite">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="p-2 bg-white/30 rounded-full hover:bg-white/40 transition"
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

      {/* Scrollable Content Panel */}
      <div
        className="absolute left-1/2 top-[10vh] bottom-[5vh] transform -translate-x-1/2 w-[90%] max-w-4xl  bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-6 overflow-auto"
        css={hideScrollBarCss}
      >
        <Outlet />
      </div>
    </div>
  );
}
