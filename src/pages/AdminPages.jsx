// src/pages/AdminDashboardPage.jsx
import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800 border-b-2 pb-2">
        Admin Dashboard
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed">
        Selamat datang di panel admin! Di sini Anda dapat mengelola semua aspek
        aplikasi Anda, termasuk pengguna, produk, pesanan, dan laporan.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-5 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">Total Pengguna</h2>
          <p className="text-4xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="bg-green-100 p-5 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Produk Aktif</h2>
          <p className="text-4xl font-bold text-green-600">567</p>
        </div>
        <div className="bg-yellow-100 p-5 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-yellow-800 mb-2">Pesanan Baru</h2>
          <p className="text-4xl font-bold text-yellow-600">89</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;


// // src/pages/AdminUsersPage.jsx
// import React from 'react';

// const AdminUsersPage = () => {
//   const users = [
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Customer' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin' },
//     { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Customer' },
//   ];

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg">
//       <h1 className="text-4xl font-extrabold mb-6 text-gray-800 border-b-2 pb-2">
//         Manajemen Pengguna Admin
//       </h1>
//       <p className="text-lg text-gray-700 mb-8">
//         Daftar semua pengguna terdaftar dan informasi detail mereka.
//         Halaman ini hanya dapat diakses oleh administrator.
//       </p>

//       <div className="overflow-x-auto rounded-lg shadow-md">
//         <table className="min-w-full leading-normal">
//           <thead>
//             <tr className="bg-gray-200 text-gray-600 uppercase text-sm font-semibold">
//               <th className="py-3 px-6 text-left">ID</th>
//               <th className="py-3 px-6 text-left">Nama</th>
//               <th className="py-3 px-6 text-left">Email</th>
//               <th className="py-3 px-6 text-left">Peran</th>
//               <th className="py-3 px-6 text-center">Aksi</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white text-gray-700">
//             {users.map((user) => (
//               <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
//                 <td className="py-3 px-6 text-left whitespace-nowrap">{user.id}</td>
//                 <td className="py-3 px-6 text-left">{user.name}</td>
//                 <td className="py-3 px-6 text-left">{user.email}</td>
//                 <td className="py-3 px-6 text-left">
//                   <span
//                     className={`px-3 py-1 text-xs font-bold rounded-full ${
//                       user.role === 'Admin'
//                         ? 'bg-red-200 text-red-800'
//                         : 'bg-green-200 text-green-800'
//                     }`}
//                   >
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="py-3 px-6 text-center">
//                   <button className="text-blue-600 hover:text-blue-900 mx-1">Edit</button>
//                   <button className="text-red-600 hover:text-red-900 mx-1">Hapus</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminUsersPage;


// // src/pages/AdminProductsPage.jsx
// import React from 'react';

// const AdminProductsPage = () => {
//   const products = [
//     { id: 101, name: 'Laptop Gaming X', price: 1200, stock: 50 },
//     { id: 102, name: 'Smartphone Z Pro', price: 800, stock: 120 },
//     { id: 103, name: 'Smartwatch Lite', price: 150, stock: 200 },
//   ];

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg">
//       <h1 className="text-4xl font-extrabold mb-6 text-gray-800 border-b-2 pb-2">
//         Manajemen Produk Admin
//       </h1>
//       <p className="text-lg text-gray-700 mb-8">
//         Kelola semua produk yang tersedia di toko Anda. Tambah, edit, atau hapus produk.
//       </p>

//       <div className="overflow-x-auto rounded-lg shadow-md">
//         <table className="min-w-full leading-normal">
//           <thead>
//             <tr className="bg-gray-200 text-gray-600 uppercase text-sm font-semibold">
//               <th className="py-3 px-6 text-left">ID Produk</th>
//               <th className="py-3 px-6 text-left">Nama Produk</th>
//               <th className="py-3 px-6 text-right">Harga</th>
//               <th className="py-3 px-6 text-right">Stok</th>
//               <th className="py-3 px-6 text-center">Aksi</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white text-gray-700">
//             {products.map((product) => (
//               <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
//                 <td className="py-3 px-6 text-left whitespace-nowrap">{product.id}</td>
//                 <td className="py-3 px-6 text-left">{product.name}</td>
//                 <td className="py-3 px-6 text-right">${product.price.toLocaleString()}</td>
//                 <td className="py-3 px-6 text-right">{product.stock}</td>
//                 <td className="py-3 px-6 text-center">
//                   <button className="text-blue-600 hover:text-blue-900 mx-1">Edit</button>
//                   <button className="text-red-600 hover:text-red-900 mx-1">Hapus</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminProductsPage;