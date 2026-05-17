import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint, getCategories } from "../api/complaintService";
import {
  Mic,
  MicOff,
  MapPin,
  Send,
  Camera,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

const RaiseComplaint = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [sector, setSector] = useState("");
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState("Fetching location...");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= FILE HANDLER =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  // ================= LOCATION =================
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocation("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      },
      () => {
        setLocation("Unable to fetch location.");
      }
    );
  };

  useEffect(() => {
    fetchLocation();
    
    getCategories()
      .then((res) => {
        if (res?.data) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.error("Failed to fetch complaint categories", err));

    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, []);

  // ================= VOICE =================
  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => prev + " " + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!title.trim() || title.trim().length < 3) {
      setError("Please enter a valid complaint title (min 3 characters).");
      return;
    }

    if (!sector) {
      setError("Please select the relevant complaint category/sector.");
      return;
    }

    if (!imageFile) {
      setError("Please capture live evidence to proceed.");
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setError("Please describe the issue in detail (min 10 characters).");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("sector", sector);
      formData.append("description", description);
      formData.append("location", location);
      if (latitude) formData.append("latitude", latitude);
      if (longitude) formData.append("longitude", longitude);
      if (imageFile) formData.append("image", imageFile);

      await createComplaint(formData);
      setSuccess("Complaint submitted successfully!");
      setTimeout(() => navigate("/citizen/myreports"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen pb-32 text-gray-800">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto h-16 px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl hover:bg-blue-50 flex items-center justify-center transition"
            >
              <ArrowLeft size={22} className="text-blue-700" />
            </button>
            <h1 className="text-2xl font-black text-blue-700">New Complaint</h1>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="pt-24 px-4 max-w-5xl mx-auto space-y-8">
        {/* Messages */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 text-sm">
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        {/* ================= LIVE EVIDENCE MEDIA SECTION ================= */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-gray-600">Capture Live Evidence</label>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              Live Camera Mode
            </span>
          </div>
          
          <div className="relative group">
            <div className="aspect-video rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50/50 flex flex-col items-center justify-center gap-4 transition-all group-hover:border-blue-500 overflow-hidden relative shadow-inner">
              {imagePreview ? (
                <div className="w-full h-full relative">
                  <img src={imagePreview} alt="Live Evidence Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={clearPhoto}
                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white p-2 rounded-full transition flex items-center gap-1.5 text-xs font-bold shadow-lg z-20"
                  >
                    <XCircle size={16} /> Recapture
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                    <Camera size={36} />
                  </div>
                  <div className="text-center px-4 pointer-events-none">
                    <p className="text-lg font-black text-blue-800">Tap to Open Device Camera</p>
                    <p className="text-sm text-gray-500 mt-1 max-w-sm">
                      Please use your device camera to document the complaint context instantly.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Updated Live Input Tag Implementation */}
            {!imagePreview && (
              <input
                type="file"
                accept="image/*"
                capture="user"
                multiple={false}
                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                onChange={handleFileChange}
              />
            )}
          </div>
        </section>

        {/* ================= TITLE & SECTOR ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Complaint Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Severe Water Pipeline Burst"
              className="w-full p-4 rounded-2xl bg-white border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Category / Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm font-medium text-gray-700"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.sector_name}>
                  {cat.sector_name}
                </option>
              ))}
              {categories.length === 0 && (
                <>
                  <option value="Water">Water</option>
                  <option value="Roads">Roads</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Drainage">Drainage</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Street Lights">Street Lights</option>
                  <option value="Traffic">Traffic</option>
                  <option value="Public Safety">Public Safety</option>
                </>
              )}
            </select>
          </div>
        </section>

        {/* ================= DESCRIPTION ================= */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-gray-600">Describe the Issue</label>
            <button
              onClick={startVoiceRecognition}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition ${
                isListening ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-700"
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span className="text-sm font-semibold">
                {isListening ? "Listening..." : "Voice Note"}
              </span>
            </button>
          </div>

          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain the issue details here..."
            className="w-full p-5 rounded-3xl bg-white border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none shadow-sm font-medium"
          />
        </section>

        {/* ================= LOCATION ================= */}
        <section>
          <label className="block text-sm font-bold text-gray-600 mb-3">Location</label>
          <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-700" />
              <input
                type="text"
                value={location}
                readOnly
                className="flex-1 bg-transparent outline-none text-gray-700 font-medium"
              />
              <button
                onClick={fetchLocation}
                className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ACTIONS ================= */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-blue-100 p-4 shadow-lg z-40">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Complaint
                <Send size={20} />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default RaiseComplaint;