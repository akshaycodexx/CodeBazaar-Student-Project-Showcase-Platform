import React from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Tutorials({ tutorials, setTutorials, user }) {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tutorial?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/photos/${id}`, { withCredentials: true });
      setTutorials((prev) => prev.filter((t) => t._id !== id));
      alert("Tutorial deleted.");
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Failed to delete tutorial.");
    }
  };

  return (
    <section className="py-16 bg-indigo-50 min-h-[40vh]">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-10">Paid Tutorials</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.length > 0 ? (
            tutorials.map((tutorial) => (
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative border border-indigo-100" key={tutorial._id}>
                <div className="h-48 bg-neutral-200 overflow-hidden">
                  {tutorial.imageUrl ? (
                    <img src={tutorial.imageUrl} alt={tutorial.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400">No Image</div>
                  )}
                </div>

                <div className="p-5">
                  <h4 className="text-lg font-bold text-indigo-800 mb-1 truncate">{tutorial.title}</h4>
                  <p className="text-sm text-neutral-500">
                    by <span className="font-medium text-neutral-700">{tutorial.createdBy?.username || "Unknown"}</span>
                  </p>
                </div>

                {user &&
                  (user._id === tutorial.createdBy?._id ||
                    user.role === "admin") && (
                    <button
                      onClick={() => handleDelete(tutorial._id)}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-xs font-bold shadow-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-neutral-500 text-lg">No tutorials found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Tutorials;
