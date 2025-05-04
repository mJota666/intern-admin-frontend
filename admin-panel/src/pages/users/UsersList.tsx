/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import client from "../../api/client";
import { css } from "@emotion/react";

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // hide scrollbar
  const hideScrollBar = css`
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  `;

  useEffect(() => {
    client
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load users")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[url('/dashboard-background.png')] bg-cover bg-center overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Glass panel */}
      <div
        className="
          absolute left-1/2 top-[5vh] bottom-[5vh]
          transform -translate-x-1/2
          w-[90%] max-w-4xl
          bg-white/20 backdrop-blur-lg
          rounded-2xl shadow-xl
          p-6 overflow-auto
        "
        css={hideScrollBar}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-white/30 rounded-lg hover:bg-white/40 transition"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>

          <h2 className="text-2xl font-semibold text-white font-playwrite">
            User Management
          </h2>

          <Link
            to="/users/new"
            className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl hover:bg-black/40 transition text-white"
          >
            <Plus size={18} className="text-white" />
            Create User
          </Link>
        </div>

        {/* States */}
        {loading ? (
          <div className="text-center text-white py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : (
          <table className="w-full table-auto border-collapse text-white">
            <thead>
              <tr className="border-b border-white/30">
                <th className="p-3 text-left"></th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {users.map((u, index) => (
                <tr key={u._id} className="hover:bg-white/10 transition">
                  <td className="p-3">{index}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">
                    <Link
                      to={`/users/${u._id}`}
                      className="text-blue-300 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
