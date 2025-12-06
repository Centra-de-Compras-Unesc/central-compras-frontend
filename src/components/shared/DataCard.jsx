import PropTypes from "prop-types";

export default function DataCard({ title, value, change }) {
  return (
    <div className="card">
      <h3 className="text-dark-text/70 text-sm mb-1">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-dark-text">{value}</span>
        {change && (
          <span
            className={`text-sm ${
              change.trim().startsWith("+") ? "text-green-400" : "text-red-400"
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
