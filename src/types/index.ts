// -----------------------------------------------------
// GLOBAL ENUMS (Converted from your Supabase enums)
// -----------------------------------------------------

export enum UserType {
  BUSINESS_OWNER = "business_owner",
  USER = "user",
}

export enum SenderType {
  USER = "user",
  ADMIN = "admin",
  AI = "ai",
}

// -----------------------------------------------------
// EXPRESS TYPE AUGMENTATION (for req.user)
// -----------------------------------------------------

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        user_type: UserType;
      };
    }
  }
}

// -----------------------------------------------------
// SHARED INTERFACES USED ACROSS MODULES
// -----------------------------------------------------

export interface AuthPayload {
  id: string;
  email: string;
  user_type: UserType;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface BusinessOwnerCheck {
  user_id: string;
  business_id: string;
}

// -----------------------------------------------------
// MESSAGING PLATFORM ENUMS
// -----------------------------------------------------

export enum MessagingPlatform {
  WHATSAPP = "whatsapp",
  TELEGRAM = "telegram",
  MESSENGER = "messenger",
}

// -----------------------------------------------------
// MESSAGE PAYLOADS FOR SERVICES
// -----------------------------------------------------

export interface SendMessagePayload {
  businessId: string;
  userId: string;
  message: string;
  messageTag?: string; // Messenger 24-hour rule tag
}

// WhatsApp payload structure
export interface WhatsAppWebhookPayload {
  entry: {
    changes: {
      value: {
        messages?: any[];
        contacts?: any[];
        metadata?: { phone_number_id: string };
      };
    }[];
  }[];
}

// Telegram payload structure
export interface TelegramWebhookPayload {
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name?: string;
      last_name?: string;
    };
    chat: {
      id: number;
    };
    text?: string;
    caption?: string;
  };
}

// Messenger webhook payload structure
export interface MessengerWebhookPayload {
  entry?: {
    messaging?: any[];
  }[];
}

// -----------------------------------------------------
// DATABASE QUERY TYPES
// -----------------------------------------------------

export interface FindUserByEmail {
  email: string;
}

export interface CreateUser {
  email: string;
  full_name?: string | null;
  user_type: UserType;
  platform?: string | null;
}

export interface CreateBusiness {
  business_name: string;
  email: string;
  owner_user_id: string;
}

// -----------------------------------------------------
// UTILITY TYPES
// -----------------------------------------------------

export type Optional<T> = {
  [K in keyof T]?: T[K];
};

export type WithTimestamps = {
  created_at: Date;
  updated_at: Date;
};

// -----------------------------------------------------

export {};
