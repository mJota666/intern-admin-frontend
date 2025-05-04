import React, { useState } from "react";
import client from "../api/client";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await client.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("FILE URL:");
      console.log(data.url);
      setUrl(data.url);
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={onSubmit} className="flex flex-col">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mb-4"
        />
        <button
          type="submit"
          className="mb-4 p-2 bg-blue-600 text-white rounded"
        >
          Upload
        </button>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            View uploaded file
          </a>
        )}
      </form>
    </div>
  );
}
