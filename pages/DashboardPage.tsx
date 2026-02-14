import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase.ts';
import { Purchase } from '../types.ts';

const DashboardPage: React.FC = () => {
  const [purchasedPackages, setPurchasedPackages] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          package:packages(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching dashboard:', error);
      } else {
        setPurchasedPackages(data || []);
      }
      setLoading(false);
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return <div className="p-12 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Active Packages</h1>
      
      {purchasedPackages.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 text-lg">You haven't purchased any packages yet.</p>
          <a href="#/home" className="mt-4 inline-block text-indigo-600 font-semibold">Browse available packages &rarr;</a>
        </div>
      ) : (
        <div className="space-y-6">
          {purchasedPackages.map((purchase) => (
            <div key={purchase.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{purchase.package?.title}</h3>
                  <p className="text-gray-600 mt-1">{purchase.package?.description}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full uppercase">
                  Active
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-sm text-gray-500">
                <span>Purchased on {new Date(purchase.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;