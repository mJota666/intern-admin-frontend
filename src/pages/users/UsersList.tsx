/** @jsxImportSource @emotion/react */
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import client from "../../api/client";
import { css } from "@emotion/react";
import { AuthContext } from "../../context/AuthContext";

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext)!;

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

  // Handle user deletion
  const handleDelete = (userId: string) => {
    if (userId != user!.sub) {
      if (window.confirm("Are you sure you want to delete this user?")) {
        client
          .delete(`/users/${userId}`)
          .then(() => {
            // Remove deleted user from the state to update the UI
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user._id !== userId)
            );
          })
          .catch((err) =>
            setError(err.response?.data?.message || "Failed to delete user")
          );
      }
    } else {
      alert("Cannot delete your account !");
    }
  };
  // navigate to edit
  const handleEdit = (userId: string) => {
    if (userId != user!.sub) {
      navigate(`/users/${userId}`);
    } else {
      alert("Cannot edit your account !");
    }
  };

  return (
    <div className="w-full h-full overflow-auto" css={hideScrollBar}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 flex gap-2">
                  <div
                    onClick={() => handleEdit(u._id)}
                    className="text-black/30 font-semibold hover:underline cursor-pointer"
                  >
                    Edit
                  </div>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-800 hover:text-red-900"
                    aria-label="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
