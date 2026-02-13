export interface Service {
    id: number;
    name: string;
    description: string;
    unit: string;
    price: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface ServiceResponse {
    status: string;
    message: string;
    data: {
        services: Service[];
        meta: {
            total: number;
            page: number;
            limit: number;
            last_page: number;
        };
    };
}

export interface SingleServiceResponse {
    status: string;
    message: string;
    data: Service;
}
