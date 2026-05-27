import { useState, useRef, useEffect } from 'react';

const DEMO_OTP = '123456';

export default function PhoneOTP({ onBack, onSuccess }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sending, setSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startTimer = () => {
    setResendTimer(30);
    timerRef.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) return setError('Enter a valid 10-digit phone number.');
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep('otp');
      startTimer();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, 1200);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    const entered = otp.join('');
    if (entered.length < 6) return setError('Enter the complete 6-digit OTP.');
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (entered === DEMO_OTP) {
        onSuccess(phone);
      } else {
        setError('Incorrect OTP. Try 123456 for demo.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 1000);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    startTimer();
    inputRefs.current[0]?.focus();
  };

  const goBack = () => {
    setStep('phone');
    setError('');
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="phone-otp-wrap">
      <button className="back-to-social" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        All sign-in options
      </button>

      {step === 'phone' ? (
        <form onSubmit={handleSendOTP}>
          <div className="otp-step-header">
            <div className="otp-step-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
            </div>
            <h3>Enter your phone number</h3>
            <p>We&apos;ll send a 6-digit OTP to verify your number.</p>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div className="phone-input-wrap">
              <span className="phone-flag">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="98765 43210"
                maxLength={11}
                autoFocus
                required
              />
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-primary auth-btn" disabled={sending}>
            {sending ? (
              <span className="otp-sending">
                <span className="otp-dot" /><span className="otp-dot" /><span className="otp-dot" />
              </span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.08-.88a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.42v1.5z"/></svg>
                Send OTP
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <div className="otp-step-header">
            <div className="otp-step-icon otp-step-icon--green">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.08-.88a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.42v1.5z"/></svg>
            </div>
            <h3>Enter the OTP</h3>
            <p>
              Sent to <strong>+91 {phone}</strong>
              <button type="button" className="change-phone" onClick={goBack}>Change</button>
            </p>
          </div>

          <div className="otp-boxes" onPaste={handleOtpPaste}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={d}
                className={`otp-box ${d ? 'filled' : ''}`}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
              />
            ))}
          </div>

          <p className="otp-demo-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Demo mode — use OTP <strong>123456</strong>
          </p>

          {error && <p className="error-msg" style={{ textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn-primary auth-btn" disabled={verifying || otp.join('').length < 6}>
            {verifying ? (
              <span className="otp-sending">
                <span className="otp-dot" /><span className="otp-dot" /><span className="otp-dot" />
              </span>
            ) : 'Verify & Sign In'}
          </button>

          <div className="otp-resend">
            {resendTimer > 0 ? (
              <span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Resend in <strong>{resendTimer}s</strong>
              </span>
            ) : (
              <button type="button" className="resend-btn" onClick={handleResend}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
                Resend OTP
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
