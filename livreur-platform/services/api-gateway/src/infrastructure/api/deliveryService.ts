import { Delivery, DeliveryTracking } from "../../domain/models/delivery.model";
import { httpClient } from "./httpClient";

export interface CreateDeliveryDto {
  clientId: string;
  addresses: Array<{
    street: string;
    city: string;
    postalCode: string;
    country: string;
    formatted?: string;
    coordinates?: { lat: number; lng: number };
  }>;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  packageInfo?: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  timeWindow?: {
    start: Date;
    end: Date;
  };
  notes?: string;
}

export interface UpdateDeliveryDto extends Partial<CreateDeliveryDto> {
  status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";
}

export interface AssignDeliveryDto {
  livreurId: string;
}

export interface UpdateStatusDto {
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";
  notes?: string;
}

class DeliveryApiService {
  private basePath = "/deliveries";

  async getDeliveries(params?: {
    status?: string;
    livreurId?: string;
    clientId?: string;
  }): Promise<Delivery[]> {
    return httpClient.get<Delivery[]>(this.basePath, { params });
  }

  async getDeliveryById(id: string): Promise<Delivery> {
    return httpClient.get<Delivery>(`${this.basePath}/${id}`);
  }

  async createDelivery(data: CreateDeliveryDto): Promise<Delivery> {
    return httpClient.post<Delivery>(this.basePath, data);
  }

  async updateDelivery(id: string, data: UpdateDeliveryDto): Promise<Delivery> {
    return httpClient.put<Delivery>(`${this.basePath}/${id}`, data);
  }

  async deleteDelivery(id: string): Promise<void> {
    return httpClient.delete(`${this.basePath}/${id}`);
  }

  async assignDelivery(id: string, data: AssignDeliveryDto): Promise<Delivery> {
    return httpClient.post<Delivery>(`${this.basePath}/${id}/assign`, data);
  }

  async updateDeliveryStatus(
    id: string,
    data: UpdateStatusDto
  ): Promise<Delivery> {
    return httpClient.patch<Delivery>(`${this.basePath}/${id}/status`, data);
  }

  async trackDelivery(id: string): Promise<DeliveryTracking> {
    return httpClient.get<DeliveryTracking>(`${this.basePath}/${id}/track`);
  }

  async getLivreurDeliveries(livreurId: string): Promise<Delivery[]> {
    return httpClient.get<Delivery[]>(`/livreurs/${livreurId}/deliveries`);
  }
}

export const deliveryApiService = new DeliveryApiService();
