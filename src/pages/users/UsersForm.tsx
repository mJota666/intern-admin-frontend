/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import client from "../../api/client";
import { css } from "@emotion/react";

interface UserFormData {
  email: string;
  name: string;
  password?: string;
  role: "admin" | "editor" | "client";
}

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id) && id !== "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<UserFormData>({
    email: "",
    name: "",
    role: "client",
  });
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // hide scrollbar on the panel
  const hideScrollCss = css`
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  `;

  // load existing user
  useEffect(() => {
    if (!isEdit) return;
    setLoadingData(true);
    client
      .get(`/users/${id}`)
      .then((res) => {
        setForm({
          email: res.data.email,
          name: res.data.name,
          role: res.data.role,
        });
      })
      .catch(() => setError("Failed to load user"))
      .finally(() => setLoadingData(false));
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        email: form.email,
        name: form.name,
        role: form.role,
        // only send passwordHash if user typed one
        ...(form.password ? { passwordHash: form.password } : {}),
      };
      if (isEdit) {
        await client.put(`/users/${id}`, payload);
      } else {
        await client.post("/users", payload);
      }
      navigate("/users");
    } catch (err: any) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-full overflow-auto" css={hideScrollCss}>
      <div className="relative max-w-md mx-auto my-8 p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl">
        {/* Back + Logout */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/30 rounded-lg hover:bg-white/40 transition"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-white text-center mb-6 font-playwrite">
          {isEdit ? "Edit User" : "Create User"}
        </h1>

        {loadingData ? (
          <div className="text-center text-white py-6">Loading…</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-400 text-center">{error}</div>}

            <div>
              <label className="block text-white mb-1 font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="
                  w-full px-4 py-2
                  bg-black/30 text-white
                  placeholder-white/70
                  border border-white/50
                  rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-white/80
                  transition
                "
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-white mb-1 font-medium">Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="
                  w-full px-4 py-2
                  bg-black/30 text-white
                  placeholder-white/70
                  border border-white/50
                  rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-white/80
                  transition
                "
                placeholder="Full Name"
              />
            </div>

            <div>
              <label className="block text-white mb-1 font-medium">
                Password{" "}
                {isEdit && (
                  <small className="text-sm text-white/70">
                    (leave blank to keep)
                  </small>
                )}
              </label>
              <input
                name="password"
                type="password"
                value={form.password || ""}
                onChange={handleChange}
                className="
                  w-full px-4 py-2
                  bg-black/30 text-white
                  placeholder-white/70
                  border border-white/50
                  rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-white/80
                  transition
                "
                placeholder={isEdit ? "••••••••" : "Set a password"}
              />
            </div>

            <div>
              <label className="block text-white mb-1 font-medium">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="
                  w-full px-4 py-2
                  bg-black/30 text-white
                  border border-white/50
                  rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-white/80
                  transition
                "
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="client">Client</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="
                w-full py-2 mt-4
                bg-green-500 hover:bg-green-600
                text-white font-semibold
                rounded-lg
                transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {saving
                ? isEdit
                  ? "Updating…"
                  : "Creating…"
                : isEdit
                ? "Update User"
                : "Create User"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
