import { useState } from "react";
// import comment from "../assets/comment.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "./Redux/userSlice";
import { toast } from "react-toastify";
import { RxEnter } from "react-icons/rx";
import { FaApple } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
function Login() {
  // const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const history = useNavigate();

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const body = { email, password };
    try {
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();

      dispatch(setUserInfo(data));

      if (data.role === "student") {
        history("/profile", { state: { id: email } });
      } else if (data.role === "admin") {
        history("/admin", { state: { id: email } });
      } else if (data.role === "teacher") {
        history("/profile", { state: { id: email } });
      } else {
        toast.error("User don't exist");
      }
    } catch (error) {
      toast.error("Server error please try again");
    }
  };

  return (
    <div className="flex items-center justify-center backgroundSky">
      <div className="bg-gradient-to-b from-blue-300 to-[#fffc]  rounded-lg shadow-lg p-8 max-w-sm w-full border border-gray-300">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
            <RxEnter className="text-2xl text-black" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">
          Login in with email
        </h2>
        <p className="text-center text-gray-600 mb-6">
          O'quv markazimizga xush kelibsiz, registratsiyadan o'ting va bilim
          maskaniga yo'l oling
        </p>

        <form onSubmit={onSubmitForm}>
          <div className="mb-4">
            <label
              for="email"
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

          <div className="mb-6">
            <label
              for="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between mb-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Get Started
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-gray-300" />
          <span className="mx-2 text-gray-600">or</span>
          <hr className="w-full border-gray-300" />
        </div>

        <div className="flex justify-around mt-6">
          <button className="bg-white text-black border rounded-lg py-2 px-4 gap-2 flex items-center">
            <FcGoogle />
          </button>
          <button className="bg-white text-black border rounded-lg py-2 px-4 gap-2 flex items-center">
            <FaSquareFacebook color="blue" />
          </button>
          <button className="bg-white border rounded-lg py-2 px-4 flex items-center">
            <FaApple color="black" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
