
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { User } from './types';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import NewTransactionPage from './pages/NewTransactionPage';
import TransactionsHistoryPage from './pages/TransactionsHistoryPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NotificationContainer from './components/common/NotificationContainer';

const ProtectedRoute: React.FC<{ allowedRoles: Array<User['role']>, children: React.ReactNode }> = ({ allowedRoles, children }) => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    if (user && allowedRoles.includes(user.role)) {
        return <>{children}</>;
    }
    // Redirect to dashboard if role is not allowed
    return <Navigate to="/" replace />;
};


const App: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Loading...</div>;
  }
  const { user } = authContext;

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route 
          path="/*" 
          element={
            user ? (
              <Layout>
                <Routes>
                  <Route index element={<DashboardPage />} />
                  <Route path="/students" element={<StudentsPage />} />
                  <Route path="/transactions/new" element={
                    <ProtectedRoute allowedRoles={['admin', 'kasir']}>
                      <NewTransactionPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/transactions/history" element={<TransactionsHistoryPage />} />
                  <Route path="/reports" element={
                    <ProtectedRoute allowedRoles={['admin', 'manager']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                     <ProtectedRoute allowedRoles={['admin']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
      <NotificationContainer />
    </>
  );
};

export default App;
