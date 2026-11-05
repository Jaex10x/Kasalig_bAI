import React from 'react';

export const TeacherLogin = ({ onNavigate }) => {
  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', padding: '32px', background: '#fff', borderRadius: '16px', border: '1px solid #ede6dc', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#111827', marginBottom: '8px' }}>Teacher Login</h2>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Sign in to view class-wide diagnostic analytics and lesson recommendations.</p>
      <form onSubmit={(e) => { e.preventDefault(); alert('Teacher login submitted'); }}>
        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Faculty Email</label>
          <input type="text" placeholder="teacher@school.edu" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
        </div>
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Password</label>
          <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#0d1929', color: '#fff', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          Sign In as Educator
        </button>
      </form>
    </div>
  );
};

export default TeacherLogin;

