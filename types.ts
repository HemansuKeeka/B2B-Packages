export interface Profile {
  id: string;
  full_name: string;
  email: string;
  contact_number?: string;
  business_name?: string;
  business_address?: string;
  business_website?: string;
  linkedin_page?: string;
  business_registration_number?: string;
  stripe_customer_id?: string;
  created_at: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  price: number;
  stripe_payment_link: string;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  package_id: string;
  stripe_checkout_session_id?: string;
  stripe_payment_intent_id?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  package?: Package; // Joined data for UI
}