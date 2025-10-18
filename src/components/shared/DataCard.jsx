import React from "react";
import PropTypes from "prop-types";

export default function DataCard({ title, value, change }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{value}</span>
        {change && (
          <span
            className={`text-sm ${
              change.startsWith("+") ? "text-green-500" : "text-red-500"
            }`}
          >
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
