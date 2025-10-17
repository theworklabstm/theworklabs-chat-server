import React, { useState, useContext } from 'react';
import logo from './assets/theworklabs-logo.jpg'
import CsrfContext from './CsrfContext';
import { login } from './AppApi';

interface ChatLoginProps {
  onSuccess: (userInfo: any) => void;
  onSwitchToSignup: () => void;
}

const ChatLogin: React.FC<ChatLoginProps> = ({ onSuccess, onSwitchToSignup }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const csrf = useContext(CsrfContext)

  const handleLogin = async () => {
    setError('')
    
    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    setLoading(true)
    try {
      const resp = await login(csrf, username, password)
      onSuccess(resp);
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail)
      } else {
        setError('Login failed. Please check your username and password.')
      }
    }
    setLoading(false)
  };

  return (
    <form id="chat-login" onSubmit={(e) => {
      e.preventDefault()
      handleLogin()
    }}>
      <div id="chat-login-logo-container">
        <img src={logo} width="120px" height="120px" style={{borderRadius: '12px', objectFit: 'contain'}} alt="TheWorklabs Logo" />
      </div>
      
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
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      </div>
      <div className="input-container">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete='currentPassword' required />
      </div>
      <div className='login-button-container'>
        <button disabled={loading} className={`${(loading) ? 'loading' : ''}`}>Login</button>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span style={{ color: '#666' }}>Don't have an account? </span>
        <button 
          type="button"
          onClick={onSwitchToSignup}
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
          Sign up here
        </button>
      </div>
    </form>
  );
};

export default ChatLogin;
