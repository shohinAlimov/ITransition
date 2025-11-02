import { Link } from "react-router";

const HomePage = () => {
  return (
    <>
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 text-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-white">
            MyApp
          </Link>

          <nav className="flex gap-6">
            <Link to="/" className="hover:text-blue-400 transition">
              Home
            </Link>
            <Link to="/login" className="hover:text-blue-400 transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-400 transition">
              Register
            </Link>
            <Link to="/dashboard" className="hover:text-blue-400 transition">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-poppins">
        <h1 className="text-5xl font-bold mb-4">Welcome to MyApp 🚀</h1>
        <p className="text-gray-400 max-w-md text-center mb-8">
          A modern fullstack app with authentication and beautiful Tailwind UI.
        </p>
        <a
          href="/register"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Get Started
        </a>
      </div>
    </>
  );
};

export default HomePage;
