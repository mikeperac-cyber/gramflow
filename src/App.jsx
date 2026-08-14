import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Layout from './components/Layout';
import ToastContainer from './components/Toast';
import AccountSetupModal from './components/AccountSetupModal';

import Dashboard from './pages/Dashboard';
import ContentCalendar from './pages/ContentCalendar';
import PostComposer from './pages/PostComposer';
import Analytics from './pages/Analytics';
import Automations from './pages/Automations';
import HashtagResearch from './pages/HashtagResearch';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<ContentCalendar />} />
            <Route path="composer" element={<PostComposer />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="automations" element={<Automations />} />
            <Route path="hashtags" element={<HashtagResearch />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <ToastContainer />
        <AccountSetupModal />
      </AppProvider>
    </BrowserRouter>
  );
}
