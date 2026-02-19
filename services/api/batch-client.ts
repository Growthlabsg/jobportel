/**
 * Batch API Client
 * Allows batching multiple API requests into a single HTTP request
 * Reduces network overhead and improves performance
 */

import { enhancedRequest, enhancedApiClient } from './enhanced-client';
import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export interface BatchRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

export interface BatchResponse {
  id: string;
  status: number;
  data?: any;
  error?: {
    message: string;
    code?: string;
  };
}

export interface BatchRequestResult {
  responses: BatchResponse[];
  errors?: BatchResponse[];
}

interface QueuedBatchRequest extends BatchRequest {
  resolve: (value: BatchResponse) => void;
  reject: (error: any) => void;
}

class BatchRequestManager {
  private batchQueue: QueuedBatchRequest[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = 50; // Wait 50ms to collect requests
  private readonly MAX_BATCH_SIZE = 20; // Max requests per batch

  async addToBatch(request: BatchRequest): Promise<BatchResponse> {
    return new Promise((resolve, reject) => {
      const queuedRequest: QueuedBatchRequest = {
        ...request,
        id: request.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        resolve,
        reject,
      };

      this.batchQueue.push(queuedRequest);

      // Clear existing timer
      if (this.batchTimer) {
        clearTimeout(this.batchTimer);
      }

      // Process batch if it's full
      if (this.batchQueue.length >= this.MAX_BATCH_SIZE) {
        this.processBatch();
        return;
      }

      // Set timer to process batch after delay
      this.batchTimer = setTimeout(() => {
        this.processBatch();
      }, this.BATCH_DELAY);
    });
  }

  private async processBatch() {
    if (this.batchQueue.length === 0) return;

    const batch = this.batchQueue.splice(0, this.MAX_BATCH_SIZE);
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    try {
      const batchRequests: BatchRequest[] = batch.map(({ resolve, reject, ...request }) => request);
      const responses = await this.executeBatch(batchRequests);
      
      // Resolve individual promises
      batch.forEach((queuedRequest, index) => {
        const response = responses[index] || {
          id: queuedRequest.id,
          status: 500,
          error: { message: 'No response received' },
        };
        queuedRequest.resolve(response);
      });
    } catch (error) {
      // Reject all requests in batch
      batch.forEach((queuedRequest) => {
        queuedRequest.reject(error);
      });
    }
  }

  private async executeBatch(requests: BatchRequest[]): Promise<BatchResponse[]> {
    // Check if backend supports batch endpoint
    const batchEndpoint = '/batch';
    
    try {
      const response = await enhancedApiClient.post<BatchRequestResult>(
        batchEndpoint,
        { requests },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Batch-Request': 'true',
          },
        }
      );

      return response.data.responses || [];
    } catch (error) {
      // Fallback: execute requests individually in parallel
      return Promise.all(
        requests.map(async (request) => {
          try {
            const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
            const API_BASE_URL = `${MAIN_PLATFORM_BASE_URL}/api`;
            
            const url = request.url.startsWith('http') ? request.url : `${API_BASE_URL}${request.url}`;
            
            const response = await enhancedApiClient.request({
              method: request.method.toLowerCase() as any,
              url,
              params: request.params,
              data: request.data,
              headers: request.headers as any,
            });

            return {
              id: request.id,
              status: response.status,
              data: response.data,
            };
          } catch (err: any) {
            return {
              id: request.id,
              status: err.response?.status || 500,
              error: {
                message: err.message || 'Request failed',
                code: err.code,
              },
            };
          }
        })
      );
    }
  }
}

const batchManager = new BatchRequestManager();

/**
 * Execute a batch of API requests
 */
export async function batchRequest(requests: BatchRequest[]): Promise<BatchRequestResult> {
  const responses = await Promise.all(
    requests.map((request) => batchManager.addToBatch(request))
  );

  const successful: BatchResponse[] = [];
  const errors: BatchResponse[] = [];

  responses.forEach((response) => {
    if (response.status >= 200 && response.status < 300) {
      successful.push(response);
    } else {
      errors.push(response);
    }
  });

  return {
    responses: successful,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Add a single request to the batch queue
 */
export async function addToBatch(request: BatchRequest): Promise<BatchResponse> {
  return batchManager.addToBatch(request);
}

