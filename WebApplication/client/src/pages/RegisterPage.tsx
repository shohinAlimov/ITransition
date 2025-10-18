import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex flex-col justify-center lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Sign Up to The App
            </h1>
            <div className="w-full flex-1 mt-8">
              <form className="flex flex-col gap-5 mx-auto max-w-xs mb-10">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                  type="text"
                  placeholder="Full Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <div className="flex items-center gap-2 my-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="outline-none"
                  />
                  <label
                    htmlFor="remember"
                    className="text-gray-700 text-sm cursor-pointer select-none"
                  >
                    Remember Me
                  </label>
                </div>
                <button
                  className="cursor-pointer tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleSubmit}
                  type="submit"
                >
                  Sign Up
                </button>
              </form>

              <p className="mx-auto max-w-xs">
                Don't have an account?{" "}
                <Link
                  className="font-semibold text-blue-600 underline"
                  to="/login"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"></div>
        </div>
      </div>
    </div>
  );
}
