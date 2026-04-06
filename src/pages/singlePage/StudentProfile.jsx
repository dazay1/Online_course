import { useState, useCallback, useEffect } from "react";
import AdminLayout from "../layout";
import { useSelector } from "react-redux";
import {
  FaUser,
  FaCamera,
  FaSave,
  FaFingerprint,
  FaPhoneAlt,
  FaStar,
  FaRocket,
  FaBirthdayCake,
} from "react-icons/fa";

export default function StudentProfile() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [stars, setStars] = useState([]);
  const [form, setForm] = useState({
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    birthday: userInfo?.birthday || "", // New Column
    phone: userInfo?.phone || "",
    fatherPhone: userInfo?.fatherPHone || "",
    motherPhone: userInfo?.motherPhone || "",
    image: userInfo?.image || null,
  });

  const [preview, setPreview] = useState(userInfo?.image || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchStars = useCallback(async () => {
    try {
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/stars",
      );
      const data = await response.json();
      setStars(data);
    } catch (err) {
      console.error("Failed to fetch stars", err);
    }
  }, []);

  useEffect(() => {
    fetchStars();
  }, [fetchStars]);

  const studentStars = stars.filter((s) => s.student_id === userInfo?.id);
  const totalStars = studentStars.reduce(
    (sum, s) => sum + s.bonus + s.not_late + s.actives + s.homework,
    0,
  );


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm({ ...form, image: file });
    }
  };

  const submit = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await fetch("/api/student/profile/update", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const levels = [
    {
      level: 1,
      min: 0,
      max: 999,
      title: "Beginner",
      color: "from-blue-400 to-indigo-500",
    },
    {
      level: 2,
      min: 1000,
      max: 2999,
      title: "Explorer",
      color: "from-emerald-400 to-teal-500",
    },
    {
      level: 3,
      min: 3000,
      max: 7999,
      title: "Adventurer",
      color: "from-orange-400 to-red-500",
    },
    {
      level: 4,
      min: 8000,
      max: 14999,
      title: "Champion",
      color: "from-purple-500 to-fuchsia-600",
    },
  ];

  const getLevelData = (stars) => {
    const level =
      levels.find((lvl) => stars >= lvl.min && stars <= lvl.max) || levels[0];
    const progress = ((stars - level.min) / (level.max - level.min)) * 100;
    return { ...level, progress };
  };

  const levelData = getLevelData(totalStars);

  return (
    <AdminLayout hidden={true}>
      <div className="flex gap-8 flex-wrap items-start p-4 bg-gray-50 min-h-screen">
        {/* MAIN PROFILE CARD */}
        <div className="flex-1 min-w-[350px] bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden border-4 border-white">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-8 text-white relative">
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <FaRocket className="text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight">
                  Student Profile
                </h2>
                <p className="text-indigo-100 font-medium opacity-90 text-sm italic">
                  Unlock your potential!
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* AVATAR COLUMN */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-[2.5rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-transform duration-300">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser size={60} className="text-indigo-200" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-fuchsia-500 text-white p-3 rounded-2xl shadow-lg cursor-pointer border-4 border-white active:scale-90 transition-all">
                    <FaCamera size={18} />
                    <input
                      type="file"
                      onChange={handleImage}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-200 px-5 py-2 rounded-2xl shadow-sm">
                  <FaStar className="text-amber-500 animate-pulse" />
                  <span className="font-black text-amber-700 text-sm uppercase">
                    Level {levelData.level}
                  </span>
                </div>
              </div>

              {/* FORM AREA - GRID LAYOUT */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* First Name */}
                  <InputBox
                    label="First Name"
                    icon={<FaFingerprint />}
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    color="indigo"
                  />

                  {/* Last Name */}
                  <InputBox
                    label="Last Name"
                    icon={<FaUser />}
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    color="purple"
                  />

                  {/* Birthday - NEW COLUMN */}
                  <InputBox
                    label="Birthday"
                    icon={<FaBirthdayCake />}
                    name="birthday"
                    value={form.birthday}
                    onChange={handleChange}
                    color="pink"
                    type="date"
                  />

                  {/* Phone */}
                  <InputBox
                    label="Phone Number"
                    icon={<FaPhoneAlt />}
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    color="emerald"
                  />

                  {/* Father Phone */}
                  <InputBox
                    label="Father's Phone"
                    icon={<FaPhoneAlt />}
                    name="fatherPhone"
                    value={form.fatherPhone}
                    onChange={handleChange}
                    color="blue"
                  />

                  {/* Mother Phone */}
                  <InputBox
                    label="Mother's Phone"
                    icon={<FaPhoneAlt />}
                    name="motherPhone"
                    value={form.motherPhone}
                    onChange={handleChange}
                    color="rose"
                  />
                </div>

                {/* SAVE BUTTON */}
                <button
                  onClick={submit}
                  disabled={loading}
                  className="mt-8 relative w-full group active:scale-95 transition-transform"
                >
                  <div className="absolute inset-0 bg-indigo-800 rounded-2xl translate-y-1.5"></div>
                  <div
                    className={`relative ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-500"} text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border-t border-indigo-400`}
                  >
                    <FaSave className={loading ? "animate-spin" : ""} />
                    <span className="uppercase tracking-wider text-lg">
                      {loading ? "Syncing..." : "Save Profile"}
                    </span>
                  </div>
                </button>

                {saved && (
                  <div className="mt-4 text-center bg-green-50 text-green-600 p-3 rounded-xl border border-green-200 animate-bounce">
                    ✨ Profile Updated Successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STATS CARD (Remains same for consistency) */}
        <div className="w-full md:w-[300px] bg-white rounded-[2.5rem] p-8 shadow-xl shadow-indigo-50 border-4 border-indigo-50 text-center flex flex-col items-center shrink-0">
          <h3 className="text-xl font-black text-indigo-900 mb-6 flex items-center gap-2">
            🏆 My Progress
          </h3>
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full flex items-center justify-center border-[8px] border-indigo-50 shadow-inner">
              <div className="text-center">
                <p className="text-4xl font-black text-indigo-600 leading-none">
                  {totalStars}
                </p>
                <p className="text-[10px] uppercase font-black text-indigo-300 tracking-widest mt-1">
                  Stars
                </p>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg">
              <FaStar className="text-white text-xl" />
            </div>
          </div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-[10px] font-black text-indigo-300 uppercase px-1">
              <span>{levelData.title}</span>
              <span>{Math.floor(levelData.progress)}%</span>
            </div>
            <div className="w-full bg-indigo-50 rounded-full h-5 p-1 border border-indigo-100 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{
                  width: `${levelData.progress}%`,
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
                // className={levelData.color}
              ></div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-indigo-50/50 rounded-3xl w-full border border-dashed border-indigo-200">
            <p className="text-xs font-bold text-indigo-400 mb-1">
              CURRENT RANK
            </p>
            <p className="text-lg font-black text-indigo-700 italic">
              ⭐ Level {levelData.level}
            </p>
            <p className="text-[10px] text-indigo-400 font-medium">
              {levelData.title} Tier
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Helper component to keep the code clean
function InputBox({
  label,
  icon,
  name,
  value,
  onChange,
  color,
  type = "text",
}) {
  const colors = {
    indigo:
      "text-indigo-300 group-focus-within:text-indigo-500 bg-indigo-50/50 border-indigo-400 ring-indigo-100 text-indigo-900",
    purple:
      "text-purple-300 group-focus-within:text-purple-500 bg-purple-50/50 border-purple-400 ring-purple-100 text-purple-900",
    pink: "text-pink-300 group-focus-within:text-pink-500 bg-pink-50/50 border-pink-400 ring-pink-100 text-pink-900",
    emerald:
      "text-emerald-300 group-focus-within:text-emerald-500 bg-emerald-50/50 border-emerald-400 ring-emerald-100 text-emerald-900",
    blue: "text-blue-300 group-focus-within:text-blue-500 bg-blue-50/50 border-blue-400 ring-blue-100 text-blue-900",
    rose: "text-rose-300 group-focus-within:text-rose-500 bg-rose-50/50 border-rose-400 ring-rose-100 text-rose-900",
  };

  const c = colors[color].split(" ");

  return (
    <div className="group">
      <label
        className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 block ${c[0].replace("300", "500")}`}
      >
        {label}
      </label>
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-4 flex items-center transition-colors ${c[0]} ${c[1]}`}
        >
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-transparent outline-none transition-all font-bold text-sm focus:bg-white focus:ring-4 ${c[2]} focus:${c[3]} ${c[4]} ${c[5]}`}
        />
      </div>
    </div>
  );
}
