import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./API";
import { FaHome } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", formData);

      console.log("Login Response:", res.data);

      // ==========================================
      // CHECK LOGIN SUCCESS
      // ==========================================

      if (res.data.message === "Login Successfully") {
        // Save JWT token
        localStorage.setItem("token", res.data.token);

        // Save user information
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login Successfully 🚀");

        // ==========================================
        // ROLE BASED REDIRECT
        // ==========================================

        if (res.data.role === "client") {
          navigate("/clientdashboard");
        } else if (res.data.role === "freelancer") {
          navigate("/freelancerdashboard");
        }
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log("Login Error:", error);

      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <section className="w-full min-h-screen bg-[#10002b] flex items-center justify-center px-4 py-10">
        <button
          onClick={() => navigate("/")}
          className="
                  absolute
                  top-4
                  left-4
                  sm:top-6
                  sm:left-6
                  md:top-8
                  md:left-8
                  w-10
                  h-10
                  sm:w-11
                  sm:h-11
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  text-white
                  hover:text-purple-300
                  transition
                  duration-300
                "
          title="Home"
        >
          <FaHome className="text-xl sm:text-2xl md:text-3xl" />
        </button>
        <div className="bg-white w-full max-w-[450px] p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl">
          {/* ========================================== */}
          {/* HEADING */}
          {/* ========================================== */}

          <h1 className="text-3xl sm:text-4xl font-bold text-center text-purple-900">
            Login
          </h1>

          <p className="text-center text-gray-500 mt-3 text-sm sm:text-base">
            Welcome back to DenyDev
          </p>

          {/* ========================================== */}
          {/* LOGIN FORM */}
          {/* ========================================== */}

          <form className="mt-8 sm:mt-10" onSubmit={handleSubmit}>
            {/* ========================================== */}
            {/* EMAIL */}
            {/* ========================================== */}

            <div className="mb-6">
              <label className="block mb-2 font-medium text-sm sm:text-base">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  sm:text-base
                  outline-none
                  focus:border-blue-500
                "
              />
            </div>

            {/* ========================================== */}
            {/* PASSWORD */}
            {/* ========================================== */}

            <div className="mb-6">
              <label className="block mb-2 font-medium text-sm sm:text-base">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  sm:text-base
                  outline-none
                  focus:border-blue-500
                "
              />
            </div>

            {/* ========================================== */}
            {/* LOGIN BUTTON */}
            {/* ========================================== */}

            <button
              type="submit"
              className="
                w-full
                bg-blue-600
                text-white
                py-3
                rounded-xl
                hover:bg-blue-700
                duration-300
                text-sm
                sm:text-base
                font-medium
              "
            >
              Login
            </button>
          </form>

          {/* ========================================== */}
          {/* REGISTER LINK */}
          {/* ========================================== */}

          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm sm:text-base">
              Create an Account !
            </span>

            <Link
              to="/register"
              className="
                text-blue-700
                font-semibold
                ml-2
                hover:underline
                text-sm
                sm:text-base
              "
            >
              Register
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
