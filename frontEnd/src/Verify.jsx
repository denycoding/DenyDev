import { useRef } from "react";

function Verify({
  email,
  otp,
  handleOtp,
  onPaste,
  handleVerifyOtp,
  verifyingOtp,
  onResend,
  resendIn,
  onBack,
}) {
  const inputs = useRef([]);

  // Handle input and automatically focus the next box
  const onChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) {
      handleOtp({ target: { value: "" } }, index);
      return;
    }

    // Support entering multiple digits in one box
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");

      digits.forEach((digit, i) => {
        handleOtp({ target: { value: digit } }, i);
      });

      inputs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    handleOtp({ target: { value } }, index);

    if (index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace and arrow-key navigation
  const onKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        handleOtp({ target: { value: "" } }, index);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Handle pasting the complete OTP
  const handleOtpPaste = (e) => {
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!digits) return;

    e.preventDefault();

    digits.split("").forEach((digit, index) => {
      handleOtp({ target: { value: digit } }, index);
    });

    inputs.current[Math.min(digits.length, 5)]?.focus();
  };

  const isComplete =
    otp.length === 6 && otp.every((digit) => /^\d$/.test(digit));

  return (
    <div className="w-full max-w-[460px] rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-purple-900 sm:text-3xl">
        Verify your email
      </h1>

      <p className="mt-3 text-sm text-gray-500 sm:text-base">
        We sent a 6-digit code to
        <span className="block break-all font-semibold text-gray-800">
          {email}
        </span>
      </p>

      {/* OTP Inputs */}
      <div
        className="mt-7 flex justify-center gap-2 sm:gap-3"
        onPaste={handleOtpPaste}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            aria-label={`OTP digit ${index + 1}`}
            onChange={(e) => onChange(e, index)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className="
              h-12 w-11 rounded-xl border border-gray-300
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
        disabled={!isComplete || verifyingOtp}
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
            onClick={onResend}
            className="font-semibold text-blue-700 hover:underline"
          >
            Resend code
          </button>
        )}
      </div>

      {/* Change Email */}
      <button
        type="button"
        onClick={onBack}
        className="mt-3 text-sm text-gray-500 transition hover:text-gray-800"
      >
        ← Use a different email
      </button>
    </div>
  );
}

export default Verify;
