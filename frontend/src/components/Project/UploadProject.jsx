import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function UploadProject() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    tags: "",
    learning: "", // Added learning outcomes
    liveDemoLink: "", // Added Live Demo Link
  });

  const [userId, setUserId] = useState("");
  const [logo, setLogo] = useState(null);
  const [cover, setCover] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/me`, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data._id) {
          setUserId(res.data._id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("owner", userId);
      data.append("tags", form.tags);
      data.append("learning", form.learning);

      data.append("liveDemoLink", form.liveDemoLink);
      data.append("githubLink", form.githubLink);
      data.append("logoImage", logo);
      data.append("coverImage", cover);
      data.append("stars", Math.floor(Math.random() * 300));

      await axios.post(`${API_URL}/api/projects/uploadproject`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Project uploaded successfully!");
      setForm({
        title: "",
        description: "",
        price: "",
        tags: "",
        learning: ""
      });
      setLogo(null);
      setCover(null);
    } catch (err) {
      alert("Upload failed! Check console for details.");
      console.error("Upload error:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-white";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-2";

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-neutral-100">
        <h2 className="text-3xl font-bold text-neutral-900 text-center mb-8">Upload Your Project</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className={labelClass}>Project Title</label>
            <input
              type="text"
              placeholder="e.g. AI-Powered Chatbot"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              placeholder="Describe your project features, tech stack, etc."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className={`${inputClass} min-h-[120px]`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 499"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tags</label>
              <input
                type="text"
                placeholder="React, Node.js, MongoDB"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Learning Points</label>
            <input
              type="text"
              placeholder="Authentication, API handling, State Management"
              value={form.learning}
              onChange={(e) => setForm({ ...form, learning: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={labelClass}>GitHub Repository Link</label>
              <button
                type="button"
                onClick={async () => {
                  if (!form.githubLink) return alert("Please enter a GitHub URL first");
                  try {
                    setIsLoading(true);
                    const res = await axios.post(`${API_URL}/api/projects/github-info`, { url: form.githubLink });
                    const { title, description, tags, realStars } = res.data;

                    setForm(prev => ({
                      ...prev,
                      title: title || prev.title,
                      description: description || prev.description,
                      tags: tags.join(", ") || prev.tags,
                      // We could also set stars if we update backend to accept them
                    }));
                    alert("Auto-filled from GitHub! 🐙");
                  } catch (err) {
                    alert("Failed to fetch GitHub info. Check the URL.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
              >
                ⚡ Auto-fill from GitHub
              </button>
            </div>
            <input
              type="url"
              placeholder="https://github.com/username/repo"
              value={form.githubLink || ""}
              onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Live Demo Link (Optional)</label>
            <input
              type="url"
              placeholder="https://your-project-demo.com"
              value={form.liveDemoLink}
              onChange={(e) => setForm({ ...form, liveDemoLink: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <div>
              <label className={labelClass}>Project Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
                required
                className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-primary hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>
            <div>
              <label className={labelClass}>Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files[0])}
                required
                className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-primary hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!userId || isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {userId ? (isLoading ? "Uploading..." : "Submit Project") : "Loading user details..."}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadProject;
