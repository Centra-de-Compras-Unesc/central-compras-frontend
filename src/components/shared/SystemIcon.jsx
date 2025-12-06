export default function SystemIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="15"
        fill="currentColor"
        opacity="0.1"
      />
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="15"
        stroke="currentColor"
        strokeWidth="2"
      />

      <text
        x="50"
        y="65"
        fontSize="50"
        fontWeight="bold"
        fill="currentColor"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        C
      </text>

      <circle cx="75" cy="25" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="80" cy="30" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
