"use-client"
import { useState, useEffect } from "react";
import { commonService } from "@/lib/api/services/common.service";

// import { clearClientTokens, setClientAccessToken } from "@/lib/api/utils/token";

import { ApiError } from "@/lib/api/utils/error";
// import { hasToken } from "@/lib/api/utils/token";
import { ApiResponse } from "@/lib/api/types";

export function useCommon() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const handleAction = async <T>(
    authFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authFn();
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

   const getApi = async () => {
    const res = await handleAction(() => commonService.getPageHome());
    if (res.data && res.isSuccess) {
    //   setData(res.data); // ✅ เก็บข้อมูลไว้ใน state
      console.log("✅ success", res);
    }
    return res;
  };

  // เรียก API ตอน component mount
  useEffect(() => {
    getApi();
  }, []);

  return {
    getApi,
    loading,
    error,
  };
}

export default useCommon;
