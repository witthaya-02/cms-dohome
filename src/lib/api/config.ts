/**
 * ไฟล์กำหนดค่า configuration สำหรับ API
 */

// กำหนด interface สำหรับโครงสร้างของค่า config
export interface ApiConfig {
  baseUrl: string; // URL หลักของ API
  appKey: string; // API Key สำหรับการเชื่อมต่อ
  appId: string; // API ID สำหรับการเชื่อมต่อ
  timeout?: number; // ระยะเวลาที่รอก่อนจะยกเลิกการเชื่อมต่อ (optional)
}

console.log('dohome');
// Debug environment variables
console.log('Environment variables:', {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  // appKey: process.env.NEXT_PUBLIC_API_KEY,
  // appId: process.env.NEXT_PUBLIC_API_ID
});

// ค่า configuration ที่จะใช้จริง
export const API_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://dohome-api-service-dev.azurewebsites.net',
  appKey: process.env.NEXT_PUBLIC_API_KEY || 'e591a139-becd-4124-bd12-1b6625b19b7f',
  appId: process.env.NEXT_PUBLIC_API_ID || '680b18783bc36174090bd9d1',
  timeout: 30000, // 30 seconds
};
