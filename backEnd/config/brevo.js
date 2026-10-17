const sendOtpEmail = async (email, fullName, otp) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_SENDER_NAME || "DenyDev",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email, name: fullName }],
      subject: "DenyDev Email Verification OTP",

      htmlContent: `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; color: #333;">
    <h2 style="color: #4c1d95;">Welcome to DenyDev!</h2>

    <p>Hello ${fullName},</p>

    <p>Thank you for registering with DenyDev. Please use the verification code below to confirm your email address.</p>

    <div style="background: #f5f0ff; padding: 18px; text-align: center; border-radius: 8px; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #666;">Your verification OTP</p>
      <h1 style="margin: 0; color: #4c1d95; letter-spacing: 6px;">${otp}</h1>
    </div>

    <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>

    <p>If you did not create a DenyDev account, you can ignore this email.</p>

    <p>Best regards,<br/><strong>Team DenyDev</strong></p>
  </div>
`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Brevo error:", error);
    throw new Error("Failed to send OTP email");
  }

  return response.json();
};

module.exports = sendOtpEmail;
