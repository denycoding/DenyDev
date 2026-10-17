import { useEffect, useState } from "react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import API from "./API";
import { MdMarkEmailRead } from "react-icons/md";


function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [otpbox, setotpbox] = useState(false);
  const [otp, setotp] = useState(["", "", "", "", "", ""]);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const otpInputs = useRef([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
  });

  // Countdown for the "Resend code" button
  useEffect(() => {
    if (resendIn <= 0) return;

    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);

    return () => clearTimeout(timer);
  }, [resendIn]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 1: send the OTP
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/register", formData);

      if (res.data.success) {
        setotp(["", "", "", "", "", ""]);
        setotpbox(true);
        setResendIn(60);
      } else {
        alert(res.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = (e, index) => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return;

    setotp((previousOtp) => {
      const newOtp = [...previousOtp];
      newOtp[index] = value;
      return newOtp;
    });

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handlePasteOtp = (e) => {
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!digits) return;

    e.preventDefault();

    setotp(Array.from({ length: 6 }, (_, i) => digits[i] || ""));

    otpInputs.current[Math.min(digits.length, 5)]?.focus();
  };

  // Lets the user paste the whole code at once

  // Step 2: verify the OTP and create the account
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Please enter the 6-digit code.");
      return;
    }

    try {
      setVerifyingOtp(true);

      const res = await API.post("/verify-otp", {
        email: formData.email,
        otp: otpValue,
      });

      if (res.data.success) {
        alert("Account created successfully 🚀");
        navigate("/login");
      } else {
        alert(res.data.message || "Verification failed.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert(error.response?.data?.message || "Verification failed.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResend = async () => {
    try {
      await API.post("/resend-otp", { email: formData.email });
      setotp(["", "", "", "", "", ""]);
      setResendIn(60);
    } catch (error) {
      alert(error.response?.data?.message || "Could not resend the code.");
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
      {!otpbox && (
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

          <form className="mt-5 sm:mt-6" onSubmit={handleRegister}>
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

                <option value="client">Client</option>

                <option value="freelancer">Freelancer</option>
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
    disabled:opacity-70
    disabled:cursor-not-allowed
    "
            >
              {loading ? "Sending code..." : "Register"}
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
            <span className="text-gray-600">Already have an Account?</span>

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
      )}
      ```jsx
      {otpbox && (
        <div className="w-full max-w-[460px] rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
          {/* OTP Heading */}
          <div className="mb-5 flex justify-center">
            <div className="rounded-2xl bg-purple-100 p-4">
              <MdMarkEmailRead className="text-4xl text-purple-800" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-purple-900 sm:text-3xl">
            Verify your email
          </h1>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            We sent a 6-digit code to
            <span className="mt-1 block break-all font-semibold text-gray-800">
              {formData.email}
            </span>
          </p>

          {/* OTP Input Boxes */}
          <div
            className="mt-7 flex justify-center gap-2 sm:gap-3"
            onPaste={handlePasteOtp}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpInputs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                aria-label={`OTP digit ${index + 1}`}
                onChange={(e) => handleOtp(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                className="
            h-12 w-10 rounded-xl border border-gray-300
            text-center text-xl font-bold text-gray-900
            outline-none transition
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            sm:h-14 sm:w-12
          "
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={otp.some((digit) => digit === "") || verifyingOtp}
            className="
        mt-7 w-full rounded-xl bg-blue-600 py-3
        font-medium text-white transition
        hover:bg-blue-700
        disabled:cursor-not-allowed disabled:opacity-60
      "
          >
            {verifyingOtp ? "Verifying..." : "Verify & Create Account"}
          </button>

          {/* Resend OTP */}
          <div className="mt-5 text-sm text-gray-600">
            {resendIn > 0 ? (
              <span>Resend code in {resendIn}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-semibold text-blue-700 hover:underline"
              >
                Resend code
              </button>
            )}
          </div>

          {/* Back to Registration */}
          <button
            type="button"
            onClick={() => {
              setotpbox(false);
              setotp(["", "", "", "", "", ""]);
            }}
            className="mt-4 text-sm text-gray-500 transition hover:text-gray-800"
          >
            ← Use a different email
          </button>
        </div>
      )}
      ```
    </section>
  );
}

export default Register;
