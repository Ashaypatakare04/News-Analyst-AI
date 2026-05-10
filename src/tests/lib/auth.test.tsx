import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import React from 'react';

// Mock Component to test hook
const TestComponent = () => {
  const { user, isAdmin, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="admin-status">{isAdmin ? 'Admin' : 'User'}</div>
      <div data-testid="user-email">{user?.email || 'No Email'}</div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('Authentication Module (AuthProvider)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show unauthenticated state by default', async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('admin-status')).toHaveTextContent('User');
  });

  it('should show authenticated state when user is logged in', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(mockUser as any);
      return () => {};
    });

    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => false,
    } as any);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('admin-status')).toHaveTextContent('User');
    });
  });

  it('should set isAdmin to true if user is in admins collection', async () => {
    const mockUser = { uid: 'admin-123' };
    
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(mockUser as any);
      return () => {};
    });

    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
    } as any);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('admin-status')).toHaveTextContent('Admin');
    });
  });
});
