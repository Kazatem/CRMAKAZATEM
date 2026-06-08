import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

const renderWithAuth = (authValue: any) => {
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/vendedor/dashboard" element={<div>Vendedor Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe('ProtectedRoute', () => {
  it('renders child content when user has required role', () => {
    renderWithAuth({ isAuthenticated: true, user: { role: 'admin' }, login: vi.fn(), logout: vi.fn() });

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    renderWithAuth({ isAuthenticated: false, user: null, login: vi.fn(), logout: vi.fn() });

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to the vendedor dashboard when the user role is not authorized for admin-only route', () => {
    renderWithAuth({ isAuthenticated: true, user: { role: 'vendedor' }, login: vi.fn(), logout: vi.fn() });

    expect(screen.getByText('Vendedor Dashboard')).toBeInTheDocument();
  });
});
