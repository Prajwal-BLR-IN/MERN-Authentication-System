import { assets } from "../assets/assets"

type passwordNewPropType = {
  newPassword: string;
  setNewPassword: (password: string) => void;
  onsubmitNewPassword: (e: React.FormEvent<HTMLFormElement>) => void;
};

const PasswordNew = ({
  newPassword,
  setNewPassword,
  onsubmitNewPassword,
}: passwordNewPropType) => {
  return (
    <div className="otp-form">
      <h2 className="email-verfy-heading-text">New Password</h2>
      <p className="email-verfy-heading-paragraph">Enter the new password below</p>
      <form onSubmit={onsubmitNewPassword} className="password-reset-form">
        <div className="password-reset-email-field">
          <img src={assets.lock_icon} alt="lock icon" />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="password-reset-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordNew;
