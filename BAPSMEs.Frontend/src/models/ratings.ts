import { User } from "./user";

export interface Ratings {
    id: number;
    product_id: number;
    user_id: number;
    user: User;
    rating: number;
    comment: string;
}
