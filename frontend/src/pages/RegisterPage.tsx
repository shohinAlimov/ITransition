import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { setUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../store/hooks/hooks";
import GoogleAuth from "../components/GoogleAuth";
import GithubAuth from "../components/GithubAuth";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { name, email, password } = form;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: name },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Check for duplicate email
      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        setError("This email is already registered. Please login instead.");
        return;
      }

      if (data.user) {
        dispatch(setUser(data.user));

        // If email confirmation is disabled, redirect
        if (data.session) {
          navigate("/dashboard");
        } else {
          setError("Success! Please check your email to confirm your account.");
        }
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
          Create Account
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
            className="cursor-pointer mt-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Register"}
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
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
