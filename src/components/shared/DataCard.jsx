import React from "react";
import PropTypes from "prop-types";

export default function DataCard({ title, value, change }) {
  const isPositive = change?.trim().startsWith("+");
  const changeColor = isPositive ? "text-emerald-400" : "text-rose-400";
  const changeBadgeBg = isPositive
    ? "bg-emerald-500/10 border-emerald-500/30"
    : "bg-rose-500/10 border-rose-500/30";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#1F1F23] via-[#16161A] to-[#101015] p-6 shadow-[0_24px_60px_-28px_rgba(255,115,29,0.45)]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
        {title}
      </p>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-3xl font-semibold text-white">{value}</span>
        {change && (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${changeBadgeBg} ${changeColor}`}
          >
            <svg
              className={`h-3.5 w-3.5 ${isPositive ? "" : "rotate-180"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

DataCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string,
};
