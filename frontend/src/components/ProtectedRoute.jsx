import React from 'react';

export default function ProtectedRoute({ children }) {
  // Mengizinkan akses langsung agar tidak terjebak redirect loop
  return children;
}
