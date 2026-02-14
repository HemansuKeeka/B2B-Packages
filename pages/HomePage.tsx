import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase.ts';
import { Package } from '../types.ts';

const HomePage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching packages:', error);
      } else {
        setPackages(data || []);
      }
      setLoading(false);
    };

    fetchPackages();
  }, []);

  const handleBuyNow = async (pkg: Package) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('Redirecting to Stripe for:', pkg.title);
      
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          package_id: pkg.id,
          stripe_checkout_session_id: `sim_sess_${Date.now()}`,
          status: 'pending'
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;
      
      alert(`Simulating Stripe Checkout for ${pkg.title}...`);
      
      setTimeout(async () => {
        await supabase
          .from('purchases')
          .update({ status: 'completed', stripe_payment_intent_id: `pi_sim_${Date.now()}` })
          .eq('id', purchaseData.id);
        
        window.location.hash = '#/success';
      }, 1500);

    } catch (err) {
      console.error('Purchase failed:', err);
      alert('Failed to initiate purchase. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Available Business Packages</h1>
        <p className="mt-2 text-gray-600 text-lg">Choose the right package to scale your operations.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-8 flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{pkg.description}</p>
              
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Benefits</h4>
                <ul className="space-y-2">
                  {pkg.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-8 pt-0 mt-auto bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                <span className="text-gray-500 text-sm">One-time payment</span>
              </div>
              <button
                onClick={() => handleBuyNow(pkg)}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-100"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;