import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, getRedirectPath, clearRedirectPath } = useAuth(); // Dapatkan fungsi login dari AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(API_BASE_URL + '/auth/login', {
        username,
        password,
      });

      const data = response.data; // Respons dari backend

      if (data.token && data.user) {
        // Pastikan ada token DAN data user
        // TIDAK PERLU lagi setItem di sini, karena fungsi login() di context akan melakukannya
        // localStorage.setItem('authToken', data.token);
        // localStorage.setItem('userData', JSON.stringify(data.user));

        // Panggil fungsi login dari AuthContext dengan token dan data user sebagai argumen
        // login(data.token, data.user);
        const success = login(data.token, data.user);
        const redirectPath = getRedirectPath();
        if (redirectPath) {
          navigate(redirectPath, { replace: true }); // Arahkan ke path yang disimpan
        } else {
          // Default ke homepage jika tidak ada path yang disimpan
          navigate('/', { replace: true });
        }
        clearRedirectPath();

        // alert('Login Berhasil!');
        // navigate('/'); // Redirect ke halaman Home
      } else {
        throw new Error(
          'Login berhasil, tetapi token atau data user tidak ditemukan dalam respons.',
        );
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Username atau password salah.');
      } else if (err.request) {
        setError(
          'Tidak dapat terhubung ke server. Pastikan backend berjalan dan CORS diizinkan.',
        );
      } else {
        setError('Terjadi kesalahan yang tidak terduga: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
