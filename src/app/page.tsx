"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const images = [
  "/image/basquiat.jpg",
  "/image/Pollock.jpg",
  "/image/Quaytman.jpg",
  "/image/Schnabel.jpg",
];

export default function PrelaunchPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    userType: "artist",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Add user to Firestore collection
      await addDoc(collection(db, "prelaunch_signups"), {
        ...form,
        timestamp: serverTimestamp(),
      });

      // 2. Send confirmation email via your custom API
      await fetch("/api/signup-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          firstName: form.firstName,
        }),
      });

      // 3. Show confirmation message
      setSubmitted(true);
    } catch (err) {
      console.error("Firestore write or email failed:", err);
    }
  };



  return (
    <div className="relative min-h-screen text-gray-900">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-3">
          <h1
            onClick={() => router.push("/")}
            className="cursor-pointer text-3xl font-bold tracking-wider"
          >
            Wallerist
          </h1>
        </div>
      </header>

      {/* Background Hero */}
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16 sm:pt-20">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Artwork ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
              i === idx ? "opacity-100 sm:scale-105" : "opacity-0 sm:scale-100"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />

        {/* Sign-Up Card */}
        <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white/90 px-4 sm:px-10 py-10 shadow-xl backdrop-blur-md">
          <h2 className="mb-1 text-center text-2xl sm:text-3xl font-extrabold tracking-widest">
            We’re Launching Soon!
          </h2>
          <p className="mb-6 text-center text-gray-700">
            Join the wait-list and be the first to get access.
          </p>

          {submitted ? (
            <p className="text-center text-lg font-semibold text-green-600">
              Thank you! We’ll keep you posted.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-3 text-sm sm:text-base"
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-3 text-sm sm:text-base"
                />
              </div>

              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3 text-sm sm:text-base"
              />

              <input
                name="country"
                placeholder="Country"
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3 text-sm sm:text-base"
              />

              <select
                name="userType"
                onChange={handleChange}
                value={form.userType}
                className="w-full rounded-lg border px-4 py-3 text-sm sm:text-base"
              >
                <option value="artist">Artist</option>
                <option value="wallerist">Wallerist</option>
              </select>

              <button
                type="submit"
                className="w-full rounded-full bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-6 text-center text-sm text-white">
        © {new Date().getFullYear()} Wallerist. All rights reserved.
      </footer>
    </div>
  );
}
