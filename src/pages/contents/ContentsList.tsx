/** @jsxImportSource @emotion/react */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import client from "../../api/client";
import { Article } from "../../interfaces/Article";
import { css } from "@emotion/react";

export default function ContentsList() {
  const [contents, setContents] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // hide scrollbar
  const hideScrollBarCss = css`
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  `;

  useEffect(() => {
    client
      .get<Article[]>("/contents")
      .then((res) => setContents(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col text-white"
      css={hideScrollBarCss}
    >
      {/* Top controls */}
      <div className="flex justify-between items-center p-4">
        {/* Create New Content */}
        <Link
          to="/contents/new"
          className="
            flex items-center gap-2
            p-2
            bg-black/30 text-white
            rounded-lg
            hover:bg-black/40
            transition
          "
        >
          <Plus size={18} /> New Content
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="text-center text-white py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : contents.length === 0 ? (
          <div className="text-center text-gray-200 py-10">
            No contents available.
          </div>
        ) : (
          <table className="w-full table-auto border-collapse text-white">
            <thead>
              <tr className="border-b border-white/30 grid grid-cols-[50px_1fr_auto]">
                <th className="p-3 text-left"></th>
                <th className="p-3 text-left">Article</th>
                <th className="p-3 text-left">Updated at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {contents.map((c, index) => (
                <Link to={`/contents/${c._id}`}>
                  <tr
                    key={c._id}
                    className="hover:bg-white/10 transition grid grid-cols-[50px_1fr_auto]"
                  >
                    <td className="p-3">{index}</td>
                    <td className="p-3">{c.title}</td>
                    <td className="p-3">
                      {new Date(c.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
