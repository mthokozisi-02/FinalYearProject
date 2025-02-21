import { Enquire } from './enquire';
import { Pivot } from './pivot';
import { Ratings } from './ratings';
import { SubCategory } from './sub-category';

export interface Products {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  amount: number;
  pivot: Pivot;
  image_url: any;
  image_url2: any;
  image_url3: any;
  similarity: number
  sub_category_id: number;
  subcategory: SubCategory;
  sub_category_name: string;
  user_id: number;
  business_name: string;
  created_at: Date;
  updated_at: Date;
  seller_id: number;
  seller_name: string
  total_amount: number;
  avgRating: number;
  bookable: string;
  unRoundedAvgRating: number;
  noOfRatings: number;
  location: string;
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
  totalStars: number;
  ratings: Ratings[];
  enquiries: Enquire[];

  status: 'Active' | 'Inactive' | 'Pending';  // Enum with default 'Active'

  // Service Type Details
  service_type: 'Product' | 'Service';          // Enum with default 'Service'
  preparation_time?: number;                    // Nullable decimal
  minimum_order: number;                       // Integer with default 0
  delivery_options?: string;                   // Nullable
  dietary_information?: string;                // Nullable

  // Product Type Details
  product_type: 'Physical' | 'Digital';         // Enum with default 'Physical'
  inventory_status: 'Available' | 'Out of Stock'; // Enum with default 'Available'
  shipping_options?: string;                   // Nullable
  return_policy: 'Return' | 'Exchange Terms';   // Enum with default 'Return'
  warranty_information?: string;               // Nullable

  // Service Details
  service_duration: number;                    // Integer with default 0
  appointment: 'yes' | 'no';                   // Enum with default 'no'
  location_type: 'On-Site' | 'Off-Site' | 'Virtual'; // Enum with default 'On-Site'
  service_area?: string;                       // Nullable
  qualification?: string;                      // Nullable
  expertise_level: 'Beginner' | 'Intermediate' | 'Advanced'; // Enum with default 'Beginner'
  session_format: 'Individual' | 'Group';      // Enum with default 'Individual'
  language_support?: string;                   // Nullable
  certifications?: string;                     // Nullable
  experience_level?: number;                   // Nullable integer

  // Project Type Details
  project_type?: string;                       // Nullable
  turnaround_time?: string;                    // Nullable
  revisions_included?: string;                 // Nullable
  file_formats?: string;                       // Nullable
  usage_rights?: string;                       // Nullable

  // Course Format Details
  course_format: 'Online' | 'In-person';       // Enum with default 'Online'
  class_size: number;                          // Integer with default 0
  materials_included?: string;                 // Nullable
  prerequisites?: string;                      // Nullable
  vehicle_type?: string;                       // Nullable

  // Parts & Vehicle Details
  parts_included?: string;                     // Nullable
  loaner_vehicle?: string;                     // Nullable
  project_scope?: string;                      // Nullable
  license_number?: string;                     // Nullable
  insurance_coverage?: string;                  // Nullable

  // Additional Details
  permit_handling?: string;                    // Nullable
  warranty_period?: string;                    // Nullable
  capacity: number;                            // Integer with default 0
  age_restriction: number;                     // Integer with default 0
  equipment_provided?: string;                 // Nullable
  catering_options?: string;                   // Nullable
  parking_availability?: string;               // Nullable

  // Construction Details
  cons_project_type: 'New Build' | 'Renovation' | 'Repair'; // Enum with default 'New Build'
  service_scope: 'Full Project Management' | 'Consultation-only'; // Enum with default 'Full Project Management'
  payment_term: 'Milestone-based' | 'Progressive'; // Enum with default 'Milestone-based'

  // Insurance Details
  coverage_type: 'Property' | 'Liability' | 'Life'; // Enum with default 'Property'
  policy_term?: string;                        // Nullable
  premium_frequency?: string;                  // Nullable
  deductible_amount?: number;                  // Nullable decimal
  coverage_limit?: number;                     // Nullable decimal

  // Account Details
  account_type: 'Personal' | 'Business' | 'investment'; // Enum with default 'Personal'
  minimum_balance?: number;                    // Nullable decimal
  interest_rate?: number;                      // Nullable decimal
  fees?: number;                               // Nullable decimal
  transaction_limit?: number;                  // Nullable decimal
  property_types?: string;                     // Nullable
  service_level: 'Full' | 'Partial Management' | 'Basic' | 'Standard' | 'Premium'; // Enum with default 'Full'
  management_fee: 'Percentage' | 'Flat Rate';  // Enum with default 'Percentage'
  response_time?: string;
  geographic_area?: string;
}
