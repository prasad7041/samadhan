import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSectorComplaints, updateComplaintStatus } from "../api/complaintService";

import {
  ArrowBack,
  LocationOn,
  CalendarToday,
  PriorityHigh,
  HourglassEmpty,
  Autorenew,
  CheckCircle,
  Description,
  CloudUpload,
  MyLocation
} from "@mui/icons-material";

export default function ViewTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Resolution verification workflow states
  const [showVerification, setShowVerification] = useState(false);
  const [resolvedImage, setResolvedImage] = useState(null);
  const [resolvedImagePreview, setResolvedImagePreview] = useState(null);
  const [locationCoords, setLocationCoords] = useState(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await getSectorComplaints(1, 100);

        const complaints =
          res?.data?.data?.complaints ||
          res?.data?.complaints ||
          [];

        const targetTask = complaints.find(
          (c) => Number(c.id) === Number(id)
        );

        if (!targetTask) {
          setErrorMessage("Task not found.");
          return;
        }

        setTask({
          id: targetTask.id,
          title: targetTask.title || "Untitled Issue",
          department: targetTask.sector || "General",
          location: targetTask.location || "Unknown Location",
          reported: targetTask.created_at
            ? new Date(targetTask.created_at).toLocaleDateString("en-IN")
            : "Unknown",
          status: (targetTask.status || "pending").toLowerCase(),
          priority: (targetTask.priority || "medium").toLowerCase(),
          image: targetTask.image_path
            ? `http://localhost:5000${targetTask.image_path}`
            : null,
          description: targetTask.description || "No description provided.",
        });

      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load task details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTaskDetails();
  }, [id]);

  // Standard updates for pending or in_progress status pipeline paths
  const handleStatusChange = async (newStatus) => {
    if (!task) return;
    try {
      setUpdating(true);
      const logMessage = statusMessage.trim() || `Status updated via Authority panel to ${newStatus}`;
      await updateComplaintStatus(task.id, newStatus, logMessage);
      setTask((prev) => ({ ...prev, status: newStatus }));
      setStatusMessage("");
    } catch (err) {
      console.error("Failed to patch status pipeline:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Image Upload handler for verification file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResolvedImage(file);
      setResolvedImagePreview(URL.createObjectURL(file));
    }
  };

  // HTML5 Geolocation fetch capture trigger
  const captureCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser software.");
      return;
    }
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setFetchingLocation(false);
      },
      (error) => {
        console.error("Error securing user coordinate position parameters:", error);
        alert("Failed to track location coordinates securely. Please check app permissions.");
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Final submit handler combining verification files and location tags
  const handleFinalResolutionSubmit = async (e) => {
    e.preventDefault();
    if (!resolvedImage || !locationCoords) return;
    
    try {
  setUpdating(true);

  const finalRemarks = `${statusMessage.trim()} | Verified Resolution Coordinates: Lat ${locationCoords.latitude}, Long ${locationCoords.longitude}`;

  console.log("Submitting resolution update...");

  const res = await updateComplaintStatus(
    task.id,
    "resolved",
    finalRemarks,
    resolvedImage
  );

  console.log("Update response:", res);

  setTask((prev) => ({
    ...prev,
    status: "resolved",
  }));

  setShowVerification(false);
  setStatusMessage("");

  navigate("/authority/tasks");

} catch (err) {
  console.error("Resolution update failed:", err);

  alert(
    err?.response?.data?.message ||
    err.message ||
    "Failed to update complaint."
  );

} finally {
  setUpdating(false);
}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm font-bold text-blue-600 animate-pulse">Contacting backend service workspace API...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-100">
          <PriorityHigh fontSize="large" />
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">Backend Connection Interrupted</h3>
        <p className="text-red-600 font-mono text-sm mb-6 bg-red-50/60 border border-red-100 px-4 py-2 rounded-xl max-w-md mx-auto">
          Error: {errorMessage}
        </p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition">
          Retry Connection Setup
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 pb-32 relative">
      
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 px-6 h-20 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate("/authority/tasks")} className="flex items-center gap-2 px-4 h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm transition">
          <ArrowBack fontSize="small" /> Back to Workspace
        </button>
        <div>
          <span className="text-xs bg-cyan-100 text-cyan-800 font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
            ID: #SMD-{task.id}
          </span>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="pt-28 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
          
          {/* Left Column: Complaint Details Block layout */}
          <div className="lg:col-span-2 space-y-8">
            <div className="overflow-hidden rounded-[36px] border border-blue-100 bg-white shadow-xl">
              <img
                src={task.image || "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=800"}
                alt={task.title}
                className="w-full h-[400px] object-cover"
              />
              <div className="p-8">
                <span className="text-xs font-black uppercase text-blue-600 tracking-widest block mb-2">{task.department} Department</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 text-gray-900">{task.title}</h2>
                <hr className="border-blue-50 mb-6" />
                
                <div className="flex flex-wrap gap-4 text-gray-600 mb-8">
                  <div className="flex items-center gap-2 bg-blue-50/60 px-4 py-2 rounded-xl border border-blue-100/50">
                    <LocationOn className="text-blue-600" fontSize="small" />
                    <span className="font-semibold text-sm">{task.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50/60 px-4 py-2 rounded-xl border border-blue-100/50">
                    <CalendarToday className="text-blue-600" fontSize="small" />
                    <span className="font-semibold text-sm">{task.reported}</span>
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50/50 rounded-3xl p-6 border border-gray-100 shadow-inner">
                  <div className="flex items-center gap-2 text-gray-800 font-bold mb-1">
                    <Description className="text-blue-600" fontSize="small" />
                    <h4 className="text-sm uppercase tracking-wider">Public Grievance Statement</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line">{task.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Status & Processing Controls Console Panels */}
          <div className="space-y-8">
            <div className="rounded-[32px] border border-blue-100 bg-white p-6 shadow-xl">
              <h4 className="font-black text-gray-800 text-lg mb-4">Core Structural Data</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Current Status</label>
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black capitalize text-sm border shadow-sm ${
                    task.status === "resolved" ? "bg-green-50 border-green-200 text-green-700" : task.status === "in_progress" ? "bg-yellow-50 border-yellow-200 text-yellow-700" : "bg-red-50 border-red-200 text-red-700"
                  }`}>
                    {task.status === "resolved" && <CheckCircle size="small" />}
                    {task.status === "in_progress" && <Autorenew size="small" className="animate-spin" />}
                    {task.status === "pending" && <HourglassEmpty size="small" />}
                    {task.status.replace("_", " ")}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Assigned Urgency</label>
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black capitalize text-sm border shadow-sm ${
                    task.priority === "high" || task.priority === "critical" ? "bg-red-500 border-transparent text-white" : task.priority === "medium" ? "bg-amber-500 border-transparent text-white" : "bg-blue-500 border-transparent text-white"
                  }`}>
                    <PriorityHigh fontSize="small" />
                    {task.priority} Priority
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Action Panel Options Box Container */}
            <div className="rounded-[32px] border border-blue-100 bg-white p-6 shadow-xl relative overflow-hidden">
              {updating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              )}
              
              {!showVerification ? (
                <>
                  <h4 className="font-black text-gray-800 text-lg mb-1">Workflow Console</h4>
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 font-bold block mb-1.5">Action Remarks / Logs</label>
                    <textarea
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                      placeholder="Provide workspace progress updates..."
                      className="w-full h-20 p-3 text-sm bg-blue-50/30 border border-blue-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 font-medium text-gray-700"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <button disabled={task.status === "pending"} onClick={() => handleStatusChange("pending")} className="w-full py-3 rounded-xl border border-red-200 bg-red-50/30 text-red-700 text-sm font-bold disabled:opacity-30 transition hover:bg-red-50">Mark as Pending</button>
                    <button disabled={task.status === "in_progress"} onClick={() => handleStatusChange("in_progress")} className="w-full py-3 rounded-xl border border-yellow-200 bg-yellow-50/30 text-yellow-700 text-sm font-bold disabled:opacity-30 transition hover:bg-yellow-50">Begin Processing</button>
                    <button disabled={task.status === "resolved"} onClick={() => setShowVerification(true)} className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-black disabled:opacity-30 shadow-md transition transform active:scale-95">Resolve & Close</button>
                  </div>
                </>
              ) : (
                /* Dynamic Verification Action Overlay UI */
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-green-700 text-base">Resolution Verification</h4>
                    <button onClick={() => setShowVerification(false)} className="text-xs text-gray-400 hover:text-gray-600 font-bold">Cancel</button>
                  </div>
                  <hr className="border-gray-100" />
                  
                  {/* Step 1: Upload Proof File Asset */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1.5">1. Take/Upload Field Image</label>
                    <input type="file" accept="image/*" id="verification-file" className="hidden" onChange={handleImageChange} />
                    <label htmlFor="verification-file" className="w-full border-2 border-dashed border-blue-200 bg-blue-50/20 hover:bg-blue-50 rounded-2xl py-4 px-3 flex flex-col items-center justify-center cursor-pointer transition">
                      {resolvedImagePreview ? (
                        <img src={resolvedImagePreview} alt="Resolution field audit check" className="h-20 w-full object-cover rounded-xl" />
                      ) : (
                        <>
                          <CloudUpload className="text-blue-500 mb-1" />
                          <span className="text-xs font-bold text-blue-600">Select Resolved Patch Photo</span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Step 2: Extract Live Geolocation Values */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1.5">2. Field Location Coordinates</label>
                    <button type="button" onClick={captureCurrentLocation} disabled={fetchingLocation} className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                      locationCoords ? "bg-green-50 border-green-200 text-green-700" : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}>
                      <MyLocation fontSize="small" className={fetchingLocation ? "animate-spin" : ""} />
                      {locationCoords ? "Location Coordinates Secured" : "Capture Current Geolocation"}
                    </button>
                    {locationCoords && (
                      <p className="text-[10px] text-gray-400 font-mono mt-1 text-center">
                        Lat: {locationCoords.latitude.toFixed(5)}, Long: {locationCoords.longitude.toFixed(5)}
                      </p>
                    )}
                  </div>

                  {/* Step 3: Final Submission Action Gate */}
                  <button
                    onClick={handleFinalResolutionSubmit}
                    disabled={!resolvedImage || !locationCoords}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-black shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition transform active:scale-95 mt-2"
                  >
                    Confirm & Complete Closure
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}