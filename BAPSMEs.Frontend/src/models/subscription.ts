import { UserPackage } from "./user-package";

export interface Subscription {
    id: number;
    user_package_id: number;
    user_package: UserPackage;
    start_date: Date;
    end_date: Date;
    created_at: Date;
    updated_at: Date;
}
