import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #2c1642 0%, #1c0f2a 50%, #12081d 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          border: "4px solid #2fb7d1",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        <svg
          width="130"
          height="130"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* F Vertical Stem */}
          <path
            d="M16 16.5C16 14.567 17.567 13 19.5 13H21.5C23.433 13 25 14.567 25 16.5V47.5C25 49.433 23.433 51 21.5 51H19.5C17.567 51 16 49.433 16 47.5V16.5Z"
            fill="#2fb7d1"
          />
          {/* F Top Bar */}
          <path
            d="M21 13H38C39.933 13 41.5 14.567 41.5 16.5V17.5C41.5 19.433 39.933 21 38 21H21V13Z"
            fill="#2fb7d1"
          />
          {/* F Mid Bar */}
          <path
            d="M21 27.5H32.5C34.433 27.5 36 29.067 36 31V31.5C36 33.433 34.433 35 32.5 35H21V27.5Z"
            fill="#2fb7d1"
          />
          {/* Growth Arrow in Gold */}
          <path
            d="M27 46L36 35L44 25L51 17.5"
            stroke="#f8c44c"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M43 16H52V25"
            stroke="#f8c44c"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Gold Sparkles */}
          <circle cx="52" cy="11" r="2.5" fill="#fef08a" />
          <circle cx="43" cy="8" r="1.8" fill="#f8c44c" />
          <circle cx="57" cy="19" r="1.4" fill="#f8c44c" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
