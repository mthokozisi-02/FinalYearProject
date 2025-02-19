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
  serviceType: 'Product' | 'Service';         // Enum with default 'Service'
  preparationTime?: number;                   // Nullable decimal
  minimumOrder: number;                       // Integer with default 0
  deliveryOptions?: string;                   // Nullable
  dietaryInformation?: string;                // Nullable

  // Product Type Details
  productType: 'Physical' | 'Digital';        // Enum with default 'Physical'
  inventoryStatus: 'Available' | 'Out of Stock'; // Enum with default 'Available'
  shippingOptions?: string;                   // Nullable
  returnPolicy: 'Return' | 'Exchange Terms';  // Enum with default 'Return'
  warrantyInformation?: string;               // Nullable

  // Service Details
  serviceDuration: number;                    // Integer with default 0
  appointment: 'yes' | 'no';                  // Enum with default 'no'
  locationType: 'On-Site' | 'Off-Site' | 'Virtual'; // Enum with default 'On-Site'
  serviceArea?: string;                       // Nullable
  qualification?: string;                      // Nullable

  expertiseLevel: 'Beginner' | 'Intermediate' | 'Advanced'; // Enum with default 'Beginner'
  sessionFormat: 'Individual' | 'Group';      // Enum with default 'Individual'
  languageSupport?: string;                    // Nullable
  certifications?: string;                     // Nullable
  experienceLevel?: number;                    // Nullable integer

  // Project Type Details
  projectType?: string;                       // Nullable
  turnaroundTime?: string;                     // Nullable
  revisionsIncluded?: string;                 // Nullable
  fileFormats?: string;                       // Nullable
  usageRights?: string;                       // Nullable

  // Course Format Details
  courseFormat: 'Online' | 'In-person';       // Enum with default 'Online'
  classSize: number;                          // Integer with default 0
  materialsIncluded?: string;                 // Nullable
  prerequisites?: string;                      // Nullable
  vehicleType?: string;                       // Nullable

  // Parts & Vehicle Details
  partsIncluded?: string;                     // Nullable
  loanerVehicle?: string;                     // Nullable
  projectScope?: string;                      // Nullable
  licenseNumber?: string;                     // Nullable
  insuranceCoverage?: string;                 // Nullable

  // Additional Details
  permitHandling?: string;                    // Nullable
  warrantyPeriod?: string;                    // Nullable
  capacity: number;                           // Integer with default 0
  ageRestriction: number;                     // Integer with default 0
  equipmentProvided?: string;                 // Nullable
  cateringOptions?: string;                   // Nullable
  parkingAvailability?: string;               // Nullable

  // Construction Details
  constructionProjectType: 'New Build' | 'Renovation' | 'Repair'; // Enum with default 'New Build'
  serviceScope: 'Full Project Management' | 'Consultation-only'; // Enum with default 'Full Project Management'
  paymentTerm: 'Milestone-based' | 'Progressive'; // Enum with default 'Milestone-based'

  // Insurance Details
  coverageType: 'Property' | 'Liability' | 'Life'; // Enum with default 'Property'
  policyTerm?: string;                        // Nullable
  premiumFrequency?: string;                  // Nullable
  deductibleAmount?: number;                  // Nullable decimal
  coverageLimit?: number;                     // Nullable decimal

  // Account Details
  accountType: 'Personal' | 'Business' | 'investment'; // Enum with default 'Personal'
  minimumBalance?: number;                    // Nullable decimal
  interestRate?: number;                      // Nullable decimal
  fees?: number;                              // Nullable decimal
  transactionLimit?: number;                  // Nullable decimal

  propertyTypes?: string;                     // Nullable
  serviceLevel: 'Full' | 'Partial Management' | 'Basic' | 'Standard' | 'Premium'; // Enum with default 'Full'
  managementFee: 'Percentage' | 'Flat Rate';  // Enum with default 'Percentage'
  responseTime?: string;
}
