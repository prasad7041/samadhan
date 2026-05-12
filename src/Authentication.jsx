import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {
  citizenSendOtp,
  citizenVerifyOtp,
  citizenSignup,
  citizenVerifySignup,
  authoritySignup,
  authorityLogin,
  adminLogin,
} from "./api/authService";
import {
  ShieldCheck,
  Building2,
  User,
  Lock,
  Phone,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Authentication() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ─── Tab & Mode State ────────────────────────────────────
  const [activeTab, setActiveTab] = useState("citizen");
  const [isSignup, setIsSignup] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  // ─── Loading, Error, Success ─────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ─── Citizen State ───────────────────────────────────────
  const [citizenForm, setCitizenForm] = useState({
    full_name: "",
    mobile: "",
    area: "",
    pincode: "",
    preferred_language: "English",
  });
  const [citizenProfilePic, setCitizenProfilePic] = useState(null);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  // ─── Authority State ─────────────────────────────────────
  const [authorityForm, setAuthorityForm] = useState({
    email: "",
    password: "",
    job_role: "",
    sector: "",
    area: "",
    pincode: "",
    mobile: "",
  });
  const [authorityProfilePic, setAuthorityProfilePic] = useState(null);

  // ─── Admin State ─────────────────────────────────────────
  const [adminForm, setAdminForm] = useState({
    admin_id: "",
    password: "",
  });

  // ─── Helpers ─────────────────────────────────────────────
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const getOtpString = () => otpDigits.join("");

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  CITIZEN HANDLERS
  // ═══════════════════════════════════════════════════════════

  const handleCitizenSendOtp = async () => {
    clearMessages();
    if (!citizenForm.mobile || citizenForm.mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        // Signup step 1: validate & send OTP
        if (!citizenForm.full_name.trim()) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }
        await citizenSignup(citizenForm);
        setSuccess("OTP sent for verification. Check backend console for OTP.");
      } else {
        // Login: send OTP
        await citizenSendOtp(citizenForm.mobile);
        setSuccess("OTP sent successfully. Check backend console for OTP.");
      }
      setShowOtp(true);
      setOtpDigits(["", "", "", "", "", ""]);
    } catch (err) {
      const errData = err.response?.data;
      setError(errData?.errors?.join(", ") || errData?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCitizenVerifyOtp = async () => {
    clearMessages();
    const otp = getOtpString();
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        // Signup step 2: verify OTP + create account
        const formData = new FormData();
        formData.append("mobile", citizenForm.mobile);
        formData.append("otp", otp);
        formData.append("full_name", citizenForm.full_name);
        formData.append("area", citizenForm.area);
        formData.append("pincode", citizenForm.pincode);
        formData.append("preferred_language", citizenForm.preferred_language);
        if (citizenProfilePic) {
          formData.append("profile_picture", citizenProfilePic);
        }

        const res = await citizenVerifySignup(formData);
        login(res.data.token, res.data.user, "citizen");
        setSuccess("Account created successfully!");
        setTimeout(() => navigate("/citizenDashboard"), 500);
      } else {
        // Login: verify OTP
        const res = await citizenVerifyOtp(citizenForm.mobile, otp);
        login(res.data.token, res.data.user, "citizen");
        setSuccess("Login successful!");
        setTimeout(() => navigate("/citizenDashboard"), 500);
      }
    } catch (err) {
      const errData = err.response?.data;
      setError(errData?.errors?.join(", ") || errData?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  AUTHORITY HANDLERS
  // ═══════════════════════════════════════════════════════════

  const handleAuthoritySubmit = async () => {
    clearMessages();

    if (!authorityForm.email || !authorityForm.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        // Signup with multipart (profile picture)
        const formData = new FormData();
        Object.entries(authorityForm).forEach(([key, val]) => {
          formData.append(key, val);
        });
        if (authorityProfilePic) {
          formData.append("profile_picture", authorityProfilePic);
        }

        const res = await authoritySignup(formData);
        login(res.data.token, res.data.user, "authority");
        setSuccess("Authority account created!");
        setTimeout(() => navigate("/authority/dashboard"), 500);
      } else {
        // Login
        const res = await authorityLogin(authorityForm.email, authorityForm.password);
        login(res.data.token, res.data.user, "authority");
        setSuccess("Login successful!");
        setTimeout(() => navigate("/authority/dashboard"), 500);
      }
    } catch (err) {
      const errData = err.response?.data;
      setError(errData?.errors?.join(", ") || errData?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  ADMIN HANDLERS
  // ═══════════════════════════════════════════════════════════

  const handleAdminSubmit = async () => {
    clearMessages();

    if (!adminForm.admin_id || !adminForm.password) {
      setError("Admin ID and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin(adminForm.admin_id, adminForm.password);
      login(res.data.token, res.data.user, "admin");
      setSuccess("Admin login successful!");
      setTimeout(() => navigate("/admin"), 500);
    } catch (err) {
      const errData = err.response?.data;
      setError(errData?.errors?.join(", ") || errData?.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  OTP BOX
  // ═══════════════════════════════════════════════════════════

  const renderOtpBox = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-600">Enter OTP</label>
        <div className="flex gap-3 mt-3 justify-center">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (otpRefs.current[idx] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              className="w-12 h-12 text-center text-lg font-bold rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleCitizenVerifyOtp}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        Verify OTP
      </button>

      <p className="text-center text-sm text-gray-500">
        Didn't receive code?
        <button
          onClick={handleCitizenSendOtp}
          disabled={loading}
          className="ml-2 text-blue-600 font-semibold hover:underline"
        >
          Resend OTP
        </button>
      </p>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  //  CITIZEN FORM
  // ═══════════════════════════════════════════════════════════

  const renderCitizenForm = () => (
    <div className="space-y-5">
      {isSignup && (
        <>
          <div>
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full mt-2 px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              name="full_name"
              value={citizenForm.full_name}
              onChange={(e) => setCitizenForm({ ...citizenForm, full_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Area"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              name="area"
              value={citizenForm.area}
              onChange={(e) => setCitizenForm({ ...citizenForm, area: e.target.value })}
            />
            <input
              type="text"
              placeholder="Pincode"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              name="pincode"
              value={citizenForm.pincode}
              onChange={(e) => setCitizenForm({ ...citizenForm, pincode: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Preferred Language</label>
            <select
              className="w-full mt-2 px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              value={citizenForm.preferred_language}
              onChange={(e) => setCitizenForm({ ...citizenForm, preferred_language: e.target.value })}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Tamil</option>
              <option>Marathi</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCitizenProfilePic(e.target.files[0] || null)}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-blue-100 bg-white
              file:mr-4 file:px-4 file:py-2 file:border-0
              file:rounded-lg file:bg-blue-100
              file:text-blue-700 file:font-medium
              hover:file:bg-blue-200"
            />
          </div>
        </>
      )}

      <div>
        <label className="text-sm font-medium text-gray-600">Mobile Number</label>
        <div className="relative mt-2">
          <Phone size={18} className="absolute left-4 top-4 text-blue-500" />
          <input
            type="tel"
            placeholder="+91 9876543210"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
            name="mobile"
            value={citizenForm.mobile}
            onChange={(e) => setCitizenForm({ ...citizenForm, mobile: e.target.value })}
          />
        </div>
      </div>

      {!showOtp ? (
        <button
          onClick={handleCitizenSendOtp}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {isSignup ? "Send OTP & Create Account" : "Send OTP"}
        </button>
      ) : (
        renderOtpBox()
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  //  AUTHORITY FORM
  // ═══════════════════════════════════════════════════════════

  const renderAuthorityForm = () => (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-600">Work Email</label>
        <div className="relative mt-2">
          <Mail size={18} className="absolute left-4 top-4 text-blue-500" />
          <input
            type="email"
            placeholder="official@gov.in"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
            value={authorityForm.email}
            onChange={(e) => setAuthorityForm({ ...authorityForm, email: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">Password</label>
        <div className="relative mt-2">
          <Lock size={18} className="absolute left-4 top-4 text-blue-500" />
          <input
            type="password"
            placeholder="••••••••"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
            value={authorityForm.password}
            onChange={(e) => setAuthorityForm({ ...authorityForm, password: e.target.value })}
          />
        </div>
      </div>

      {isSignup && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Job Role"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              value={authorityForm.job_role}
              onChange={(e) => setAuthorityForm({ ...authorityForm, job_role: e.target.value })}
            />
            <input
              type="text"
              placeholder="Sector"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              value={authorityForm.sector}
              onChange={(e) => setAuthorityForm({ ...authorityForm, sector: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Area"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              value={authorityForm.area}
              onChange={(e) => setAuthorityForm({ ...authorityForm, area: e.target.value })}
            />
            <input
              type="text"
              placeholder="Pincode"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              value={authorityForm.pincode}
              onChange={(e) => setAuthorityForm({ ...authorityForm, pincode: e.target.value })}
            />
          </div>

          <div className="relative">
            <Phone size={18} className="absolute left-4 top-4 text-blue-500" />
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              value={authorityForm.mobile}
              onChange={(e) => setAuthorityForm({ ...authorityForm, mobile: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAuthorityProfilePic(e.target.files[0] || null)}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-blue-100 bg-white
              file:mr-4 file:px-4 file:py-2 file:border-0
              file:rounded-lg file:bg-blue-100
              file:text-blue-700 file:font-medium
              hover:file:bg-blue-200"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleAuthoritySubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {isSignup ? "Complete Registration" : "Authority Login"}
      </button>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  //  ADMIN FORM
  // ═══════════════════════════════════════════════════════════

  const renderAdminForm = () => (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-600">Admin ID</label>
        <div className="relative mt-2">
          <User size={18} className="absolute left-4 top-4 text-blue-500" />
          <input
            type="text"
            placeholder="admin_master"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
            value={adminForm.admin_id}
            onChange={(e) => setAdminForm({ ...adminForm, admin_id: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">Password</label>
        <div className="relative mt-2">
          <Lock size={18} className="absolute left-4 top-4 text-blue-500" />
          <input
            type="password"
            placeholder="••••••••"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
            value={adminForm.password}
            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
          />
        </div>
      </div>

      <button
        onClick={handleAdminSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        Secure Admin Login
      </button>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Building2 size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-black">Samadhan</h1>
                  <p className="text-blue-100">Civic Engagement Portal</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-6">Welcome Back</h2>
              <p className="mt-2 text-blue-100">Secure authentication for civic stakeholders</p>
            </div>

            <div className="p-6">
              {/* ─── Error Message ─── */}
              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {/* ─── Success Message ─── */}
              {success && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 text-sm">
                  <CheckCircle2 size={18} />
                  {success}
                </div>
              )}

              {/* ─── Tab Switcher ─── */}
              <div className="bg-blue-50 rounded-2xl p-1 flex gap-2">
                {["citizen", "authority", "admin"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsSignup(false);
                      setShowOtp(false);
                      clearMessages();
                      setOtpDigits(["", "", "", "", "", ""]);
                    }}
                    className={`flex-1 py-3 rounded-xl font-semibold transition ${
                      activeTab === tab
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-white"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* ─── Forms ─── */}
              <div className="mt-8">
                {activeTab === "citizen" && renderCitizenForm()}
                {activeTab === "authority" && renderAuthorityForm()}
                {activeTab === "admin" && renderAdminForm()}
              </div>

              {/* ─── Toggle Login/Signup ─── */}
              {activeTab !== "admin" && (
                <p className="text-center mt-6 text-gray-500">
                  {isSignup ? "Already have an account?" : "New here?"}
                  <button
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setShowOtp(false);
                      clearMessages();
                    }}
                    className="ml-2 text-blue-600 font-semibold hover:underline"
                  >
                    {isSignup ? "Login" : "Create Account"}
                  </button>
                </p>
              )}

              {/* ─── Footer ─── */}
              <div className="mt-8 pt-6 border-t flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-gray-500">Systems Operational</span>
                </div>
                <span className="text-sm text-blue-600 font-semibold">v2.4.0</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}