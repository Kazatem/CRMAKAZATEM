import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import SellerLayout from './layouts/SellerLayout';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSellersPage from './pages/admin/AdminSellersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSalesPage from './pages/admin/AdminSalesPage';
import AdminClientsPage from './pages/admin/AdminClientsPage';
import AdminCommissionPage from './pages/admin/AdminCommissionPage';
import AdminGoalsPage from './pages/admin/AdminGoalsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import SellerSalesPage from './pages/seller/SellerSalesPage';
import SellerClientsPage from './pages/seller/SellerClientsPage';
import SellerCommissionsPage from './pages/seller/SellerCommissionsPage';
import SellerGoalsPage from './pages/seller/SellerGoalsPage';
import NotFoundPage from './pages/NotFoundPage';
import InboxPage from './pages/InboxPage';
import AdminInboxPage from './pages/admin/AdminInboxPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/adm/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="vendedores" element={<AdminSellersPage />} />
          <Route path="vendas" element={<AdminSalesPage />} />
          <Route path="clientes" element={<AdminClientsPage />} />
          <Route path="comissoes" element={<AdminCommissionPage />} />
          <Route path="relatorios" element={<AdminReportsPage />} />
          <Route path="metas" element={<AdminGoalsPage />} />
          <Route path="configuracoes" element={<AdminSettingsPage />} />
          <Route path="inbox" element={<AdminInboxPage />} />
        </Route>

        <Route
          path="/vendedor/*"
          element={
            <ProtectedRoute allowedRoles={['vendedor']}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboardPage />} />
          <Route path="minhas-vendas" element={<SellerSalesPage />} />
          <Route path="clientes" element={<SellerClientsPage />} />
          <Route path="comissoes" element={<SellerCommissionsPage />} />
          <Route path="metas" element={<SellerGoalsPage />} />
          <Route path="inbox" element={<InboxPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
