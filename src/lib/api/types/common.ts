/* eslint-disable @typescript-eslint/no-explicit-any */

import { StringOptional } from "./common-types";

// src/lib/api/types/common.ts
export class ApiResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  data: T;
  message: string;
  errorMessage: string;

  constructor(
    statusCode: number,
    isSuccess: boolean,
    data: T,
    message: string,
    errorMessage: string
  ) {
    this.statusCode = statusCode;
    this.isSuccess = isSuccess;
    this.data = data;
    this.message = message;
    this.errorMessage = errorMessage;
  }

  static fromJson<T>(
    data: any,
    transformData: (data: any) => T
  ): ApiResponse<T> {
    return new ApiResponse<T>(
      data.status_code || 0,
      data.is_success || false,
      transformData(data.data),
      data.message || "",
      data.error_message || ""
    );
  }
}

export class ApiPagination {
  page: number;
  limit: number;
  total: number;

  constructor(page: number, limit: number, total: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
  }

  static fromJson(data: any): ApiPagination {
    return new ApiPagination(data.page || 1, data.limit || 10, data.total || 0);
  }
}

export interface BannerTopApi {
  banner: {
    image_web: StringOptional;
    image_app: StringOptional;
    link_setting: {
      link_type: StringOptional;
      link_to: StringOptional;
    };
  };
}

export class BannerTopItem {
  imageWeb: string;
  imageApp: string;
  linkSetting: {
    linkType: string;
    linkTo: string;
  };

  constructor(data: BannerTopApi) {
    this.imageWeb = data?.banner.image_web ?? "";
    this.imageApp = data?.banner.image_app ?? "";
    this.linkSetting = {
      linkType: data?.banner.link_setting.link_type ?? "",
      linkTo: data?.banner.link_setting.link_to ?? "",
    };
  }

  static fromJson(data: BannerTopApi): BannerTopItem {
    return new BannerTopItem(data);
  }

  toJson(): BannerTopApi {
    return {
      banner: {
        image_web: this.imageWeb,
        image_app: this.imageApp,
        link_setting: {
          link_type: this.linkSetting.linkType,
          link_to: this.linkSetting.linkTo,
        },
      },
    };
  }
}