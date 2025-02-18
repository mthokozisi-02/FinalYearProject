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
  ratings: Ratings[]
  enquiries: Enquire[]
}
