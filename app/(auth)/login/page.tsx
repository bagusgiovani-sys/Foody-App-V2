'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { AuthTabs } from '@/features/auth/components/AuthTabs';
import { useLogin } from '@/features/auth/hooks/useAuth';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const onSubmit = (data: LoginForm) => {
    login({ email: data.email, password: data.password });
  };

  const apiError = error
    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Login failed'
    : null;

  return (
    <div className="min-h-screen flex">
      {/* Left — food image (desktop only) */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/food-hero.jpg')" }}
        aria-hidden="true"
      >
        <div className="w-full h-full bg-gradient-to-br from-amber-900/60 to-stone-900/80" />
      </div>

      {/* Right — form panel */}
      <div className="flex-1 min-h-screen bg-[#3c3c3c] lg:bg-white flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-sm bg-white rounded-2xl p-8 lg:rounded-none lg:p-0">
          <AuthHeader />
          <AuthTabs activeTab="signin" />

          {apiError && (
            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                {...register('rememberMe')}
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 accent-red-600"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">Remember Me</label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-full transition-colors"
            >
              {isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
