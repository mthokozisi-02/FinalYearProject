import { Package } from "./package";

export interface UserPackage {
    user_id: number,
    package_id: number,
    created_at: Date,
    updated_at: Date,
    package: Package
}
