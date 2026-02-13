export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'customer' | 'employee';
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface UserResponse {
    status: string;
    message: string;
    data: {
        users: User[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    };
}

export interface SingleUserResponse {
    status: string;
    message: string;
    data: User;
}
