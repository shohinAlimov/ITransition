import { useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAppDispatch, useAppSelector } from "../store/hooks/hooks";
import { clearUser } from "../store/slices/userSlice";

const Dashboard = () => {
  const { user, isAuth } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
    navigate("/login");
  };

  if (!isAuth) {
    return <div>Please login</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white font-poppins">
      <div className="container mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <div>
          <h1>Welcome, {user?.email}</h1>
          <p>User ID: {user?.id}</p>
          <p>Username: {user?.user_metadata?.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <p className="text-gray-400">
          Welcome back! Here’s your main panel. You can manage your data or
          settings here.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p className="text-gray-400 text-sm">
              View and edit your personal information.
            </p>
          </div>
          <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Settings</h3>
            <p className="text-gray-400 text-sm">
              Customize app preferences and privacy options.
            </p>
          </div>
          <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-400 text-sm">
              Monitor activity, usage, and trends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
