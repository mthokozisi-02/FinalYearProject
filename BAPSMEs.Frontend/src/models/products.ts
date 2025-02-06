import { Pivot } from './pivot';
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
  sub_category_id: number;
  subcategory: SubCategory;
  sub_category_name: string;
  user_id: number;
  business_name: string;
  created_at: Date;
  updated_at: Date;
  seller_id: number;
  seller_name: string
  total_amount: number
}
