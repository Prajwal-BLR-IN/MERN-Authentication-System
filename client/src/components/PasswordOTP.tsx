import { useState, useRef } from "react";
import { toast } from "react-toastify";

type PasswordOTPPropType = {
  setOTP: (otp: string) => void;
  onSuccess: () => void;
};

const PasswordOTP = ({ setOTP, onSuccess }: PasswordOTPPropType) => {
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);
  const [otpArray, setOtpArray] = useState(Array(6).fill(""));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otpArray];
    newOtp[idx] = value;
    setOtpArray(newOtp);

    if (idx < 5) inputRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpArray];

      if (otpArray[idx]) {
        newOtp[idx] = "";
      } else if (idx > 0) {
        inputRef.current[idx - 1]?.focus();
        newOtp[idx - 1] = "";
      }

      setOtpArray(newOtp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").replace(/[^0-9]/g, "");
    if (!pasteData) return;

    const pasteArray = pasteData.slice(0, 6 - idx).split("");
    const newOtp = [...otpArray];

    pasteArray.forEach((char, i) => {
      newOtp[idx + i] = char;
    });

    setOtpArray(newOtp);

    const nextFocus = Math.min(idx + pasteArray.length, 5);
    inputRef.current[nextFocus]?.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fullOtp = otpArray.join("");
    if (fullOtp.length < 6 || otpArray.includes("")) {
      toast.warn("Please enter all 6 digits.");
      return;
    }

    setOTP(fullOtp);
    onSuccess();
  };

  return (
    <div className="otp-form">
      <h2 className="email-verfy-heading-text">Password Reset OTP</h2>
      <p className="email-verfy-heading-paragraph">Enter the 6-digit code sent to your email ID</p>
      <form onSubmit={handleSubmit} className="password-reset-form">
        <div className="email-very-otp">
          {otpArray.map((digit, idx) => (
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
        <button type="submit" className="password-reset-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PasswordOTP;
