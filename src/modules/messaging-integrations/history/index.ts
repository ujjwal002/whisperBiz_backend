// src/modules/messaging-integrations/history/index.ts
import  {fetchWhatsAppHistory}  from "./whatsapp";
import { fetchTelegramHistory } from "./telegram";
import { fetchMessengerHistory } from "./messenger";

export async function fetchHistory(platform: 'whatsapp' | 'telegram' | 'messenger', businessId: string) {
  switch (platform) {
    case 'whatsapp':
      return fetchWhatsAppHistory(businessId);
    case 'telegram':
      return fetchTelegramHistory(businessId);
    case 'messenger':
      return fetchMessengerHistory(businessId);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
