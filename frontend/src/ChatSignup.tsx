import React, { useState, useContext } from 'react';
import logo from './assets/theworklabs-logo.jpg'
import CsrfContext from './CsrfContext';
import { signup } from './AppApi';

interface ChatSignupProps {
  onSuccess: (userInfo: any) => void;
  onSwitchToLogin: () => void;
}

const ChatSignup: React.FC<ChatSignupProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const csrf = useContext(CsrfContext)

  const handleSignup = async () => {
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    try {
      const resp = await signup(csrf, username, password, email)
      onSuccess(resp);
    } catch (err: any) {
      console.error('Signup failed:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail)
      } else {
        setError('Signup failed. Please try again.')
      }
    }
    setLoading(false)
  };

  return (
    <form id="chat-login" onSubmit={(e) => {
      e.preventDefault()
      handleSignup()
    }}>
      <div id="chat-login-logo-container">
        <img src={logo} width="120px" height="120px" style={{borderRadius: '12px', objectFit: 'contain'}} alt="TheWorklabs Logo" />
      </div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Create Account</h2>
      
      {error && (
        <div style={{ 
          color: '#e74c3c', 
          textAlign: 'center', 
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#fdf2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      <div className="input-container">
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username (min 3 characters)" 
          required
        />
      </div>
      <div className="input-container">
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email (optional)" 
        />
      </div>
      <div className="input-container">
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password (min 6 characters)" 
          autoComplete='new-password'
          required
        />
      </div>
      <div className="input-container">
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirm Password" 
          autoComplete='new-password'
          required
        />
      </div>
      <div className='login-button-container'>
        <button disabled={loading} className={`${(loading) ? 'loading' : ''}`}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span style={{ color: '#666' }}>Already have an account? </span>
        <button 
          type="button"
          onClick={onSwitchToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            fontSize: 'inherit'
          }}
        >
          Login here
        </button>
      </div>
    </form>
  );
};

export default ChatSignup;
