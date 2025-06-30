import { assets } from "../assets/assets"

type passwordEmailPropType = {
  email: string;
  setEmail: (email: string) => void;
  onsubmitEmail: (e: React.FormEvent<HTMLFormElement>) => void;
};

const PasswordEmail = ({ email, setEmail, onsubmitEmail }: passwordEmailPropType) => {
  return (
    <div className="otp-form">
      <h2 className="email-verfy-heading-text">Password Reset</h2>
      <p className="email-verfy-heading-paragraph">Enter your registered email address</p>
      <form onSubmit={onsubmitEmail} className="password-reset-form">
        <div className="password-reset-email-field">
          <img src={assets.mail_icon} alt="mail icon" />
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="password-reset-button">
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default PasswordEmail;
