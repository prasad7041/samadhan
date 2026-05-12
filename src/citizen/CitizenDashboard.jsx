import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Menu,
  Search,
  Bell,
  ThumbsUp,
  MessageCircle,
  Plus,
  TrendingUp,
  Send,
  Repeat2,
} from "lucide-react";

import CitizenNavbar from "./CitizenNavbar";

/* ================= MAIN ================= */

const CitizenDashboard = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Sarah Jenkins",
      time: "2 hours ago",
      location: "Green Valley Park",
      priority: "High Priority",
      likes: 124,
      commentsCount: 2,
      showComments: false,
      newComment: "",
      content:
        "The main drainage pipe near the public playground has burst. Water accumulation is making the area slippery and unsafe for children.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      avatar:
        "https://randomuser.me/api/portraits/women/44.jpg",
      comments: [
        {
          user: "Rahul",
          text: "This needs immediate fixing.",
        },

        {
          user: "Anita",
          text: "Children are getting affected badly.",
        },
      ],
    },

    {
      id: 2,
      user: "David Rodriguez",
      time: "5 hours ago",
      location: "Central Avenue",
      priority: "In Progress",
      likes: 89,
      commentsCount: 2,
      showComments: false,
      newComment: "",
      content:
        "Three streetlights are flickering or completely dark on Central Avenue between 4th and 5th street.",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
      avatar:
        "https://randomuser.me/api/portraits/men/32.jpg",
      comments: [
        {
          user: "Kiran",
          text: "Very unsafe during nights.",
        },

        {
          user: "Vamsi",
          text: "Hope authorities resolve quickly.",
        },
      ],
    },
  ]);

  /* ================= LIKE ================= */

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              likes: post.likes + 1,
            }
          : post
      )
    );
  };

  /* ================= COMMENTS ================= */

  const toggleComments = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              showComments: !post.showComments,
            }
          : post
      )
    );
  };

  /* ================= COMMENT INPUT ================= */

  const handleCommentInput = (
    id,
    value
  ) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              newComment: value,
            }
          : post
      )
    );
  };

  /* ================= ADD COMMENT ================= */

  const addComment = (id) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (
          post.id === id &&
          post.newComment.trim() !== ""
        ) {
          return {
            ...post,

            comments: [
              ...post.comments,

              {
                user: "You",
                text: post.newComment,
              },
            ],

            commentsCount:
              post.commentsCount + 1,

            newComment: "",
          };
        }

        return post;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-800 overflow-hidden relative">
      {/* ================= BACKGROUND EFFECTS ================= */}

      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}

      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-2xl hover:bg-blue-50 transition">
              <Menu
                size={22}
                className="text-blue-700"
              />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xl">
                <TrendingUp size={26} />
              </div>

              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                  Samadhan
                </h1>

                <p className="text-xs text-gray-500">
                  Smart Citizen Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl border border-blue-100 px-4 h-12 rounded-2xl shadow-lg">
              <Search
                size={18}
                className="text-blue-500"
              />

              <input
                type="text"
                placeholder="Search civic issues..."
                className="bg-transparent outline-none ml-3 w-56"
              />
            </div>

            {/* Notification */}
            <button className="relative p-3 rounded-2xl bg-white shadow-lg border border-blue-100 hover:bg-blue-50 transition">
              <Bell
                size={20}
                className="text-blue-700"
              />

              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile */}
            <button
              onClick={() =>
                navigate(
                  "/citizen/profile"
                )
              }
              className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-600 shadow-lg"
            >
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="pt-28 pb-32 max-w-7xl mx-auto px-4 md:px-8 flex gap-8">
        {/* ================= COMMON NAVBAR ================= */}

        <CitizenNavbar />

        {/* ================= FEED ================= */}

        <div className="flex-1 space-y-8">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <h2 className="text-5xl font-black leading-tight">
                Report Civic Problems
                <br />
                Faster & Smarter
              </h2>

              <p className="text-blue-100 text-lg mt-5 max-w-2xl leading-relaxed">
                Connect directly with your
                municipality, raise issues,
                monitor progress, and help build
                a cleaner smarter city.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
                <HeroCard
                  title="Active Issues"
                  value="1,284"
                />

                <HeroCard
                  title="Resolved"
                  value="842"
                />

                <HeroCard
                  title="Citizens"
                  value="24k+"
                />

                <HeroCard
                  title="Satisfaction"
                  value="91%"
                />
              </div>
            </div>
          </section>

          {/* POSTS */}
          {posts.map((item) => (
            <article
              key={item.id}
              className="bg-white/80 backdrop-blur-2xl rounded-[36px] border border-blue-100 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* TOP */}
              <div className="p-6 flex gap-4">
                <img
                  src={item.avatar}
                  alt={item.user}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-100"
                />

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg">
                        {item.user}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.time} •{" "}
                        <span className="text-blue-600 font-semibold">
                          {item.location}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${
                        item.priority ===
                        "High Priority"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>

              {/* IMAGE */}
              <div className="px-6 pb-5">
                <img
                  src={item.image}
                  alt="Issue"
                  className="w-full h-80 object-cover rounded-3xl border border-blue-100"
                />
              </div>

              {/* ACTIONS */}
              <div className="px-6 py-5 bg-blue-50/50 border-t border-blue-100 flex justify-between items-center">
                <div className="flex gap-8">
                  {/* LIKE */}
                  <button
                    onClick={() =>
                      handleLike(item.id)
                    }
                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition"
                  >
                    <ThumbsUp size={20} />

                    <span className="text-sm font-semibold">
                      {item.likes}
                    </span>
                  </button>

                  {/* COMMENTS */}
                  <button
                    onClick={() =>
                      toggleComments(item.id)
                    }
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition"
                  >
                    <MessageCircle
                      size={20}
                    />

                    <span className="text-sm font-semibold">
                      {item.commentsCount}
                    </span>
                  </button>
                </div>

                {/* RE-MENSION */}
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
                  <Repeat2 size={18} />

                  <span className="text-sm font-semibold">
                    Re-Mension
                  </span>
                </button>
              </div>

              {/* COMMENTS */}
              {item.showComments && (
                <div className="px-6 pb-6 space-y-4">
                  {item.comments.map(
                    (comment, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-50 border border-blue-100 rounded-2xl p-4"
                      >
                        <p className="font-semibold text-blue-700">
                          {comment.user}
                        </p>

                        <p className="text-gray-600 mt-1">
                          {comment.text}
                        </p>
                      </div>
                    )
                  )}

                  {/* ADD COMMENT */}
                  <div className="flex items-center gap-3 mt-3">
                    <input
                      type="text"
                      value={item.newComment}
                      onChange={(e) =>
                        handleCommentInput(
                          item.id,
                          e.target.value
                        )
                      }
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-3 rounded-2xl border border-blue-100 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      onClick={() =>
                        addComment(item.id)
                      }
                      className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center hover:scale-105 transition"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </main>

      {/* ================= FLOATING BUTTON ================= */}

      <button
        onClick={() =>
          navigate("/citizen/raise")
        }
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-16 h-16 rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition z-50"
      >
        <Plus size={30} />
      </button>
    </div>
  );
};

/* ================= HERO CARD ================= */

function HeroCard({
  title,
  value,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <p className="text-blue-100 text-sm uppercase tracking-widest">
        {title}
      </p>

      <h3 className="text-5xl font-black mt-3">
        {value}
      </h3>
    </div>
  );
}

export default CitizenDashboard;