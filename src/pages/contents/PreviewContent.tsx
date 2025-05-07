/** @jsxImportSource @emotion/react */
import { useLocation, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";

interface TextBlock {
  type: "text";
  data: { header: string; body: string };
}
interface ImageBlock {
  type: "image";
  data: string;
}
interface VideoBlock {
  type: "video";
  data: string;
}
type Block = TextBlock | ImageBlock | VideoBlock;

const hideScrollCss = css`
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

export default function PreviewContent() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-6 text-center">
        No preview data. <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  const { title, blocks, status } = state;

  return (
    <div
      className="w-full h-full bg-black/50 flex flex-col items-center overflow-auto"
      css={hideScrollCss}
    >
      <div className="mt-4">
        <button
          onClick={() => {
            state.isEdit
              ? navigate(`/contents/${state.id}}`, {
                  state: { title, blocks, status },
                })
              : navigate(`/contents/new`, {
                  state: { title, blocks, status },
                });
          }}
          className="px-3 py-1 bg-white/30 hover:bg-white/40 text-white rounded transition"
        >
          &larr; Back
        </button>
      </div>

      <div className="mt-6 max-w-3xl w-full p-6 bg-white/10 backdrop-blur-lg rounded-2xl text-white space-y-6">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <div className="text-sm text-gray-200">Status: {status}</div>

        {blocks.map((blk: Block, i: any) => {
          if (blk.type === "text") {
            return (
              <div key={i} className="space-y-2">
                <h2 className="text-2xl font-bold">{blk.data.header}</h2>
                <p>{blk.data.body}</p>
              </div>
            );
          }
          if (blk.type === "image") {
            return (
              <img
                key={i}
                src={blk.data}
                alt=""
                className="w-full rounded-lg"
              />
            );
          }
          if (blk.type === "video") {
            return (
              <video
                key={i}
                src={blk.data}
                controls
                className="w-full rounded-lg"
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
