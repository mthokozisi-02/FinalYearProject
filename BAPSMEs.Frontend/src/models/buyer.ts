import { Country } from '../app/tools/models/country';
import { User } from './user';

export interface Buyer {
  id: number;
  name: string;
  email: string;
  user_id: number;
  password: string;
  password_confirmation: string;
  id_number: string;
  country: Country;
  phone: string;
  user: User;
  address: string;
  profile_pic: any;
  created_at: Date;
  updated_at: Date;
}
