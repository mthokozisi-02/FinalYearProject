import { Buyer } from "./buyer";

export interface Enquire {
    id?: number; // Optional for new entries
    user_id: number;
    sub_category_id: number;
    sub_category_name: number;
    product_id: number;
    product_name: number;
    seller_id?: number | null; // Nullable
    total_price: number;
    quantity: number;
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
    buyer_phone: string;
    buyer_country: string;
    buyer: Buyer

    preferred_contact_method?: 'Whatsapp' | 'Email' | 'Call';
    payment_method?: 'Cash' | 'Swipe' | 'Credit Card' | 'Ecocash';
    enquiry_type?: 'General' | 'Specific Service';
    urgency_level?: 'Very Urgent' | 'Not Urgent';
    additional_information?: string;
    preferred_time?: string;
    preferred_date?: string;

    // Construction fields
    project_details?: string;
    payment_schedule?: string;

    // Insurance and Banking fields
    preferred_location?: string;
    insurance_type?: 'Life' | 'Property';

    // Common service fields
    service_interest?: string;
    account_requirements?: string;
    transaction_requirements?: string;
    documentation_needed?: string;

    // Property fields
    management_duration?: string;

    // Food and Beverage fields
    cuisine_preference?: string;
    budget_range?: string;
    special_occasion_details?: string;

    // Retail fields
    price_range?: string;
    availability_requirements?: string;
    customization_needs?: string;

    // Services fields
    service_requirements?: string;

    // Creative Service fields
    style_references?: string;

    // Education fields
    area_of_interest?: string;
    experience_level?: string;
    learning_goals?: string;

    // Automotive fields
    vehicle_information?: string;
    serviceType_interest?: string;
    preferred_time_frame?: string;

    // Home fields
    project_type?: string;
    property_information?: string;

    // Entertainment fields
    event_type?: string;
    guest_information?: string;
    special_requirements?: string;
}
