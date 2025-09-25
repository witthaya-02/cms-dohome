import { apiGet } from '../api';
import { API_ENDPOINTS } from '../endpoint';

import { ApiResponse } from '../types/common';
import { ApiPageResponse, HomePageResponse } from '../types/page';

/**
 * AuthService - Class สำหรับจัดการ Authentication
 */
export class CommonService {
  // เก็บ instance เดียวของ AuthService
  private static instance: CommonService | null = null;

  // ป้องกันการสร้าง instance จากภายนอก
  private constructor() {}

  /**
   * ฟังก์ชันสำหรับเข้าถึง instance เดียวของ AuthService
   */
  public static getInstance(): CommonService {
    if (!CommonService.instance) {
      CommonService.instance = new CommonService();
    }
    return CommonService.instance;
  }
  async getPageHome(): Promise<ApiResponse<HomePageResponse | null>> {
    const rawResponse = await apiGet<ApiResponse<ApiPageResponse>>(API_ENDPOINTS.PAGE.HOMEPAGE);

    const response = ApiResponse.fromJson<HomePageResponse | null>(rawResponse, (data) => {
      if (!data) return null;

      return HomePageResponse.fromJson(data);
    });
    return response;
  }

  //   async getCustomPage(urlKey: string): Promise<ApiResponse<HomePageResponse | null>> {
  //     const rawResponse = await apiGet<ApiResponse<ApiPageResponse>>(
  //       `${API_ENDPOINTS.PAGE.CUSTOM_PAGE}/${urlKey}`
  //     );

  //     const response = ApiResponse.fromJson<HomePageResponse | null>(
  //       rawResponse,
  //       (data) => {
  //         if (!data) return null;

  //         return HomePageResponse.fromJson(data);
  //       }
  //     );
  //     return response;
  //   }

  //   async cookieConsent(payload: {
  //     isPreferenceAccepted: boolean;
  //     isPerformanceAccepted: boolean;
  //     isMarketingAccepted: boolean;
  //   }): Promise<ApiResponse<{ isSuccess: boolean }>> {
  //     const rawResponse = await apiPost<ApiResponse<{ is_success: boolean }>>(
  //       API_ENDPOINTS.USER.COOKIE_CONSENT,
  //       {
  //         is_preference_accepted: payload.isPreferenceAccepted,
  //         is_performance_accepted: payload.isPerformanceAccepted,
  //         is_marketing_accepted: payload.isMarketingAccepted,
  //       }
  //     );

  //     const response = ApiResponse.fromJson<{ isSuccess: boolean }>(
  //       rawResponse,
  //       (data: { is_success: boolean }) => {
  //         if (!data) return { isSuccess: false };
  //         return { isSuccess: data?.is_success ?? false };
  //       }
  //     );
  //     return response;
  //   }
}

export default CommonService;

export const commonService = CommonService.getInstance();
