'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/public/MathosimLogo1.png';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Role = 'user' | 'admin' | '';

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
};

type TextFieldKey = keyof Pick<
  FormData,
  'username' | 'email' | 'password' | 'confirmPassword'
>;

const textFields: Array<{
  key: TextFieldKey;
  label: string;
  type: string;
}> = [
  { key: 'username', label: 'Username', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'password', label: 'Password', type: 'password' },
  { key: 'confirmPassword', label: 'Confirm Password', type: 'password' },
];

export default function RegisterForm() {
  const [form, setForm] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.role
    ) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      /** 1️⃣ Register user */
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              username: form.username,
            },
          },
        });

      if (signUpError) {
        toast.error(signUpError.message);
        return;
      }

      const user = data.user;
      if (!user) {
        toast.error('Sign-up failed.');
        return;
      }

      /** 2️⃣ Update profile */
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: form.role,
          email: form.email,
          username: form.username,
        })
        .eq('id', user.id);

      if (profileError) {
        toast.error('Failed to update user profile.');
        return;
      }

      toast.success('Account created successfully!');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="MathosimLogo"
            src={Logo}
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Create your Mathosim Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {textFields.map(({ key, label, type }) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-900"
                >
                  {label}
                </label>
                <input
                  id={key}
                  name={key}
                  type={type}
                  required
                  value={form[key]}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[#e2fe4f] sm:text-sm"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-900"
              >
                Select Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={form.role}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[#e2fe4f] sm:text-sm"
              >
                <option value="">Choose a role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <p className="text-black text-sm">
              Already have an account?{' '}
              <Link href="/" className="text-[#e2fe4f] font-semibold">
                Login
              </Link>
            </p>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full rounded-md bg-[#00483d] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e2fe4f] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2fe4f]"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
