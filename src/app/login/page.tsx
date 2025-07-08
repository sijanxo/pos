'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, AlertCircle } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardContent } from '@/components/shared';
import { useAuthStore } from '@/stores/authStore';

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/sales');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page min-h-screen bg-background flex-center p-4">
      <div className="login-container w-full max-w-md">
        <Card variant="elevated" padding="lg">
          <CardHeader className="text-center">
            <div className="login-logo mb-4">
              <div className="logo-icon w-16 h-16 bg-primary rounded-full flex-center mx-auto mb-3">
                <User size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text">
                Premium Liquor Store
              </h1>
              <p className="text-muted mt-1">Point of Sale System</p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="error-message bg-error bg-opacity-10 border border-error text-error p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <Input
                type="text"
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                leftIcon={<User size={20} />}
                fullWidth
                disabled={isLoading}
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={20} />}
                fullWidth
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="demo-credentials mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-text mb-2">Demo Credentials:</h3>
              <div className="space-y-1 text-sm text-muted">
                <div><strong>Admin:</strong> admin / admin</div>
                <div><strong>Manager:</strong> manager / manager</div>
                <div><strong>Cashier:</strong> cashier1 / cashier1</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
