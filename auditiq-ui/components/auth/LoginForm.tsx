'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/stores/authStore';
import { getDefaultRedirect } from '@/lib/utils/permissions';
import { apiClient } from '@/lib/api/client';
import type { LoginResponse } from '@/lib/types/auth';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // 1. Login to backend (returns tokens in snake_case)
      const loginRes = await apiClient.post('/auth/login', data);
      const tokenData = loginRes.data;
      const accessToken = tokenData.access_token || tokenData.accessToken;
      const refreshToken = tokenData.refresh_token || tokenData.refreshToken;

      if (!accessToken) {
        throw new Error('No access token received');
      }

      // 2. Fetch full user profile using the new token (temporarily set for interceptor)
      const meRes = await apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = meRes.data;

      // 3. Set tokens in store (camelCase for UI)
      login(user, { accessToken, refreshToken });

      // 4. Set httpOnly cookies via Next.js proxy for middleware auth
      try {
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken, refreshToken }),
        });
      } catch (cookieErr) {
        console.warn('Cookie proxy failed (middleware may not protect SSR):', cookieErr);
      }

      toast.success('Login successful');

      const redirectPath = getDefaultRedirect(user.role || 'analyst');
      router.push(redirectPath);
    } catch (error: any) {
      const msg = error?.response?.data?.detail?.message || 'Invalid username or password';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-[--text-secondary]">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="admin"
          {...register('username')}
          className="bg-[--surface] border-[--border] text-[--text-primary] placeholder:text-[--text-tertiary]"
        />
        {errors.username && (
          <p className="text-sm text-[--error]">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-[--text-secondary]">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register('password')}
          className="bg-[--surface] border-[--border] text-[--text-primary] placeholder:text-[--text-tertiary]"
        />
        {errors.password && (
          <p className="text-sm text-[--error]">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[--accent] hover:bg-[--accent-hover] text-[--background] font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
}
