import React, { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const HackathonCreateForm = () => {
  const [form, setForm] = useState({
    title: "",
    hostName: "",
    sortDescription: "",
    description: "",
    coverImage: null,
    logoImage: null,
    location: "",
    registrationLink: "",
    startDate: "",
    endDate: "",
    eligibility: "",
    teamSizeMin: 1,
    teamSizeMax: 4,
    isFree: true,
    registrationFee: "",
    judgingCriteria: "",
    prizes: "",
    guidelines: "",
    contactEmail: "",
    contactPhone: "",
    categories: "",
    tags: "",
  });

  const [faqList, setFaqList] = useState([{ question: "", answer: "" }]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqList];
    updatedFaqs[index][field] = value;
    setFaqList(updatedFaqs);
  };

  const addFaq = () => {
    setFaqList([...faqList, { question: "", answer: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    faqList.forEach((faq, index) => {
      formData.append(`faq[${index}][question]`, faq.question);
      formData.append(`faq[${index}][answer]`, faq.answer);
    });

    try {
      await axios.post(`${API_URL}/api/hackathons`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Hackathon created successfully!");
      setForm({ ...form, coverImage: null, logoImage: null });
      setFaqList([{ question: "", answer: "" }]);
    } catch (err) {
      console.error(err);
      alert("Failed to create hackathon.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-neutral-50 focus:bg-white";
  const labelClass = "block text-sm font-semibold text-neutral-700 mb-2";

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <form className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-neutral-100 transform transition-all" onSubmit={handleSubmit}>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-900">Create New Hackathon</h2>
          <p className="text-neutral-500 mt-2">Fill in the details to launch your event.</p>
        </div>

        <div className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Hackathon Title</label>
              <input name="title" placeholder="e.g. CodeBazaar Global Hack" value={form.title} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Host Name</label>
              <input name="hostName" placeholder="Organization or Name" value={form.hostName} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Short Description</label>
              <input name="sortDescription" placeholder="Brief tagline" value={form.sortDescription} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Full Description</label>
              <textarea name="description" placeholder="Detailed explanation..." value={form.description} onChange={handleChange} required className={`${inputClass} min-h-[120px]`} />
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Cover Image</label>
              <input type="file" name="coverImage" accept="image/*" onChange={handleChange} required className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-primary hover:file:bg-indigo-100 cursor-pointer border border-neutral-300 rounded-lg" />
            </div>
            <div>
              <label className={labelClass}>Logo Image</label>
              <input type="file" name="logoImage" accept="image/*" onChange={handleChange} required className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-primary hover:file:bg-indigo-100 cursor-pointer border border-neutral-300 rounded-lg" />
            </div>
          </div>

          {/* Dates & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Location</label>
                  <input name="location" placeholder="Online / City" value={form.location} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Registration Link</label>
                  <input name="registrationLink" placeholder="https://..." value={form.registrationLink} onChange={handleChange} required className={inputClass} />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          {/* Participation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Eligibility</label>
              <input name="eligibility" placeholder="e.g. Students only" value={form.eligibility} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Min Team Size</label>
              <input type="number" name="teamSizeMin" value={form.teamSizeMin} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Max Team Size</label>
              <input type="number" name="teamSizeMax" value={form.teamSizeMax} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300" />
            <label className="text-sm font-semibold text-neutral-700">Free Registration?</label>
          </div>

          {!form.isFree && (
            <div>
              <label className={labelClass}>Registration Fee</label>
              <input type="number" name="registrationFee" placeholder="Amount" value={form.registrationFee} onChange={handleChange} className={inputClass} />
            </div>
          )}

          {/* Details */}
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Judging Criteria</label>
              <textarea name="judgingCriteria" placeholder="Criteria..." value={form.judgingCriteria} onChange={handleChange} className={`${inputClass} min-h-[80px]`} />
            </div>
            <div>
              <label className={labelClass}>Prizes</label>
              <textarea name="prizes" placeholder="Prizes details..." value={form.prizes} onChange={handleChange} className={`${inputClass} min-h-[80px]`} />
            </div>
            <div>
              <label className={labelClass}>Guidelines</label>
              <textarea name="guidelines" placeholder="Rules & Guidelines..." value={form.guidelines} onChange={handleChange} className={`${inputClass} min-h-[80px]`} />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="contactEmail" placeholder="Contact Email" value={form.contactEmail} onChange={handleChange} className={inputClass} />
            <input name="contactPhone" placeholder="Contact Phone" value={form.contactPhone} onChange={handleChange} className={inputClass} />
            <input name="categories" placeholder="Categories (comma-separated)" value={form.categories} onChange={handleChange} className={inputClass} />
            <input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} className={inputClass} />
          </div>

          {/* FAQs */}
          <div>
            <h4 className="text-xl font-bold text-neutral-800 mb-4 border-b pb-2">FAQs</h4>
            {faqList.map((faq, index) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" key={index}>
                <input
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
            <button type="button" onClick={addFaq} className="text-primary hover:text-primary-dark font-semibold text-sm">+ Add Another FAQ</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? 'Submitting...' : 'Submit Hackathon'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HackathonCreateForm;
