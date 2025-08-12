import React, { useState } from 'react';
import { MailIcon, LockClosedIcon, UserIcon } from './/icons';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

const InputField = ({ id, type, placeholder, icon: Icon, required = true }) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      className="block w-full rounded-md border-0 bg-white/5 py-2 pl-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
      placeholder={placeholder}
    />
  </div>
);

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate and call an API.
    // For this demo, we'll just log in the user.
    onLoginSuccess();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          {isRegister ? 'Create an Account' : 'Security Tools'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isRegister ? 'Join us to access our network tools.' : 'Sign in to continue.'}
        </p>
      </header>

      <div className="bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegister && (
            <InputField id="name" type="text" placeholder="Full Name" icon={UserIcon} />
          )}

          <InputField id="email" type="email" placeholder="Email address" icon={MailIcon} />
          <InputField id="password" type="password" placeholder="Password" icon={LockClosedIcon} />

          {isRegister && (
            <InputField id="confirm-password" type="password" placeholder="Confirm Password" icon={LockClosedIcon} />
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-200"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          {isRegister ? 'Already a member?' : "Not a member?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-semibold leading-6 text-blue-400 hover:text-blue-300"
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};
