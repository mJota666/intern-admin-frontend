/** @jsxImportSource @emotion/react */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../api/client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { ArrowLeft } from "lucide-react";
import { css } from "@emotion/react";

type Block =
  | { type: "text"; data: { header: string; body: string } }
  | { type: "image"; data: string }
  | { type: "video"; data: string };

type Status = "draft" | "submitted" | "published";

export default function ContentForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== "new");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [status, setStatus] = useState<Status>("draft");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // hide scrollbars
  const hideScrollCss = css`
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  `;

  // load existing content
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    client
      .get(`/contents/${id}`)
      .then(({ data }) => {
        setTitle(data.title);
        setBlocks(data.blocks);
        setStatus(data.status);
      })
      .catch(() => setError("Failed to load content"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // block operations
  const addBlock = (type: Block["type"]) =>
    setBlocks((prev) => [
      ...prev,
      type === "text"
        ? { type: "text", data: { header: "", body: "" } }
        : { type, data: "" },
    ]);

  const updateTextHeader = (idx: number, header: string) =>
    setBlocks((prev) =>
      prev.map((b, i) =>
        i === idx && b.type === "text"
          ? { ...b, data: { ...b.data, header } }
          : b
      )
    );

  const updateTextBody = (idx: number, body: string) =>
    setBlocks((prev) =>
      prev.map((b, i) =>
        i === idx && b.type === "text" ? { ...b, data: { ...b.data, body } } : b
      )
    );
  const updateBlock = (idx: number, data: string) =>
    setBlocks((prev) =>
      prev.map((b, i) => {
        if (i !== idx) return b;
        if (b.type === "text") return b;
        return { ...b, data };
      })
    );

  const removeBlock = (idx: number) =>
    setBlocks((prev) => prev.filter((_, i) => i !== idx));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    setBlocks((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(result.source.index, 1);
      arr.splice(result.destination!.index, 0, moved);
      return arr;
    });
  };

  const uploadImage = async (file: File, idx: number) => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await client.post<{ url: string }>("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setBlocks((prev) =>
      prev.map((b, i) =>
        i === idx && b.type === "image" ? { ...b, data: data.url } : b
      )
    );
  };

  // submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmAction = window.confirm(
      isEdit
        ? "Are you sure you want to update this content?"
        : "Are you sure you want to create this content?"
    );

    if (!confirmAction) return; // If user cancels, stop the form submission

    setError(null);
    setSaving(true);
    try {
      const payload = { title, blocks, status };
      const res = isEdit
        ? await client.put(`/contents/${id}`, payload)
        : await client.post("/contents", payload);
      const finalId = isEdit ? id! : res.data._id;
      await client.post(`/contents/${finalId}/submit`);
      navigate("/contents");
    } catch (e: any) {
      setError(e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-full overflow-auto  p-2" css={hideScrollCss}>
      <div className="flex gap-4">
        {/* Preview */}
        <button
          type="button"
          onClick={() =>
            navigate("/preview", {
              state: { title, blocks, status },
            })
          }
          className="
          p-2 bg-black/30 rounded-lg hover:bg-black/40 transition
          flex items-center gap-2 text-white mb-4 cursor-pointer
        "
        >
          Preview
        </button>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="
          p-2 bg-white/30 rounded-lg hover:bg-white/40 transition
          flex items-center gap-2 text-white mb-4 cursor-pointer
        "
        >
          <ArrowLeft size={20} className="text-white" /> Back
        </button>
      </div>

      <h1 className="text-2xl font-playwrite font-semibold text-white mb-6 text-center">
        {isEdit ? "Edit Content" : "New Content"}
      </h1>

      {loading ? (
        <div className="text-center text-white py-6">Loading…</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-2 bg-red-500/80 text-white rounded text-center">
              {error}
            </div>
          )}

          {/* Title Field */}
          <div>
            <label className="block text-white mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              placeholder="Enter a title"
            />
          </div>

          {/* Drag-and-Drop Blocks */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {blocks.length === 0 && (
                    <p className="text-white/70 italic">
                      No blocks yet. Add one above.
                    </p>
                  )}
                  {blocks.map((blk, idx) => (
                    <Draggable key={idx} draggableId={`${idx}`} index={idx}>
                      {(p) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          className="
                            relative p-4
                            bg-white/30 text-white
                            border border-white/50
                            rounded-lg shadow
                          "
                        >
                          {/* Remove Block */}
                          <button
                            type="button"
                            onClick={() => removeBlock(idx)}
                            className="
                              absolute top-2 right-2
                              text-white font-bold bg-red-500
                              rounded-full  w-6 h-6
                              hover:bg-red-700 transition
                              cursor-pointer
                            "
                          >
                            &times;
                          </button>

                          {/* Text Block */}
                          {blk.type === "text" && (
                            <div className="space-y-3">
                              <div>
                                <label className="block mb-1 font-medium text-white">
                                  Header
                                </label>
                                <input
                                  type="text"
                                  value={blk.data.header}
                                  onChange={(e) =>
                                    updateTextHeader(idx, e.target.value)
                                  }
                                  className="
                                    w-full px-3 py-2
                                    bg-black/30 text-white
                                    border border-white/50
                                    rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-white/80
                                  "
                                  placeholder="Section header"
                                />
                              </div>
                              <div>
                                <label className="block mb-1 font-medium text-white">
                                  Body
                                </label>
                                <textarea
                                  value={blk.data.body}
                                  onChange={(e) =>
                                    updateTextBody(idx, e.target.value)
                                  }
                                  className="
                                    w-full px-3 py-2
                                    bg-black/30 text-white
                                    border border-white/50
                                    rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-white/80
                                  "
                                  rows={4}
                                  placeholder="Section body"
                                />
                              </div>
                            </div>
                          )}

                          {/* Image Block */}
                          {blk.type === "image" && (
                            <div className="space-y-2">
                              <label className="block mb-1 font-medium text-white">
                                Upload Image
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  e.target.files?.[0] &&
                                  uploadImage(e.target.files[0], idx)
                                }
                                className="mb-2"
                              />
                              {blk.data && (
                                <img
                                  src={blk.data}
                                  alt=""
                                  className="w-full rounded-lg shadow-lg"
                                />
                              )}
                            </div>
                          )}

                          {/* Video Block */}
                          {blk.type === "video" && (
                            <div className="space-y-2">
                              <label className="block mb-1 font-medium text-white">
                                Video URL
                              </label>
                              <input
                                type="url"
                                value={blk.data}
                                onChange={(e) =>
                                  updateBlock(idx, e.target.value)
                                }
                                className="
                                  w-full px-3 py-2
                                  bg-black/30 text-white
                                  border border-white/50
                                  rounded-lg
                                  focus:outline-none focus:ring-2 focus:ring-white/80
                                "
                                placeholder="https://..."
                              />
                              {blk.data && (
                                <video
                                  src={blk.data}
                                  controls
                                  className="w-full mt-2 rounded-lg shadow-lg"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Add Block Buttons */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => addBlock("text")}
              className="px-3 py-1 bg-black/60 hover:bg-black/90 text-white rounded-lg transition cursor-pointer"
            >
              + Text
            </button>
            <button
              type="button"
              onClick={() => addBlock("image")}
              className="px-3 py-1 bg-black/60 hover:bg-black/90 text-white rounded-lg transition cursor-pointer"
            >
              + Image
            </button>
            <button
              type="button"
              onClick={() => addBlock("video")}
              className="px-3 py-1 bg-black/60 hover:bg-black/90 text-white rounded-lg transition cursor-pointer"
            >
              + Video
            </button>
          </div>

          {/* Status */}
          <div>
            <label className="block text-white mb-1 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full px-4 py-2 bg-white/30 text-black border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/80"
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 shadow-xl text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {saving
                ? isEdit
                  ? "Updating…"
                  : "Creating…"
                : isEdit
                ? "Update Content"
                : "Create Content"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
