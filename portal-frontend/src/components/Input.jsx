function Input({ id, label, value, onChange, type = "text", placeholder, disabled = false, className = "", required = true }) {
  return (
    <div className="text-left">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-dark-text"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:outline-none transition ${disabled ? 'bg-gray-200 cursor-not-allowed text-gray-600' : ''} ${className}`}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default Input;
