import { theBlue } from "./constants";

export default function CopyIcon({ color, isCopied, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      {...props}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke={isCopied ? "limegreen" : theBlue}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      >
        <path d="M24 5.5v17a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 4 22.5v-17A1.5 1.5 0 0 1 5.5 4h17A1.5 1.5 0 0 1 24 5.5z" />
        <path d="M28 9.5v17a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 8 26.5v-17A1.5 1.5 0 0 1 9.5 8h17A1.5 1.5 0 0 1 28 9.5z" />
      </g>
    </svg>
  );
}
