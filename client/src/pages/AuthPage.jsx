import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Left side (image) */}
      <div
        className="hidden md:flex items-center justify-center w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(./images/authbg.jpg)' }}
      >
      </div>

      {/* Right side (form) */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2">
        <h1 className='font-black text-3xl'>Welcome to your</h1>
        <h1 className='font-black text-3xl mb-10'>favorite note taking app!</h1>
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          {isLogin ? <LoginForm toggleForm={toggleForm} /> : <RegisterForm toggleForm={toggleForm} />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
