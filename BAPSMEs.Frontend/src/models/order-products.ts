import { Products } from "./products"

export interface OrderProducts {
    id: number,
    order_id: number,
    product_id: number,
    product: Products,
    quantity: number,
    price: number,
    created_at: Date,
    updated_at: Date
}
