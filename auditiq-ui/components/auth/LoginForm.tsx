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
  email: z.string().email('Please enter a valid email address'),
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
      const response = await apiClient.post<LoginResponse>('/auth/login', data);
      const { user, tokens } = response.data;
      
      login(user, tokens);
      toast.success('Login successful');
      
      const redirectPath = getDefaultRedirect(user.role);
      router.push(redirectPath);
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[--text-secondary]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          {...register('email')}
          className="bg-[--surface] border-[--border] text-[--text-primary] placeholder:text-[--text-tertiary]"
        />
        {errors.email && (
          <p className="text-sm text-[--error]">{errors.email.message}</p>
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
