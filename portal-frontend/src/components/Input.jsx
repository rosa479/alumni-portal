

function Input({ id, label, type = 'text', placeholder }) {
  return (
    <div className="text-left">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-dark-text">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:outline-none transition"
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default Input;