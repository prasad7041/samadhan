import React, { useEffect, useState } from "react";
import {
  Mic,
  MicOff,
  MapPin,
  Send,
  Camera,
  ArrowLeft,
} from "lucide-react";

const RaiseComplaint = () => {
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState(null);

  const [location, setLocation] = useState(
    "Fetching location..."
  );

  const [isListening, setIsListening] = useState(false);

  // ================= FILE =================
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  // ================= LOCATION =================
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocation(
        "Geolocation is not supported."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat =
          position.coords.latitude.toFixed(5);

        const lng =
          position.coords.longitude.toFixed(5);

        setLocation(`${lat}, ${lng}`);
      },
      () => {
        setLocation(
          "Unable to fetch location."
        );
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // ================= VOICE =================
  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition not supported in this browser."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.start();

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setDescription(
        (prev) => prev + " " + transcript
      );

      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen pb-32 text-gray-800">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto h-16 px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-2xl hover:bg-blue-50 flex items-center justify-center transition">
              <ArrowLeft
                size={22}
                className="text-blue-700"
              />
            </button>

            <h1 className="text-2xl font-black text-blue-700">
              New Complaint
            </h1>
          </div>

          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-blue-100 shadow-sm">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="pt-24 px-4 max-w-5xl mx-auto space-y-8">
        {/* ================= MEDIA ================= */}
        <section>
          <label className="block text-sm font-bold text-gray-600 mb-3">
            Upload Evidence
          </label>

          <div className="relative group">
            <div className="aspect-video rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50 flex flex-col items-center justify-center gap-4 transition-all group-hover:border-blue-500">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <Camera
                  size={36}
                  className="text-blue-700"
                />
              </div>

              <div className="text-center px-4">
                <p className="text-lg font-bold text-blue-700">
                  {fileName
                    ? fileName
                    : "Upload Photo or Video"}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  AI will detect issue category
                  automatically
                </p>
              </div>
            </div>

            <input
              type="file"
              accept="image/*,video/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
        </section>

        {/* ================= DESCRIPTION ================= */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-gray-600">
              Describe the Issue
            </label>

            <button
              onClick={startVoiceRecognition}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition ${
                isListening
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {isListening ? (
                <MicOff size={18} />
              ) : (
                <Mic size={18} />
              )}

              <span className="text-sm font-semibold">
                {isListening
                  ? "Listening..."
                  : "Voice Note"}
              </span>
            </button>
          </div>

          <textarea
            rows="5"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Explain the issue here..."
            className="w-full p-5 rounded-3xl bg-white border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none shadow-sm"
          />
        </section>

        {/* ================= LOCATION ================= */}
        <section>
          <label className="block text-sm font-bold text-gray-600 mb-3">
            Location
          </label>

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

            {/* MAP */}
            <div className="mt-5 rounded-3xl overflow-hidden border border-blue-100">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                alt="Map"
                className="w-full h-56 object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-blue-100 p-4 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() =>
              console.log({
                description,
                fileName,
                location,
              })
            }
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl"
          >
            Submit Complaint

            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default RaiseComplaint;