/**
 * Background Job Queue System
 * 
 * This module provides a simple in-memory job queue for processing
 * background tasks like email notifications, webhook calls, etc.
 * 
 * For production, consider using BullMQ, Redis, or a cloud service
 * like AWS SQS, Cloudflare Queues, or Vercel Background Jobs.
 */

import { sendInquiryNotification, sendAccountCreationNotification } from '@/lib/email';
import { db } from '@/lib/db';

// Job types - only include implemented types
export type JobType = 'send-inquiry-email' | 'send-registration-email';

export interface BaseJob {
  id: string;
  type: JobType;
  createdAt: Date;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface InquiryEmailJob extends BaseJob {
  type: 'send-inquiry-email';
  data: {
    inquiryId: string;
    businessName: string;
    businessEmail: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    message: string;
    productName?: string;
  };
}

export interface RegistrationEmailJob extends BaseJob {
  type: 'send-registration-email';
  data: {
    name: string;
    email: string;
    password: string;
    accountType: 'business' | 'professional';
    loginUrl: string;
  };
}

export interface ProfessionalInquiryEmailJob extends BaseJob {
  type: 'send-professional-inquiry-email';
  data: {
    inquiryId: string;
    professionalName: string;
    professionalEmail: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    message: string;
    serviceName?: string;
  };
}

export type Job = InquiryEmailJob | RegistrationEmailJob;

// In-memory job queue (use Redis for production)
const jobQueue: Map<string, Job> = new Map();
const processingJobs: Set<string> = new Set();

// Configuration
const MAX_CONCURRENT_JOBS = 5;
const JOB_TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 5000; // 5 seconds

/**
 * Generate a unique job ID
 */
function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new job and add it to the queue
 */
export async function createJob(type: JobType, data: any, maxAttempts: number = 3): Promise<string> {
  const jobId = generateJobId();
  
  const job: Job = {
    id: jobId,
    type,
    createdAt: new Date(),
    attempts: 0,
    maxAttempts,
    status: 'pending',
    data,
  };
  
  jobQueue.set(jobId, job);
  console.log(`[JobQueue] Job created: ${jobId} (${type})`);
  
  // Start processing if below concurrency limit
  processQueue();
  
  return jobId;
}

/**
 * Process the job queue
 */
async function processQueue(): Promise<void> {
  if (processingJobs.size >= MAX_CONCURRENT_JOBS) {
    console.log('[JobQueue] Max concurrent jobs reached, waiting...');
    return;
  }
  
  for (const [jobId, job] of jobQueue) {
    if (job.status === 'pending' && !processingJobs.has(jobId)) {
      await processJob(jobId, job);
    }
  }
}

/**
 * Process a single job
 */
async function processJob(jobId: string, job: Job): Promise<void> {
  processingJobs.add(jobId);
  job.status = 'processing';
  job.attempts += 1;
  
  console.log(`[JobQueue] Processing job ${jobId} (attempt ${job.attempts}/${job.maxAttempts})`);
  
  try {
    await executeJob(job);
    
    job.status = 'completed';
    jobQueue.delete(jobId);
    console.log(`[JobQueue] Job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`[JobQueue] Job ${jobId} failed:`, error);
    job.error = error instanceof Error ? error.message : 'Unknown error';
    
    if (job.attempts < job.maxAttempts) {
      job.status = 'pending';
      // Schedule retry with delay
      setTimeout(() => {
        processingJobs.delete(jobId);
        processQueue();
      }, RETRY_DELAY_MS);
    } else {
      job.status = 'failed';
      jobQueue.delete(jobId);
      console.error(`[JobQueue] Job ${jobId} failed after ${job.maxAttempts} attempts`);
    }
  } finally {
    processingJobs.delete(jobId);
    // Continue processing queue
    processQueue();
  }
}

/**
 * Execute the job based on its type
 */
async function executeJob(job: Job): Promise<void> {
  switch (job.type) {
    case 'send-inquiry-email':
      await sendInquiryNotification({
        businessName: job.data.businessName,
        businessEmail: job.data.businessEmail,
        customerName: job.data.customerName,
        customerEmail: job.data.customerEmail,
        customerPhone: job.data.customerPhone,
        message: job.data.message,
        productName: job.data.productName,
        inquiryUrl: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/inquiries`,
      });
      break;
      
    case 'send-registration-email':
      await sendAccountCreationNotification({
        name: job.data.name,
        email: job.data.email,
        password: job.data.password,
        accountType: job.data.accountType,
        loginUrl: job.data.loginUrl,
      });
      break;
      
    // Professional inquiry emails are handled directly in the API for now
    // case 'send-professional-inquiry-email':
      
    default:
      throw new Error(`Unknown job type: ${(job as Job).type}`);
  }
}

/**
 * Get job status
 */
export function getJobStatus(jobId: string): Job | undefined {
  return jobQueue.get(jobId);
}

/**
 * Get queue statistics
 */
export function getQueueStats(): {
  pending: number;
  processing: number;
  totalProcessed: number;
} {
  let pending = 0;
  let processing = 0;
  
  for (const job of jobQueue.values()) {
    if (job.status === 'pending') pending++;
    if (job.status === 'processing') processing++;
  }
  
  return {
    pending,
    processing,
    totalProcessed: processingJobs.size,
  };
}

/**
 * Convenience function to queue inquiry email
 */
export async function queueInquiryEmail(inquiryId: string): Promise<string> {
  // Fetch inquiry data from database
  const inquiry = await db.inquiry.findUnique({
    where: { id: inquiryId },
    include: {
      business: {
        select: { name: true, email: true },
      },
      product: {
        select: { name: true },
      },
    },
  });
  
  if (!inquiry) {
    throw new Error(`Inquiry not found: ${inquiryId}`);
  }
  
  return createJob('send-inquiry-email', {
    inquiryId: inquiry.id,
    businessName: inquiry.business.name,
    businessEmail: inquiry.business.email || '',
    customerName: inquiry.name,
    customerEmail: inquiry.email,
    customerPhone: inquiry.phone || undefined,
    message: inquiry.message,
    productName: inquiry.product?.name,
  }, 3);
}

/**
 * Convenience function to queue registration email
 */
export async function queueRegistrationEmail(
  name: string,
  email: string,
  password: string,
  accountType: 'business' | 'professional'
): Promise<string> {
  return createJob('send-registration-email', {
    name,
    email,
    password,
    accountType,
    loginUrl: `${process.env.NEXT_PUBLIC_API_URL}/login`,
  }, 3);
}

/**
 * Start the job queue processor
 * Call this once when the server starts
 */
export function startJobQueue(): void {
  console.log('[JobQueue] Job queue processor started');
  
  // Process queue every 10 seconds to catch any stuck jobs
  setInterval(() => {
    processQueue();
  }, 10000);
}

/**
 * Graceful shutdown - wait for jobs to complete
 */
export async function shutdownJobQueue(timeoutMs: number = 30000): Promise<void> {
  console.log('[JobQueue] Shutting down...');
  
  const startTime = Date.now();
  
  while (processingJobs.size > 0 && Date.now() - startTime < timeoutMs) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (processingJobs.size > 0) {
    console.warn(`[JobQueue] Shutdown timeout with ${processingJobs.size} jobs still processing`);
  } else {
    console.log('[JobQueue] Shutdown complete');
  }
}
