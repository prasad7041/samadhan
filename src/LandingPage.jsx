import React from "react";

import {
  Camera,
  Bot,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Bell,
  Globe2,
  Mic,
  Sparkles,
  Users,
  TrendingUp,
  Star,
  Play,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

/* ================= STEP CARD ================= */

const StepCard = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    whileHover={{
      y: -8,
    }}
    transition={{
      duration: 0.2,
    }}
    className="relative"
  >
    <div className="bg-white/80 backdrop-blur-2xl border border-blue-100 shadow-xl rounded-[32px] p-8 h-full hover:shadow-2xl transition-all duration-300">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center mb-8 shadow-xl">
        {icon}
      </div>

      <h4 className="text-2xl font-black text-gray-900 mb-4">
        {title}
      </h4>

      <p className="text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

/* ================= FEATURE CARD ================= */

const FeatureCard = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    whileHover={{
      y: -6,
    }}
    className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[32px] p-8 shadow-xl hover:shadow-2xl transition-all"
  >
    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
      {icon}
    </div>

    <h3 className="text-2xl font-black text-gray-900 mb-4">
      {title}
    </h3>

    <p className="text-gray-500 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

/* ================= MAIN ================= */

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900 overflow-hidden relative">
      {/* BACKGROUND EFFECTS */}

      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}

      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xl">
              <Sparkles size={28} />
            </div>

            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                Samadhan
              </h1>

              <p className="text-sm text-gray-500">
                Smart Civic Platform
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition">
              <Bell size={18} />

              Updates
            </button>

            <button className="h-12 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
              Login / Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="pt-24">
        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="relative z-10"
            >
              {/* TAG */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-blue-100 text-blue-700 font-semibold mb-8">
                <Globe2 size={18} />

                Empowering Citizens with AI
              </div>

              {/* TITLE */}
              <h1 className="text-6xl md:text-7xl font-black leading-tight text-gray-900">
                Your Voice.
                <br />

                <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                  Smarter Cities.
                </span>
              </h1>

              {/* DESCRIPTION */}
              <p className="text-xl text-gray-500 mt-8 leading-relaxed max-w-2xl">
                Samadhan connects citizens
                directly with local authorities
                through AI-powered civic issue
                management and real-time
                resolution tracking.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-5 mt-10">
                <button className="h-14 px-10 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                  Get Started

                  <ArrowRight size={20} />
                </button>

                <button className="h-14 px-10 rounded-2xl border border-blue-200 bg-white/70 backdrop-blur-xl text-blue-700 font-bold hover:bg-blue-50 transition-all flex items-center gap-3">
                  <Play size={18} />

                  Watch Demo
                </button>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-14">
                <HeroStat
                  icon={<Users />}
                  value="24k+"
                  label="Citizens"
                />

                <HeroStat
                  icon={<TrendingUp />}
                  value="91%"
                  label="Success"
                />

                <HeroStat
                  icon={<CheckCircle2 />}
                  value="18k+"
                  label="Resolved"
                />

                <HeroStat
                  icon={<Star />}
                  value="4.9"
                  label="Rating"
                />
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
              }}
              className="relative"
            >
              {/* Glow */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />

              {/* IMAGE */}
              <div className="relative rounded-[40px] overflow-hidden border border-white/20 shadow-2xl bg-white/50 backdrop-blur-2xl">
                <img
                  className="w-full h-[600px] object-cover"
                  alt="Citizens collaborating"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
                />

                {/* FLOATING CARD */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xl">
                      <Sparkles size={28} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-gray-900">
                        AI Civic Assistant
                      </h3>

                      <p className="text-gray-500">
                        Real-time issue analysis &
                        smart resolution tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-blue-100 text-blue-700 font-semibold mb-6">
                <Sparkles size={18} />

                Smart Features
              </div>

              <h2 className="text-5xl font-black text-gray-900">
                Built For Modern Cities
              </h2>

              <p className="text-xl text-gray-500 mt-5 max-w-3xl mx-auto">
                Intelligent tools that simplify
                civic engagement and empower
                communities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Bot size={28} />}
                title="AI Classification"
                description="Automatically identifies issue type, urgency, and department."
              />

              <FeatureCard
                icon={<Camera size={28} />}
                title="Photo Reporting"
                description="Capture issues instantly using images and location tagging."
              />

              <FeatureCard
                icon={<Mic size={28} />}
                title="Voice Reporting"
                description="Accessibility-first voice commands and speech-to-text."
              />

              <FeatureCard
                icon={
                  <ShieldCheck
                    size={28}
                  />
                }
                title="Transparent Tracking"
                description="Track authority progress and issue resolution in real-time."
              />
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* TITLE */}
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-blue-100 text-blue-700 font-semibold mb-6">
                <Sparkles size={18} />

                Smart Workflow
              </div>

              <h2 className="text-5xl font-black text-gray-900">
                How Samadhan Works
              </h2>

              <p className="text-xl text-gray-500 mt-5 max-w-3xl mx-auto">
                Report issues in seconds and
                watch authorities resolve them
                transparently in real-time.
              </p>
            </div>

            {/* CARDS */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
              <StepCard
                icon={<Camera size={32} />}
                title="Capture Issue"
                description="Take a photo of the civic problem and submit details instantly."
              />

              <StepCard
                icon={<Bot size={32} />}
                title="AI Analysis"
                description="AI automatically categorizes and assigns departments."
              />

              <StepCard
                icon={
                  <ShieldCheck size={32} />
                }
                title="Authority Action"
                description="Government authorities review and dispatch teams."
              />

              <StepCard
                icon={
                  <CheckCircle2
                    size={32}
                  />
                }
                title="Issue Resolved"
                description="Track real-time updates until resolution is completed."
              />
            </div>
          </div>
        </section>

        {/* ================= ACCESSIBILITY ================= */}

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-12 md:p-20 text-white shadow-2xl">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full" />

              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                {/* LEFT */}
                <div>
                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 mb-8">
                    <Mic size={18} />

                    Inclusive Design
                  </div>

                  <h2 className="text-5xl font-black leading-tight">
                    Built for Everyone.
                  </h2>

                  <p className="text-blue-100 text-xl mt-8 leading-relaxed">
                    Samadhan includes
                    voice-to-text support,
                    multilingual interfaces, and
                    accessibility-first features to
                    ensure every citizen can
                    participate.
                  </p>

                  {/* FEATURES */}
                  <div className="grid md:grid-cols-2 gap-5 mt-10">
                    {[
                      "Voice Commands",
                      "Screen Reader Support",
                      "High Contrast UI",
                      "Multi-language Support",
                    ].map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
                        >
                          <CheckCircle2
                            size={
                              18
                            }
                          />

                          <span className="font-semibold">
                            {
                              item
                            }
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="relative">
                  <img
                    className="rounded-[36px] shadow-2xl border border-white/10"
                    alt="Accessible mobile interface"
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[40px] p-12 shadow-2xl">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-2xl">
                <Sparkles size={40} />
              </div>

              <h2 className="text-5xl font-black text-gray-900 mt-8">
                Start Improving Your City
              </h2>

              <p className="text-xl text-gray-500 mt-6 max-w-2xl mx-auto">
                Join thousands of citizens
                already helping create cleaner,
                smarter, and safer communities.
              </p>

              <button className="mt-10 h-14 px-10 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3">
                Join Samadhan

                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-blue-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              Samadhan
            </h3>

            <p className="text-gray-500 mt-3">
              © 2026 Smart Civic Platform.
              Transparency & Reliability.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-gray-500 font-semibold">
            <a
              href="#"
              className="hover:text-blue-700 transition"
            >
              Privacy
            </a>

            <a
              href="#"
              className="hover:text-blue-700 transition"
            >
              Terms
            </a>

            <a
              href="#"
              className="hover:text-blue-700 transition"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ================= HERO STAT ================= */

function HeroStat({
  icon,
  value,
  label,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-3xl p-6 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
        {icon}
      </div>

      <h3 className="text-4xl font-black text-gray-900">
        {value}
      </h3>

      <p className="text-gray-500 mt-2">
        {label}
      </p>
    </div>
  );
}

export default LandingPage;