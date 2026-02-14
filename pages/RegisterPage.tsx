import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase.ts';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
    businessName: '',
    businessAddress: '',
    businessWebsite: '',
    linkedinPage: '',
    businessRegistrationNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          contact_number: formData.contactNumber,
          business_name: formData.businessName,
          business_address: formData.businessAddress,
          business_website: formData.businessWebsite,
          linkedin_page: formData.linkedinPage,
          business_registration_number: formData.businessRegistrationNumber,
        });

        if (profileError) {
          setError(`Profile creation failed: ${profileError.message}`);
          setLoading(false);
          return;
        }

        navigate('/home');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message === 'Failed to fetch' 
        ? 'Connection failed. Please verify your Supabase URL and network connection.' 
        : err.message || 'An unexpected error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-md">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create your business account</h2>
          <p className="mt-2 text-sm text-gray-600">Join our network of thriving businesses.</p>

          <form className="mt-10 space-y-4" onSubmit={handleRegister}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700">Full Name</label>
                <input name="fullName" required value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Email Address</label>
                <input name="email" type="email" required value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Password</label>
                <input name="password" type="password" required value={formData.password} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Contact Number</label>
                <input name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700">Business Name</label>
                <input name="businessName" required value={formData.businessName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700">Business Address</label>
                <input name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Business Website</label>
                <input name="businessWebsite" value={formData.businessWebsite} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">LinkedIn Page</label>
                <input name="linkedinPage" value={formData.linkedinPage} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700">Registration Number</label>
                <input name="businessRegistrationNumber" value={formData.businessRegistrationNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">Login</Link>
          </p>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-indigo-600 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">B2B Package Hub</h1>
          <p className="text-xl mb-8">Streamline your business growth with our curated service packages.</p>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start"><span className="mr-3 text-indigo-200">✓</span> Premium curated business services</li>
            <li className="flex items-start"><span className="mr-3 text-indigo-200">✓</span> Seamless Stripe checkout integration</li>
            <li className="flex items-start"><span className="mr-3 text-indigo-200">✓</span> Centralized dashboard for all purchases</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;