import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import API from "./API";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // ==========================================
      // SEND REGISTER DATA TO BACKEND
      // ==========================================

      const res = await API.post("/register", formData);

      console.log("Register response:", res.data);

      // ==========================================
      // SHOW MESSAGE
      // ==========================================

      alert(res.data.message);

      // ==========================================
      // IF REGISTRATION SUCCESSFUL
      // GO TO LOGIN
      // ==========================================

      if (res.data.success) {
        setFormData({
          fullName: "",
          email: "",
          role: "",
          password: "",
        });

        navigate("/login");
      }
    } catch (error) {
      console.log("Registration Error:", error);

      alert("Registration failed. Please try again.");
    }
  };

  return (
    <section
      className="
        relative
        w-full
        h-screen
        bg-[#10002b]
        flex
        items-center
        justify-center
        px-3
        sm:px-2
        overflow-hidden
      "
    >
      {/* ==========================================
          HOME BUTTON
      ========================================== */}

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

      {/* ==========================================
          REGISTER CARD
      ========================================== */}

      <div
        className="
          bg-white
          w-full
          max-w-[500px]
          p-5
          sm:p-6
          md:p-7
          rounded-2xl
          sm:rounded-3xl
          shadow-2xl
          my-6
          mb-0
          pb-0
        "
      >
        {/* ==========================================
            HEADING
        ========================================== */}

        <h1
          className="
            text-2xl
            sm:text-3xl
            md:text-4xl
            font-bold
            text-center
            text-purple-900
          "
        >
          Register
        </h1>

        <p
          className="
            text-center
            text-gray-500
            mt-2
            text-sm
            sm:text-base
          "
        >
          Create your DenyDev account
        </p>

        {/* ==========================================
            FORM
        ========================================== */}

        <form
          className="mt-5 sm:mt-6"
          onSubmit={handleRegister}
        >
          {/* ==========================================
              FULL NAME
          ========================================== */}

          <div className="mb-4">
            <label
              className="
                block
                mb-1.5
                font-medium
                text-sm
                sm:text-base
              "
            >
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-2.5
                sm:py-3
                text-sm
                sm:text-base
                outline-none
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-500
                transition
              "
            />
          </div>

          {/* ==========================================
              EMAIL
          ========================================== */}

          <div className="mb-4">
            <label
              className="
                block
                mb-1.5
                font-medium
                text-sm
                sm:text-base
              "
            >
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
                py-2.5
                sm:py-3
                text-sm
                sm:text-base
                outline-none
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-500
                transition
              "
            />
          </div>

          {/* ==========================================
              ROLE
          ========================================== */}

          <div className="mb-4">
            <label
              className="
                block
                mb-1.5
                font-medium
                text-sm
                sm:text-base
              "
            >
              Select Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-2.5
                sm:py-3
                text-sm
                sm:text-base
                outline-none
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-500
                transition
                bg-white
              "
            >
              <option value="">Select Role</option>

              <option value="client">
                Client
              </option>

              <option value="freelancer">
                Freelancer
              </option>
            </select>
          </div>

          {/* ==========================================
              PASSWORD
          ========================================== */}

          <div className="mb-4">
            <label
              className="
                block
                mb-1.5
                font-medium
                text-sm
                sm:text-base
              "
            >
              Password
            </label>

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              minLength="6"
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-2.5
                sm:py-3
                text-sm
                sm:text-base
                outline-none
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-500
                transition
              "
            />
          </div>

          {/* ==========================================
              REGISTER BUTTON
          ========================================== */}

          <button
            type="submit"
            className="
              w-full
              bg-blue-600
              text-white
              py-2.5
              sm:py-3
              rounded-xl
              hover:bg-blue-700
              active:bg-blue-800
              duration-300
              text-sm
              sm:text-base
              font-medium
              transition
            "
          >
            Register
          </button>
        </form>

        {/* ==========================================
            LOGIN LINK
        ========================================== */}

        <div
          className="
            text-center
            mt-4
            sm:mt-5
            text-sm
            sm:text-base
          "
        >
          <span className="text-gray-600">
            Already have an Account?
          </span>

          <Link
            to="/login"
            className="
              text-blue-700
              font-semibold
              ml-2
              hover:underline
            "
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Register;