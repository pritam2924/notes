// OTP.jsx
import React from "react"; // Keep React import if it's a component
// Removed: useEffect, useRef, useState, useNavigate, timer-related functions

/**
 * Generates a 6-digit random OTP.
 * This function is exposed for use in Auth.jsx's handleSendOtp handler.
 * @returns {string} The generated OTP as a string.
 */
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// This component structure is kept solely to adhere to the requested "export default OTP".
// It is intentionally empty as the OTP input field and logic is now fully handled in Register.jsx and Auth.jsx.
const OTP = () => {
    return null;
};

export default OTP;