import { Buyer } from "./buyer";
import { User } from "./user";

export interface Booking {
    id?: number; // Optional for new entries
    user_id: number;
    sub_category_id: number;
    sub_category_name: number;
    product_id: number;
    product_name: number;
    seller_id?: number | null; // Nullable
    total_price: number;
    quantity: number;
    location?: string | null;
    payment?: string | null;
    message: string;
    date?: string | null; // Date in ISO format
    time?: string | null; // Time as a string (HH:mm:ss)
    received: 'true' | 'false'; // Enum as a string
    created_at?: string; // Timestamp as ISO string
    updated_at?: string; // Timestamp as ISO string
    buyer_name: string;
    buyer_email: string;
    buyer_pic: any;
    seller_name: string;
    seller_email: string;
    seller_pic: any;
    buyer_phone: string;
    buyer_country: string;
    buyer: Buyer;
    user: User
}
