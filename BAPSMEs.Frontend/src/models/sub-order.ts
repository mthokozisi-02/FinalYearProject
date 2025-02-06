import { Status } from '../app/tools/models/status';
import { Buyer } from './buyer';
import { OrderProducts } from './order-products';
import { Products } from './products';
import { Seller } from './seller';

export interface SubOrder {
  id: number;
  order_id: number;
  buyer: Buyer
  buyer_id: number;
  buyer_name: string;
  buyer_pic: any;
  buyer_email: string;
  total_quantity: number;
  seller: Seller
  seller_id: number;
  total_price: number;
  status: Status;
  created_at: Date;
  update_at: Date;
  order_products: OrderProducts[];
  products: Products[]
}
