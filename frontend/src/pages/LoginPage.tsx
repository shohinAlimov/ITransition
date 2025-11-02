import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router";
import { setUser } from "../store/slices/userSlice";
import { useAppDispatch } from "../store/hooks/hooks";
import GoogleAuth from "../components/GoogleAuth";
import GithubAuth from "../components/GithubAuth";

const Login = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { email, password } = form;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        dispatch(setUser(data.user));
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black font-poppins">
      <div className="bg-gray-900/80 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900/80 text-gray-400">
              or continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <GoogleAuth onError={setError} />
          <GithubAuth onError={setError} />
        </div>

        {error && (
          <p className="text-center mt-4 text-sm text-red-500">{error}</p>
        )}

        <p className="text-gray-400 text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
