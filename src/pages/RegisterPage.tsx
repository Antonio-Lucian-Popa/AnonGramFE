/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { register as registerUser } from '../services/auth';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  alias: string; // Added alias property
}


export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateAlias = (): string => {
    const adjectives = [
      'Anon', 'Silent', 'Hidden', 'Ghost', 'Mysterious', 'Shadow', 'Quiet', 'Secret', 'Invisible', 'Masked'
    ];
    const animals = [
      'Fox', 'Owl', 'Wolf', 'Bear', 'Tiger', 'Falcon', 'Raven', 'Eagle', 'Hawk', 'Panther'
    ];
    const randomFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const number = Math.floor(1000 + Math.random() * 9000); // 4 digits: 1000–9999
    const alias = `${randomFrom(adjectives)}${randomFrom(animals)}${number}`;
    return alias;
  };
  
  const generatedAlias = useMemo(() => generateAlias(), []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      alias: generatedAlias
    },
  });

  const password = watch('password');


  const onSubmit = async (data: FormValues) => {
    setError(null);
    setLoading(true);

    try {
      const { confirmPassword, ...userData } = data;

      await registerUser({
        ...userData,
        alias: generatedAlias, // 🧠 auto-generated
        userRole: 'USER',
      });

      navigate('/login', {
        state: { message: 'Registration successful! Please login.' }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-center text-white mb-6">
              Create an Account
            </h1>

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="your.email@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={errors.password?.message}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                error={errors.confirmPassword?.message}
              />

              <Input
                label="Your Alias"
                placeholder="Anon123"
                disabled
                {...register('alias')}
                className="bg-gray-900 text-white cursor-not-allowed opacity-70"
              />


              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
                fullWidth
              >
                Register
              </Button>
            </form>

            <p className="mt-6 text-center text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};