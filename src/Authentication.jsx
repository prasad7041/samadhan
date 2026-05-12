import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Building2,
  User,
  Lock,
  Phone,
  Mail,
  Gavel,
} from "lucide-react";

export default function Authentication() {
  const navigate = useNavigate();
  const [userstate, setuserstate] = useState({
    full_name: "",
    mobile: "",
    area: "",
    pincode: "",
    preferred_language: "English"
  })
  const [activeTab, setActiveTab] = useState("citizen");
  const [isSignup, setIsSignup] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  //=================== setuser================
  const setuser = (e) => {
    setuserstate({ ...userstate, [e.target.name]: e.target.value });
  }
  const subminuser = (e) => {
    // e.preventDefault();

    axios.post("http://localhost:5000/api/auth/citizen/signup", userstate)
      .then(res => {
        console.log(res.data);
        // if(res.data.status){
        //   navigate("/login");
        // }
      })
      .catch(err => { console.log(err) });
  }
  // ================= NAVIGATION =================
  const handleNavigation = () => {
    if (activeTab === "citizen") {
      navigate("/citizenDashboard");
    } else if (activeTab === "authority") {
      navigate("/authorityDashboard");
    } else if (activeTab === "admin") {
      navigate("/adminDashboard");
    }
  };

  // ================= OTP BOX =================
  const renderOtpBox = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-600">
          Enter OTP
        </label>

        <div className="flex gap-3 mt-3 justify-center">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <input
              key={num}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-lg font-bold rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNavigation}
        className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-lg"
      >
        Verify OTP
      </button>

      <p className="text-center text-sm text-gray-500">
        Didn't receive code?
        <button className="ml-2 text-blue-600 font-semibold hover:underline">
          Resend OTP
        </button>
      </p>
    </div>
  );

  // ================= CITIZEN FORM =================
  const renderCitizenForm = () => (
    <div className="space-y-5">
      {isSignup && (
        <>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full mt-2 px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              name="full_name"
              value={userstate.full_name}
              onChange={setuser}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Area"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              name="area"
              value={userstate.area}
              onChange={setuser}
            />

            <input
              type="text"
              placeholder="Pincode"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
              name="pincode"
              value={userstate.pincode}
              onChange={setuser}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Preferred Language
            </label>

            <select className="w-full mt-2 px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Tamil</option>
              <option>Marathi</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Profile Picture
            </label>

            <input
              type="file"
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
        <label className="text-sm font-medium text-gray-600">
          Mobile Number
        </label>

        <div className="relative mt-2">
          <Phone
            size={18}
            className="absolute left-4 top-4 text-blue-500"
          />

          <input
            type="tel"
            placeholder="+91 9876543210"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
            name="mobile"
            value={userstate.mobile}
            onChange={setuser}
          />
        </div>
      </div>

      {!showOtp ? (
        <button
          onClick={(e) => { setShowOtp(true); subminuser(e) }}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          {isSignup ? "Send OTP & Create Account" : "Send OTP"}
        </button>
      ) : (
        renderOtpBox()
      )}
    </div>
  );

  // ================= AUTHORITY FORM =================
  const renderAuthorityForm = () => (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-600">
          Work Email
        </label>

        <div className="relative mt-2">
          <Mail
            size={18}
            className="absolute left-4 top-4 text-blue-500"
          />

          <input
            type="email"
            placeholder="official@gov.in"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">
          Password
        </label>

        <div className="relative mt-2">
          <Lock
            size={18}
            className="absolute left-4 top-4 text-blue-500"
          />

          <input
            type="password"
            placeholder="••••••••"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
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
            />

            <input
              type="text"
              placeholder="Sector"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Area"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              placeholder="Pincode"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-4 text-blue-500"
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Profile Picture
            </label>

            <input
              type="file"
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
        onClick={handleNavigation}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
      >
        {isSignup ? "Complete Registration" : "Authority Login"}
      </button>
    </div>
  );

  // ================= ADMIN FORM =================
  const renderAdminForm = () => (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-600">
          Admin ID
        </label>

        <div className="relative mt-2">
          <User
            size={18}
            className="absolute left-4 top-4 text-blue-500"
          />

          <input
            type="text"
            placeholder="admin_master"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">
          Password
        </label>

        <div className="relative mt-2">
          <Lock
            size={18}
            className="absolute left-4 top-4 text-blue-500"
          />

          <input
            type="password"
            placeholder="••••••••"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleNavigation}
        className="w-full py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition shadow-lg shadow-blue-200"
      >
        Secure Admin Login
      </button>
    </div>
  );

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
                  <h1 className="text-3xl font-black">
                    Samadhan
                  </h1>

                  <p className="text-blue-100">
                    Civic Engagement Portal
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-6">
                Welcome Back
              </h2>

              <p className="mt-2 text-blue-100">
                Secure authentication for civic stakeholders
              </p>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 rounded-2xl p-1 flex gap-2">
                {["citizen", "authority", "admin"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsSignup(false);
                      setShowOtp(false);
                    }}
                    className={`flex-1 py-3 rounded-xl font-semibold transition ${activeTab === tab
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-white"
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() +
                      tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                {activeTab === "citizen" &&
                  renderCitizenForm()}

                {activeTab === "authority" &&
                  renderAuthorityForm()}

                {activeTab === "admin" &&
                  renderAdminForm()}
              </div>

              {activeTab !== "admin" && (
                <p className="text-center mt-6 text-gray-500">
                  {isSignup
                    ? "Already have an account?"
                    : "New here?"}

                  <button
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setShowOtp(false);
                    }}
                    className="ml-2 text-blue-600 font-semibold hover:underline"
                  >
                    {isSignup ? "Login" : "Create Account"}
                  </button>
                </p>
              )}

              <div className="mt-8 pt-6 border-t flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

                  <span className="text-sm text-gray-500">
                    Systems Operational
                  </span>
                </div>

                <span className="text-sm text-blue-600 font-semibold">
                  v2.4.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}