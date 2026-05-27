import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Profile.css';

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || ''
    }
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.address) {
      setForm(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await api.put('/auth/profile', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page container">
      <div className="profile-layout">

        {/* Left sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{getInitials(user?.name)}</div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>

          <nav className="profile-nav">
            <button className="profile-nav-item active">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              My Profile
            </button>
            <button className="profile-nav-item" onClick={() => navigate('/orders')}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
              My Orders
            </button>
            <button className="profile-nav-item" onClick={() => navigate('/cart')}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              My Cart
            </button>
            <button className="profile-nav-item logout-item" onClick={handleLogout}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </nav>
        </aside>

        {/* Right content */}
        <div className="profile-content">
          <div className="profile-card">
            <h2>Personal Information</h2>
            <p className="profile-card-sub">Update your name and address details</p>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input value={user?.email} disabled className="input-disabled" />
                <span className="field-note">Email cannot be changed</span>
              </div>

              <h3 className="address-heading">Delivery Address</h3>
              <div className="form-group">
                <label>Street Address</label>
                <input name="street" value={form.address.street} onChange={handleChange} placeholder="123, MG Road" />
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.address.city} onChange={handleChange} placeholder="Mumbai" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={form.address.state} onChange={handleChange} placeholder="Maharashtra" />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input name="pincode" value={form.address.pincode} onChange={handleChange} placeholder="400001" />
                </div>
              </div>

              {error && <p className="error-msg">{error}</p>}
              {saved && <p className="success-msg"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><polyline points="20 6 9 17 4 12"/></svg>Profile updated successfully!</p>}

              <button type="submit" className="btn-primary save-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="profile-card info-card">
            <h2>Account Details</h2>
            <div className="info-row">
              <span>Member since</span>
              <strong>{new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</strong>
            </div>
            <div className="info-row">
              <span>Account type</span>
              <strong className="role-badge">
                {user?.role === 'admin'
                  ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Admin</>
                  : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>Customer</>
                }
              </strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
