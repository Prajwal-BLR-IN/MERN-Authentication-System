import { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppContext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const {backendUrl, isLoggedin, userData, getUserData } = useAppContext();
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); 
    if (!value) return;

    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    if (idx < 5) inputRef.current[idx + 1]?.focus(); 
  };

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
  if (e.key === "Backspace") {
    const newOtp = [...otp];

    if (otp[idx]) {
      // ✅ Case 1: If current box has a value, just clear it
      newOtp[idx] = "";
      setOtp(newOtp);
    } else if (idx > 0) {
      // ✅ Case 2: If current is empty, go back and clear previous
      inputRef.current[idx - 1]?.focus();
      newOtp[idx - 1] = "";
      setOtp(newOtp);
    }
  }
};

const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
  e.preventDefault();

  const pasteData = e.clipboardData.getData("Text").replace(/[^0-9]/g, ""); // Only digits
  if (!pasteData) return;

  const pasteArray = pasteData.slice(0, 6 - idx).split(""); // Max digits that fit
  const newOtp = [...otp];

  pasteArray.forEach((char, i) => {
    newOtp[idx + i] = char;
  });

  setOtp(newOtp);

  // Move focus to the last pasted digit or last input
  const nextFocus = Math.min(idx + pasteArray.length, 5);
  inputRef.current[nextFocus]?.focus();
};




const handleSubmit = async () => {
  const fullOtp = otp.join("");
  if (fullOtp.length < 6 || otp.includes("")) {
    toast.warn("Please enter all 6 digits.");
    return;
  }


  try {
    const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp: fullOtp });
    if (data.success) {
      toast.success(data.message);
      getUserData();
      navigate('/');
    } else {
      toast.error("Error verifying OTP");
    }
  } catch (error: any) {
    toast.error(error.message);
  }
};

useEffect(() => {
  isLoggedin && userData && userData.isAccountVerified && navigate('/')
}, [isLoggedin, userData])

  return (
    <div className="otp-bg">
      <img src={assets.bg_otp_original} alt="" className="otp-bg-image" />
      <div className="otp-form">
        <h2 className="email-verfy-heading-text">Email Verify OTP</h2>
        <p className="email-verfy-heading-paragraph">Enter the 6-digit code sent to your email id</p>
        <div className="email-very-otp">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              className="email-very-otp-field"
              ref={(el) => { 
                inputRef.current[idx] = el; 
              }}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={(e) => handlePaste(e, idx)}
            />
          ))}
        </div>
        <button className="email-verfy-button" onClick={handleSubmit}>Verify Email</button>
      </div>
    </div>
  );
};

export default EmailVerify;
