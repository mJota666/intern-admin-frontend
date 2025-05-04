/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Article } from "../interfaces/Article";

export default function ArticleCard({ a }: { a: Article }) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const cardCss = css`
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 16px;
    border-top-right-radius: 80px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 0px solid rgba(255, 255, 255, 0.5);
  `;
  const circleCss = css`
    position: absolute;
    z-index: -10;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 1);
    border-radius: 50%;
    pointer-events: none;
    filter: blur(2px);
  `;
  return (
    <Link
      onMouseEnter={() => setHover(true)}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setHover(false)}
      css={cardCss}
      to={`/article/${a._id}`}
      key={a._id}
      className="shadow-xl w-[300px] h-[200px] flex flex-col gap-2 justify-center items-center hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <div className="font-semibold text-white text-xl text-center">
        {a.title}
      </div>
      <div className="text-black text-sm">
        Updated {new Date(a.updatedAt).toLocaleString()}
      </div>
      {/* the little circle */}
      {hover && (
        <div
          css={circleCss}
          style={{
            top: pos.y,
            left: pos.x,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </Link>
  );
}
