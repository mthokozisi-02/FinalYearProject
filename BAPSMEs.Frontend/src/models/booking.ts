import { Buyer } from "./buyer";
import { Seller } from "./seller";
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
    seller_phone: string;
    seller_country: string;
    seller: Seller
    type: string;

    preferred_contact_method?: 'Whatsapp' | 'Email' | 'Call';
    payment_method?: 'Cash' | 'Swipe' | 'Credit Card' | 'Ecocash';
    booking_status?: 'Approved' | 'Pending' | 'Rejected';

    // Construction properties
    project_details?: string;
    property_address?: string;
    project_timeline?: string;
    payment_schedule?: string;

    // Insurance and Banking
    appointment_type?: 'Physical' | 'Online';

    // Property
    management_duration?: string;

    // Food and Beverage
    number_of_people?: number;
    special_request?: string;
    dietary_requirements?: string;
    table_preferences?: string;

    // Retail
    quantity?: number;
    size?: string;
    style?: string;
    shipping_options?: 'Delivery' | 'Pickup';

    // Services
    address?: string;
    equipment_requirements?: string;
    service_duration?: string;
    location_type?: 'High Density' | 'Medium Density' | 'Low Density';
    special_instructions?: string;

    // Professional Services
    project_scope?: string;
    required_documentation?: string;
    timeline_requirements?: string;

    // Creative Services
    project_type?: string;
    deliverable_format?: string;
    revision_requirements?: string;
    style_preference?: string;

    // Education
    skill_level?: string;
    schedule_requirements?: string;
    class_size?: number;
    prerequisites?: string;

    // Automotive
    vehicle_information?: string;
    service_type?: string;
    preferred_date?: Date;
    preferred_time?: string;

    // Home Improvement
    property_type?: string;
    budget_range?: string;

    // Entertainment
    number_of_guests?: number;
    event_type?: string;
    duration?: string;
    special_requirements?: string;

    // Additional Properties
    additional_information?: string;
}
