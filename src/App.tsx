import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

import { Dashboard } from './pages/Dashboard';
import { Diagnostics } from './pages/Diagnostics';
import { MapView } from './pages/MapView';
import { Treatments } from './pages/Treatments';
import { Chat } from './pages/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="diagnostics" element={<Diagnostics />} />
          <Route path="map" element={<MapView />} />
          <Route path="treatments" element={<Treatments />} />
          <Route path="chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
