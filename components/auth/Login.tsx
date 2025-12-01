'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Logo from '@/public/MathosimLogo.png';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EyeIcon, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Invalid credentials');
      setLoading(false);
      return;
    }

    toast.success('Successfully logged in!');
    router.push('/dashboard');
  };

  const handleResetPassword = async () => {
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });

    if (res.ok) {
      alert('Password reset successful');
      setShowModal(false);
    } else {
      const err = await res.json();
      toast.error('Error: ' + err.message);
    }
  };

  return (
    <div className='h-screen'>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image alt="MathosimLogo" src={Logo} className="mx-auto h-10 w-auto" />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to Mathosim Management
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[#e2fe4f] sm:text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="font-semibold text-[#00483d] hover:text-[#e2fe4f] cursor-pointer">
                    Forgot password?
                  </button>
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[#e2fe4f] sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center cursor-pointer justify-center w-full rounded-md bg-[#00483d] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e2fe4f] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2fe4f]">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Modal for Reset Password */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Reset Password</h2>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mb-4 rounded-md px-3 py-2 border border-gray-300 focus:outline-[#e2fe4f]"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetPassword}
                    className="px-4 py-2 text-sm text-white bg-[#00483d] hover:bg-[#e2fe4f] hover:text-black rounded-md"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href="/signup" className="font-semibold text-[#00483d] hover:text-[#e2fe4f]">
              Request an invite
            </Link>
          </p>
        </div>
      </div>
  );
};

export default Login;

//1234@algindev *
//Algindev
//expandlygrowth@gmail.com