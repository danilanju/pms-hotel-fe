import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  resetRoomState,
} from "../features/rooms/roomSlice";
import RoomModal from "../components/RoomModal";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Rooms = () => {
  const dispatch = useDispatch();

  // Ambil data user dari auth state dan data rooms
  const { user } = useSelector((state) => state.auth);

  // Ambil state dari Redux Store
  const { rooms, isLoading, isError, message } = useSelector(
    (state) => state.rooms
  );

  // State lokal untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null); // null = Create, object = Edit

  // Load rooms saat halaman dibuka
  useEffect(() => {
    dispatch(getRooms());
    return () => {
      dispatch(resetRoomState());
    };
  }, [dispatch]);

  // Handle Klik tombol "Add New Room"
  const handleAddNew = () => {
    setCurrentRoom(null); // Mode Create
    setIsModalOpen(true);
  };

  // Handle Klik tombol "Edit"
  const handleEdit = (room) => {
    setCurrentRoom(room); // Mode Edit
    setIsModalOpen(true);
  };

  // Handle Submit dari Modal
  const handleModalSubmit = async (formData) => {
    if (currentRoom) {
      // Mode Update
      await dispatch(updateRoom({ id: currentRoom._id, roomData: formData }));
    } else {
      // Mode Create
      await dispatch(createRoom(formData));
    }
    setIsModalOpen(false); // Tutup modal setelah save
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      dispatch(deleteRoom(id));
    }
  };

  if (isLoading && rooms.length === 0)
    return <div className="p-4">Loading...</div>;
  const isAdmin = user?.role === "admin";
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
        {isAdmin && (
          <button
            onClick={handleAddNew}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow-md"
          >
            <FaPlus className="mr-2 text-sm" /> Add New Room
          </button>
        )}
      </div>

      {isError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm">
          <p>{message}</p>
        </div>
      )}

      {/* Kontainer Tabel dengan Overflow-X agar responsif di HP */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Weekend Rate
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr
                  key={room._id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {room.roomNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {room.roomType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700 font-mono">
                      Rp {room.baseRate?.toLocaleString() || "0"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700 font-mono">
                      Rp{" "}
                      {room.weekendRate?.toLocaleString() ||
                        room.baseRate?.toLocaleString() ||
                        "0"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border 
                      ${
                        room.status === "Vacant Ready"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : room.status === "Occupied"
                          ? "bg-orange-100 text-orange-700 border-orange-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(room)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition"
                          title="Edit Room"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition"
                          title="Delete Room"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rooms.length === 0 && !isLoading && (
          <div className="p-6 text-center text-gray-500">
            No rooms found. Start adding one!
          </div>
        )}
      </div>

      {/* Render Modal */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={currentRoom}
      />
    </div>
  );
};

export default Rooms;
