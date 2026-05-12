import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../api/complaintService";
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
} from "lucide-react";

const RaiseComplaint = () => {
  const navigate = useNavigate();
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

  // ================= FILE =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
    return () => {
      // Cleanup image preview URL
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

    if (!description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
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

      {/* ================= MAIN ================= */}
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

        {/* ================= MEDIA ================= */}
        <section>
          <label className="block text-sm font-bold text-gray-600 mb-3">Upload Evidence</label>
          <div className="relative group">
            <div className="aspect-video rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50 flex flex-col items-center justify-center gap-4 transition-all group-hover:border-blue-500 overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <Camera size={36} className="text-blue-700" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-lg font-bold text-blue-700">Upload Photo or Video</p>
                    <p className="text-sm text-gray-500 mt-2">
                      AI will detect issue category automatically
                    </p>
                  </div>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
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
            placeholder="Explain the issue here..."
            className="w-full p-5 rounded-3xl bg-white border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none shadow-sm"
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
                className="flex-1 bg-transparent outline-none text-gray-700"
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

      {/* ================= FOOTER ================= */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-blue-100 p-4 shadow-lg">
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