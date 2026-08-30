import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

import { Dashboard } from './pages/Dashboard';
import { Diagnostics } from './pages/Diagnostics';
import { ActivityLog } from './pages/ActivityLog';
import { Chat } from './pages/Chat';

import { Toaster } from 'sonner';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="diagnostics" element={<Diagnostics />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster position="top-center" theme="dark" richColors />
    </BrowserRouter>
  );
}
