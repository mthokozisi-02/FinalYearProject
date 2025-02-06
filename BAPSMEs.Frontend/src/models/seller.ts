import { Country } from '../app/tools/models/country';
import { BankDetails } from './bank-details';
import { User } from './user';

export interface Seller {
  id: number;
  user_id: number;
  id_number: number;
  country: Country;
  business_name: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  user: User;
  email: string;
  role: string;
  password: string;
  password_confirmation: string;
  bank_details: BankDetails;
  bank: string;
  account_number: string;
  branch: string;
  branch_code: string;
}
