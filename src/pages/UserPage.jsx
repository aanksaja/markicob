import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const User = () => {
  const { authToken } = useAuth();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authToken) {
        setError('Tidak ada token autentikasi. Harap login.');
        setLoading(false);
        return;
      }

      try {
        // Menggunakan axios.get untuk request GET
        const response = await axios.get(API_BASE_URL + '/users/list', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`, // Sertakan token
          },
        });

        const data = response.data; // Data respons ada di response.data
        setUserData(data); // Asumsikan respons adalah array user
      } catch (err) {
        console.error('Error fetching user data (Axios):', err); // Log objek error lengkap
        if (err.response) {
          if (err.response.status === 401) {
            setError('Sesi berakhir atau tidak valid. Silakan login kembali.');
            // Opsional: panggil logout() dari useAuth jika token benar-benar expired
            const { logout } = useAuth();
            logout();
            navigate('/login');
          } else {
            setError(
              err.response.data.message || 'Gagal mengambil data pengguna.',
            );
          }
        } else if (err.request) {
          setError('Tidak dapat terhubung ke server untuk data pengguna.');
        } else {
          setError(
            'Terjadi kesalahan yang tidak terduga saat mengambil data pengguna: ' +
              err.message,
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authToken]);

  if (loading) return <div>Memuat data pengguna...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (userData.length === 0) return <div>Tidak ada data pengguna.</div>;

  return (
    <div>
      <h1>Daftar Pengguna</h1>
      <ul>
        {userData.map((user) => (
          // Pastikan 'user.id' dan 'user.name' atau 'user.username' sesuai dengan struktur data dari backend Anda
          <li key={user.id}>
            {user.name || user.username} ({user.email || 'No Email'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
