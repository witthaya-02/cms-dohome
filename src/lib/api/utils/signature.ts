/**
 * Utility สำหรับการสร้าง signature เพื่อใช้ใน API requests
 */
import CryptoJS from "crypto-js";

/**
 * สร้าง timestamp ปัจจุบัน
 * @returns timestamp ในรูปแบบ milliseconds
 */
export function generateTimestamp(): number {
  return Date.now();
}

/**
 * สร้าง signature สำหรับ API request
 * @param endpoint - endpoint ที่จะเรียก (ไม่รวม base URL)
 * @param appId - app ID
 * @param appKey - app key (secret)
 * @param timestamp - timestamp ที่ใช้
 * @returns signature ที่สร้างขึ้น
 */
export function generateSignature(
  endpoint: string,
  appId: string,
  appKey: string,
  timestamp: number
): string {
  // แยก path และ query parameters
  const [pathOnly] = endpoint.split("?");

  let path = pathOnly;
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: Record<string, any> = {
    appId: appId,
    timestamp: timestamp,
  };

  const sortedKeys = Object.keys(params).sort();

  let signatureString = path;
  for (const key of sortedKeys) {
    signatureString += key + params[key];
  }

  const appKeyWithPrefix = `INT8xDOHOME-${appKey}`;

  // สร้าง signature
  const signature = CryptoJS.HmacSHA256(signatureString, appKeyWithPrefix)
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  return signature;
}
