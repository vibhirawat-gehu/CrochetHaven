import { useState } from 'react';
import api from '../api/axios';
import './Contact.css';

const CONTACT_CARDS = [
  {
    title: 'Location', text: 'Made with love from India',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
  },
  {
    title: 'Email', text: 'hello@crochethaven.in',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
  },
  {
    title: 'Response Time', text: 'Usually within 24 hours',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  }
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page container">
      <div className="contact-layout">
        <div className="contact-info">
          <h1 className="section-title">Get in Touch</h1>
          <p className="section-sub">We'd love to hear from you!</p>
          <div className="contact-cards">
            {CONTACT_CARDS.map(c => (
              <div key={c.title} className="contact-card">
                <span className="contact-icon">{c.icon}</span>
                <div>
                  <h4>{c.title}</h4>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="about-card">
            <h3>About CrochetHaven</h3>
            <p>
              We are a small home-based business crafting handmade crochet items with love.
              Every piece is unique, made with premium yarn and attention to detail.
              Custom orders are also welcome — reach out!
            </p>
          </div>
        </div>

        <div className="contact-form-card">
          <h2>Send a Message</h2>
          {success ? (
            <div className="success-banner">
              <span className="success-check">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a7a3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <div>
                <strong>Message Sent!</strong>
                <p>Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us what's on your mind..." required />
              </div>
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }} disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
