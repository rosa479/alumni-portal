

function Button({ type = 'submit', children }) {
  return (
    <button
      type={type}
      className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5"
    >
      {children}
    </button>
  );
}

export default Button;