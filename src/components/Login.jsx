"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "./Redux/userSlice";
import { toast } from "react-toastify";
import { RxEnter } from "react-icons/rx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const body = { email, password };
    toast.info("Logging in, please wait...");

    try {
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const group = await fetch(
        "https://sql-server-nb7m.onrender.com/api/group",
      );
      const data = await response.json();
      const groupData = await group.json();
      if (!response.ok) {
        toast.error(data.message || "Login failed, please try again");
        return;
      }

      // Check if data has required properties
      if (!data.id && !data.email) {
        toast.error("Invalid response from server");
        return;
      }
      const userData = groupData.filter((item) => item.id === Number(data.id));
      toast.success("✅ Login Success");
      if (data?.role === "admin") {
        dispatch(setUserInfo(data));
      } else {
        dispatch(setUserInfo(userData[0]));
      }

      if (data.role === "student" || data.role === "teacher") {
        toast.info("🎓 Redirecting to your profile...");
        navigate("/profile", { state: { id: email } });
      } else if (data.role === "admin") {
        toast.info("👨‍💼 Redirecting to admin dashboard...");
        navigate("/admin", { state: { id: email } });
      } else {
        toast.error("Invalid role or user does not exist");
      }
    } catch (error) {
      console.error("🚨 Fetch Error:", error);
      toast.error(error.message || "Server error, please try again");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen backgroundSky">
      <div className="bg-gradient-to-b from-blue-300 to-[#fffc] rounded-lg shadow-lg p-8 max-w-sm w-full border border-gray-300">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
            <RxEnter className="text-2xl text-black" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">
          Login with Email
        </h2>
        <p className="text-center text-gray-600 mb-6">
          O'quv markazimizga xush kelibsiz, registratsiyadan o'ting va bilim
          maskaniga yo'l oling
        </p>

        <form onSubmit={onSubmitForm}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                className="border rounded-lg w-full py-2 px-3 pr-10 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>
          {/* <div className="flex justify-between mb-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div> */}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Get Started
          </button>
        </form>

        {/* <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-gray-300" />
          <span className="mx-2 text-gray-600">or</span>
          <hr className="w-full border-gray-300" />
        </div> */}

        {/* <div className="flex justify-around mt-6">
          <button className="bg-white text-black border rounded-lg py-2 px-4 gap-2 flex items-center hover:bg-gray-100">
            <FcGoogle size={20} />
          </button>
          <button className="bg-white text-black border rounded-lg py-2 px-4 gap-2 flex items-center hover:bg-gray-100">
            <FaSquareFacebook color="blue" size={20} />
          </button>
          <button className="bg-white border rounded-lg py-2 px-4 flex items-center hover:bg-gray-100">
            <FaApple color="black" size={20} />
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Login;
