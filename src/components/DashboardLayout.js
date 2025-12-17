import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { logoutUser, reset } from "../features/auth/authSlice";
import { FaBed, FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logoutUser());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold text-center border-b border-gray-700">
          PMS Admin
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-2 rounded hover:bg-gray-700"
              >
                <FaHome className="mr-3" /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/rooms"
                className="flex items-center p-2 rounded hover:bg-gray-700"
              >
                <FaBed className="mr-3" /> Rooms
              </Link>
            </li>
            {/* Tambahkan menu lain seperti Users di sini */}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="flex items-center w-full p-2 text-red-400 hover:bg-gray-700 rounded"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome, <span className="text-blue-600">{user?.name}</span>
          <span className="ml-2 text-sm font-normal bg-gray-200 px-2 py-1 rounded capitalize">
            {user?.role}
          </span>
        </h2>
        <main className="p-6">
          <Outlet /> {/* Ini tempat halaman anak (Rooms, dll) akan muncul */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
