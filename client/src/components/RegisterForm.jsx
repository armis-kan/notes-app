import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { setToken } from '../services/tokenService';

const RegisterForm = ({ toggleForm }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword, terms } = form;

    if (!terms) {
      toast.error('Please agree to the terms');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, { username, password });

      if (response.status === 200) {
        toast.success('Registered successfully');

        const token = response.data.token;
        setToken(token);

        navigate('/dashboard');
      } else {
        toast.error('An error occurred');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create an account</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-900">
            Your username
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            placeholder="josh"
            required
            onChange={handleChange}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            placeholder="••••••••"
            required
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-900">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            placeholder="••••••••"
            required
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 border rounded mr-2 focus:ring-2 focus:ring-primary-600"
              onChange={handleChange}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Agree to Terms
            </label>
          </div>
          <button type="button" className="text-sm text-primary-600 hover:underline" onClick={toggleForm}>
            Log in
          </button>
        </div>
        <button
          type="submit"
          className="w-full text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all ease-in-out duration-200"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="w-5 h-5 mx-auto text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
