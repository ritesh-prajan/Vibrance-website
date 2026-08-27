import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FestProvider, useFest } from './context/FestContext';

// Layout & Route Guards
import { AppLayout } from './components/layout/AppLayout';
import { RequireAuth } from './components/layout/RequireAuth';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Student Pages
import { EventsCatalogPage } from './pages/student/EventsCatalogPage';
import { EventDetailPage } from './pages/student/EventDetailPage';
import { SeatSelectionPage } from './pages/student/SeatSelectionPage';
import { CheckoutPage } from './pages/student/CheckoutPage';
import { TicketPage } from './pages/student/TicketPage';
import { MyBookingsPage } from './pages/student/MyBookingsPage';
import { ProfilePage } from './pages/student/ProfilePage';

// Gate Staff Pages
import { VerifyConsolePage } from './pages/staff/VerifyConsolePage';
import { VerifyHistoryPage } from './pages/staff/VerifyHistoryPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminConcurrencyLabPage } from './pages/admin/AdminConcurrencyLabPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

const RootRedirect: React.FC = () => {
  const { currentUser } = useFest();

  if (!currentUser) {
    return <LandingPage />;
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (currentUser.role === 'gate_staff') {
    return <Navigate to="/verify" replace />;
  }

  return <Navigate to="/events" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root Route — Full-Bleed Animated Landing with Scroll-Linked Login */}
      <Route path="/" element={<RootRedirect />} />

      {/* Standalone Public Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Protected Flow */}
      <Route
        path="/events"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <EventsCatalogPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/events/:eventId"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <EventDetailPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/events/:eventId/seats"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <SeatSelectionPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/checkout/:eventId"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <CheckoutPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/ticket/:bookingId"
        element={
          <RequireAuth allowedRoles={['student', 'admin', 'gate_staff']}>
            <AppLayout>
              <TicketPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <MyBookingsPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </RequireAuth>
        }
      />

      {/* Gate Staff Protected Flow */}
      <Route
        path="/verify"
        element={
          <RequireAuth allowedRoles={['gate_staff']}>
            <AppLayout>
              <VerifyConsolePage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/verify/history"
        element={
          <RequireAuth allowedRoles={['gate_staff']}>
            <AppLayout>
              <VerifyHistoryPage />
            </AppLayout>
          </RequireAuth>
        }
      />

      {/* Admin Protected Flow */}
      <Route
        path="/admin"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminDashboardPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/events"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminEventsPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminUsersPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/concurrency-lab"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminConcurrencyLabPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/concurrency"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminConcurrencyLabPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminAuditLogsPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminAuditLogsPage />
            </AppLayout>
          </RequireAuth>
        }
      />

      {/* 404 Catch All */}
      <Route
        path="*"
        element={
          <AppLayout>
            <NotFoundPage />
          </AppLayout>
        }
      />
    </Routes>
  );
};

export function App() {
  return (
    <FestProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </FestProvider>
  );
}

export default App;
