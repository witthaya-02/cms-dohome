const ACCESS_TOKEN_KEY = 'access_token';

/**
 * เซ็ต access token ในฝั่ง client
 * @param accessToken token สำหรับการเข้าถึง API
 */
export const setClientAccessToken = (accessToken: string): void => {
  document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; path=/; SameSite=Strict; max-age=86400`;
};

/**
 * เซ็ต access token ในฝั่ง client
 * @param accessToken token สำหรับการเข้าถึง API
 */
export const setClientTokens = (accessToken: string): void => {
  setClientAccessToken(accessToken);
};

/**
 * ดึง access token จาก server-side cookies (สำหรับ SSR)
 * @param cookieString - cookie string จาก request headers หรือ context
 * @returns {string|null} access token หรือ null ถ้าไม่มี
 */
export const getServerToken = (cookieString?: string): string | null => {
  if (!cookieString) return null;

  try {
    return getCookie(cookieString, ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting server token:', error);
    return null;
  }
};

export const getCookie = (cookieString: string, key: string): string | null => {
  if (!cookieString) return null;

  try {
    const cookies = cookieString.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === key) {
        if (value) {
          console.log('cookie found');
        } else {
          console.log('cookie empty');
        }
        return value;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting server cookie:', error);
    return null;
  }
};

/**
 * ดึง access token จาก client storage
 * @returns {string|null} access token หรือ null ถ้าไม่มี
 */
export const getClientToken = (): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === ACCESS_TOKEN_KEY) {
      return value;
    }
  }
  return null;
};

/**
 * ดึง access token ทั้งฝั่ง client และ server
 * @param cookieString - cookie string สำหรับฝั่ง server (optional)
 * @returns {string | null} access token หรือ null ถ้าไม่มี
 */
export const getToken = (cookieString?: string): string | null => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return getServerToken(cookieString);
  } else {
    return getClientToken();
  }
};

/**
 * ล้าง tokens ทั้งหมดออกจาก client storage
 */
export const clearClientTokens = (): void => {
  // ลบ cookie โดยการตั้งค่า expires เป็นอดีต
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

/**
 * ตรวจสอบว่า access token ที่มีอยู่นั้นหมดอายุหรือไม่
 * โดยตรวจสอบจาก payload ของ JWT
 * หมายเหตุ: วิธีนี้ใช้ได้กับ JWT token เท่านั้น
 * @param cookieString - cookie string สำหรับฝั่ง server (optional)
 * @returns {boolean} true ถ้า token หมดอายุแล้ว, false ถ้ายังไม่หมดอายุ
 */
export const isTokenExpired = (cookieString?: string): boolean => {
  const token = getToken(cookieString);
  if (!token) return true;

  try {
    // แยกส่วน payload จาก JWT token
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));

    // ตรวจสอบเวลาหมดอายุ (exp) ใน payload
    const expirationTime = decodedPayload.exp * 1000; // แปลงเป็น milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // ถ้ามีข้อผิดพลาด สมมติว่า token หมดอายุแล้ว
  }
};

/**
 * แปลง JWT token เป็นข้อมูล payload
 * @param token JWT token
 * @returns {any} ข้อมูล payload หรือ null ถ้าไม่สามารถถอดรหัสได้
 */

export const decodeToken = (token: string): any => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * ดึง User ID จาก token ปัจจุบัน
 * หมายเหตุ: ขึ้นอยู่กับโครงสร้างของ JWT payload ในระบบของคุณ
 * @returns {string|null} User ID หรือ null ถ้าไม่มี token หรือไม่สามารถดึงได้
 */
export const getUserIdFromToken = (): string | null => {
  const token = getClientToken();
  if (!token) return null;

  try {
    const payload = decodeToken(token);
    // ปรับตามโครงสร้าง payload ของคุณ (เช่น userId, user_id, sub, etc.)
    return payload?.userId || payload?.user_id || payload?.sub || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};

export const hasToken = (): boolean => {
  const token = getClientToken();

  return !!token;
};

const tokenUtils = {
  setClientAccessToken,
  setClientTokens,
  getClientToken,
  getServerToken,
  getToken,
  clearClientTokens,
  isTokenExpired,
  decodeToken,
  getUserIdFromToken,
  hasToken,
};

export default tokenUtils;
