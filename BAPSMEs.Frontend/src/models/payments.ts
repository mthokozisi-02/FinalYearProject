import { PaymentStatus } from "../app/tools/models/payment";
import { Buyer } from "./buyer";
import { SubOrder } from "./sub-order";
import { Subscription } from "./subscription";

export interface Payments {
    id: number;
    order_id: number;
    order: SubOrder
    seller_id: number
    seller_name: string
    buyer_id: number;
    buyer_name: string;
    buyer_pic: any;
    buyer_email: string;
    amount: number;
    payment_method: string;
    transaction_id: string;
    status: PaymentStatus;
    created_at: Date;
    update_at: Date;
    subscription: Subscription
    buyer: Buyer
}
