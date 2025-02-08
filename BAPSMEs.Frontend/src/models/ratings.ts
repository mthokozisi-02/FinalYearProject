import { User } from "./user";

export interface Ratings {
    id: number;
    product_id: number;
    user_id: number;
    user_name: string;
    user: User;
    rating: number;
    comment: string;
    image_url1: any;
    image_url2: any;
    created_at: Date;
    updated_at: Date;
}
