import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Layout from './components/Layout';
import ToastContainer from './components/Toast';
import AccountSetupModal from './components/AccountSetupModal';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';

// Dynamic lazy imports for optimized bundle scaling & fast code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ContentCalendar = lazy(() => import('./pages/ContentCalendar'));
const FeedGridPlanner = lazy(() => import('./pages/FeedGridPlanner'));
const PostComposer = lazy(() => import('./pages/PostComposer'));
const InboxCRM = lazy(() => import('./pages/InboxCRM'));
const Analytics = lazy(() => import('./pages/Analytics'));
const CompetitorAudit = lazy(() => import('./pages/CompetitorAudit'));
const Automations = lazy(() => import('./pages/Automations'));
const HashtagResearch = lazy(() => import('./pages/HashtagResearch'));
const Settings = lazy(() => import('./pages/Settings'));

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="calendar" element={<ContentCalendar />} />
                <Route path="grid" element={<FeedGridPlanner />} />
                <Route path="composer" element={<PostComposer />} />
                <Route path="inbox" element={<InboxCRM />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="competitors" element={<CompetitorAudit />} />
                <Route path="automations" element={<Automations />} />
                <Route path="hashtags" element={<HashtagResearch />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <ToastContainer />
        <AccountSetupModal />
      </AppProvider>
    </BrowserRouter>
  );
}
