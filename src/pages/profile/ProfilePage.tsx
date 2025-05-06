/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import client from "../../api/client";
import { ArrowLeft } from "lucide-react";
import { UserProfile } from "../../interfaces/UserProfile";

const glassCard = css`
  position: relative;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export default function ProfilePage() {
  const { user } = useContext(AuthContext)!;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    client
      .get<UserProfile>(`/users/${user.sub}`)
      .then((res) => setProfile(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load profile")
      );
  }, [user]);

  if (!user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Please log in
        </button>
      </div>
    );
  }

  return (
    <div
      className="
        w-[100vw] h-[100vh] overflow-hidden
        bg-[url('/dashboard-background.png')] bg-cover bg-center
        relative
      "
    >
      {/* Dark overlay + blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div
        css={glassCard}
        className="
          relative z-10
          max-w-md w-full
          mx-auto mt-20
          p-8
          flex flex-col items-center
          space-y-6
        "
      >
        <div className="flex flex-row gap-4 absolute top-4 left-4">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="
            p-3 backdrop-blur-xl bg-white/30 rounded-full
            hover:bg-white/50 transition-all duration-200 cursor-pointer
          "
            aria-label="Logout"
          >
            <ArrowLeft size={10} />
          </button>
        </div>

        {/* Avatar */}
        <img
          src="/profile.png"
          alt="User Avatar"
          className="
            w-32 h-32
            rounded-full
            object-cover
            border-4 border-white/50
          "
        />

        {/* Error */}
        {error && (
          <div className="w-full text-center text-red-700 bg-red-100 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Profile Details */}
        {!profile ? (
          <div className="text-gray-100">Loading…</div>
        ) : (
          <div className="w-full space-y-4 text-gray-50 flex flex-col justify-center ">
            <div className="backdrop-blur-xl bg-black/60 text-sm  transition-all duration-200 w-fit px-4 py-2 rounded-3xl text-white self-center">
              <span className="font-semibold">Joined:</span>{" "}
              {new Date(profile.createdAt).toLocaleString()}
            </div>
            <div className="grid grid-cols-[100px_1fr] grid-rows-4 gap-row-2 gap-y-4">
              <span className="font-semibold">ID:</span>{" "}
              <span className="text-xl">{profile._id}</span>
              <span className="font-semibold">Email:</span>{" "}
              <span className="text-xl">{profile.email}</span>
              <span className="font-semibold">Name:</span>{" "}
              <span className="text-xl">{profile.name}</span>
              <span className="font-semibold">Role:</span>{" "}
              <span className="text-xl">{profile.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
