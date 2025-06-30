import { useState } from "react";
import PasswordEmail from "../components/PasswordEmail";
import { assets } from "../assets/assets";
import PasswordOTP from "../components/PasswordOTP";
import PasswordNew from "../components/PasswordNew";
import { useAppContext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { backendUrl } = useAppContext();
  axios.defaults.withCredentials = true;

  const [formType, setFormType] = useState({
    isEmailEntered: false,
    isOTPEntered: false,
    isPasswordEntered: false,
  });

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOTP] = useState("");
  const navigate = useNavigate();

  const onsubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        setFormType((prev) => ({ ...prev, isEmailEntered: true }));
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const onsubmitNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="otp-bg">
      <img src={assets.bg_otp_original} alt="" className="otp-bg-image" />

      {!formType.isEmailEntered && (
        <PasswordEmail email={email} setEmail={setEmail} onsubmitEmail={onsubmitEmail} />
      )}

      {formType.isEmailEntered && !formType.isOTPEntered && (
        <PasswordOTP
          setOTP={(val: string) => setOTP(val)}
          onSuccess={() => setFormType((prev) => ({ ...prev, isOTPEntered: true }))}
        />
      )}

      {formType.isOTPEntered && (
        <PasswordNew
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          onsubmitNewPassword={onsubmitNewPassword}
        />
      )}
    </div>
  );
};

export default ResetPassword;
