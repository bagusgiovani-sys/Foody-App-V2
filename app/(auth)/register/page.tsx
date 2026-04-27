'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { AuthTabs } from '@/features/auth/components/AuthTabs';
import { useRegister } from '@/features/auth/hooks/useAuth';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    phone: z.string().min(1, 'Phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: register, isPending, error } = useRegister();

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  const onSubmit = ({ name, email, phone, password }: RegisterForm) => {
    register({ name, email, phone, password });
  };

  const apiError = error
    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Registration failed'
    : null;

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/food-hero.jpg')" }}
        aria-hidden="true"
      >
        <div className="w-full h-full bg-gradient-to-br from-amber-900/60 to-stone-900/80" />
      </div>

      <div className="flex-1 min-h-screen bg-[#3c3c3c] lg:bg-white flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-sm bg-white rounded-2xl p-8 lg:rounded-none lg:p-0">
          <AuthHeader />
          <AuthTabs activeTab="signup" />

          {apiError && (
            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {(
              [
                { name: 'name', placeholder: 'Name', type: 'text', autoComplete: 'name' },
                { name: 'email', placeholder: 'Email', type: 'email', autoComplete: 'email' },
                { name: 'phone', placeholder: 'Number Phone', type: 'tel', autoComplete: 'tel' },
              ] as const
            ).map(({ name, placeholder, type, autoComplete }) => (
              <div key={name}>
                <input
                  {...field(name)}
                  type={type}
                  placeholder={placeholder}
                  aria-label={placeholder}
                  autoComplete={autoComplete}
                  aria-invalid={!!errors[name]}
                  aria-describedby={errors[name] ? `${name}-error` : undefined}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                {errors[name] && (
                  <p id={`${name}-error`} className="mt-1 text-xs text-red-600">{errors[name]?.message}</p>
                )}
              </div>
            ))}

            {(
              [
                { name: 'password', placeholder: 'Password', show: showPassword, toggle: () => setShowPassword((v) => !v), autoComplete: 'new-password' },
                { name: 'confirmPassword', placeholder: 'Confirm Password', show: showConfirm, toggle: () => setShowConfirm((v) => !v), autoComplete: 'new-password' },
              ] as const
            ).map(({ name, placeholder, show, toggle, autoComplete }) => (
              <div key={name}>
                <div className="relative">
                  <input
                    {...field(name)}
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    autoComplete={autoComplete}
                    aria-invalid={!!errors[name]}
                    aria-describedby={errors[name] ? `${name}-error` : undefined}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label={show ? `Hide ${placeholder.toLowerCase()}` : `Show ${placeholder.toLowerCase()}`}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors[name] && (
                  <p id={`${name}-error`} className="mt-1 text-xs text-red-600">{errors[name]?.message}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-full transition-colors"
            >
              {isPending ? 'Creating account...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
