import React, { useState, useEffect } from "react";

const RoomModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  // Field disesuaikan dengan skema backend: roomNumber, roomType, baseRate, status
  const [formData, setFormData] = useState({
    roomNumber: "", // Dulu: name
    roomType: "Superior", // Dulu: type. Dibuat default 'Superior'
    status: "Vacant Ready", // Baru: Wajib ada
    baseRate: 0, // Dulu: price. Dibuat default 0
    weekendRate: 0,
    seasonalRate: 0,
    description: "",
    capacity: 2, // Default 2
    amenities: [], // Array kosong
  });

  // Efek: Isi form jika mode Edit (ada initialData), kosongkan jika Create
  // Efek: Isi form jika mode Edit, kosongkan jika Create
  useEffect(() => {
    if (initialData) {
      // Pastikan semua field wajib dari skema ada saat Edit
      setFormData({
        roomNumber: initialData.roomNumber || "",
        roomType: initialData.roomType || "Superior",
        status: initialData.status || "Vacant Ready",
        baseRate: initialData.baseRate || 0,
        weekendRate: initialData.weekendRate || 0,
        seasonalRate: initialData.seasonalRate || 0,
        description: initialData.description || "",
        capacity: initialData.capacity || 2,
        amenities: initialData.amenities || [],
      });
    } else {
      setFormData({
        roomNumber: "",
        roomType: "Superior",
        status: "Vacant Ready",
        baseRate: 0,
        weekendRate: 0,
        seasonalRate: 0,
        description: "",
        capacity: 2,
        amenities: [],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // --- PERBAIKAN: Konversi angka di sini sebelum dikirim ---
    const dataToSubmit = {
      ...formData,
      baseRate: Number(formData.baseRate),
      weekendRate: Number(formData.weekendRate),
      seasonalRate: Number(formData.seasonalRate),
      capacity: Number(formData.capacity),
      // createdAt dan createdBy akan diisi di backend
    };

    // Cek apakah field wajib terisi
    if (
      !dataToSubmit.roomNumber ||
      !dataToSubmit.roomType ||
      !dataToSubmit.baseRate
    ) {
      alert("Room Number, Room Type, and Base Rate are required!");
      return;
    }

    onSubmit(dataToSubmit);
  };

  return (
    // Overlay Hitam Transparan
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Kotak Modal Putih */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Room" : "Add New Room"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Input Room Number */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Room Number
            </label>
            <input
              type="text"
              name="roomNumber" // DULU: name
              value={formData.roomNumber}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Input Room Type (Menggunakan ENUM Superior, Deluxe, Executive, Suite) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Room Type
            </label>
            <select
              name="roomType" // DULU: type
              value={formData.roomType}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Superior">Superior</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Executive">Executive</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          {/* Input Base Rate */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Base Rate (Required)
            </label>
            <input
              type="number"
              name="baseRate" // DULU: price
              value={formData.baseRate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Input Status (Wajib ada di skema) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="Vacant Ready">Vacant Ready</option>
              <option value="Vacant Clean">Vacant Clean</option>
              <option value="Vacant Dirty">Vacant Dirty</option>
              <option value="Occupied">Occupied</option>
              <option value="Out of Order">Out of Order</option>
            </select>
          </div>

          {/* Input Weekend Rate (Opsional) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Weekend Rate
            </label>
            <input
              type="number"
              name="weekendRate"
              value={formData.weekendRate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Input Description (Opsional) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Tombol Action */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
