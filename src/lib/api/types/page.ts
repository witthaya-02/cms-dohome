import { StringOptional } from './common-types';

export enum ModuleName {
  Hero = 'HEROBANNER',
  HeroField = 'hero_banner',
  HeroFieldCamelCase = 'heroBanner',

  ProductCarousel = 'PRODUCTCAROUSEL',
  ProductCarouselField = 'product_carousel',
  ProductCarouselFieldCamelCase = 'productCarousel',

  ProductGrid = 'PRODUCTGRID',
  ProductGridField = 'product_grid',
  ProductGridFieldCamelCase = 'productGrid',

  SingleBanner = 'SINGLEBANNER',
  SingleBannerField = 'single_banner',
  SingleBannerFieldCamelCase = 'singleBanner',

  RawHtml = 'RAWHTML',
  RawHtmlField = 'raw_html',
  RawHtmlFieldCamelCase = 'rawHtml',
}

export interface BaseWidgetClass {
  moduleName: string;
  isUse: boolean;
  seq: number;
  [ModuleName.HeroFieldCamelCase]?: HeroContentClass;
  [ModuleName.ProductCarouselFieldCamelCase]?: ProductContentClass;
  [ModuleName.SingleBannerFieldCamelCase]?: SingLeBannerContentClass;
  [ModuleName.ProductGridFieldCamelCase]?: ProductContentClass;
  [ModuleName.RawHtmlFieldCamelCase]?: RawHtmlContentClass;
}

interface BaseField {
  module_name: string;
  is_use: boolean;
  seq: number;
}

interface BaseFieldWidget {
  is_show_on_web: boolean;
  is_show_on_app: boolean;
}

type BaseWidget<T extends object> = BaseField & T;

type HeroWidgetType = BaseWidget<{ [ModuleName.HeroField]: HeroContentWidget }>;
type ProductCarouselWidgetType = BaseWidget<{
  [ModuleName.ProductCarouselField]: ProductContentWidget;
}>;
type SingleBannerWidgetType = BaseWidget<{
  [ModuleName.SingleBannerField]: SingleBannerContentWidget;
}>;
type ProductGridWidgetType = BaseWidget<{
  [ModuleName.ProductGridField]: ProductContentWidget;
}>;
type RawHtmlWidgetType = BaseWidget<{
  [ModuleName.RawHtmlField]: RawHtmlContentWidget;
}>;

type Widget =
  | HeroWidgetType
  | ProductCarouselWidgetType
  | SingleBannerWidgetType
  | ProductGridWidgetType
  | RawHtmlWidgetType;

export interface ApiPageResponse {
  pages: {
    widgets: Widget[];
    url_slug: StringOptional;
  };
}

class GenericWidget<T extends string, U> implements BaseWidgetClass {
  moduleName: string;
  isUse: boolean;
  seq: number;

  private contentKey: T;
  private contentValue: U;

  constructor(moduleName: string, isUse: boolean, seq: number, key: T, value: U) {
    this.moduleName = moduleName;
    this.isUse = isUse;
    this.seq = seq;
    this.contentKey = key;
    this.contentValue = value;
  }

  static fromJson<T extends string, D extends Record<T, V> & BaseField, V, U>(
    data: D,
    key: T,
    parseFn: (value: V) => U
  ): GenericWidget<T, U> {
    return new GenericWidget(data.module_name, data.is_use, data.seq, key, parseFn(data[key]));
  }

  get content(): U {
    return this.contentValue;
  }

  get key(): T {
    return this.contentKey;
  }
}

// class HeroBannerClass implements BaseWidgetClass {
//   moduleName: string;
//   isUse: boolean;
//   seq: number;
//   hero: HeroContentClass;

//   constructor(parameter: {
//     moduleName: string;
//     isUse: boolean;
//     seq: number;
//     hero: HeroContentClass;
//   }) {
//     this.moduleName = parameter.moduleName;
//     this.isUse = parameter.isUse;
//     this.seq = parameter.seq;
//     this.hero = parameter.hero;
//   }

//   static fromJson(data: HeroWidgetType): HeroBannerClass {
//     return new HeroBannerClass({
//       moduleName: data.module_name,
//       isUse: data.is_use,
//       seq: data.seq,
//       hero: HeroContentClass.fromJson(data.hero_banner),
//     });
//   }
// }

export class HeroContentClass {
  //   imageBackground: string;
  bannerSetting: BannerHeroSettingClass[];
  showOnWeb: boolean;
  showOnApp: boolean;

  constructor(parameter: {
    // imageBackground: string;
    bannerSetting: BannerHeroSettingClass[];
    showOnWeb: boolean;
    showOnApp: boolean;
  }) {
    // this.imageBackground = parameter.imageBackground;
    this.bannerSetting = parameter.bannerSetting;
    this.showOnApp = parameter.showOnApp;
    this.showOnWeb = parameter.showOnWeb;
  }

  static fromJson(data: HeroContentWidget): HeroContentClass {
    return new HeroContentClass({
      //   imageBackground: data.image_background,
      bannerSetting: BannerHeroSettingClass.fromJson(data.banner_setting),
      showOnWeb: data.is_show_on_web,
      showOnApp: data.is_show_on_app,
    });
  }
}

export class ProductContentClass {
  isShowTitle: boolean;
  productCollectionId: string;
  title: string;
  showOnWeb: boolean;
  showOnApp: boolean;
  LinkSetting: LinkSettingClass;

  constructor(parameter: {
    isShowTitle: boolean;
    productCollectionId: string;
    title: string;
    showOnWeb: boolean;
    showOnApp: boolean;
    linkSetting: LinkSettingClass;
  }) {
    this.isShowTitle = parameter.isShowTitle;
    this.productCollectionId = parameter.productCollectionId;
    this.title = parameter.title;
    this.showOnApp = parameter.showOnApp;
    this.showOnWeb = parameter.showOnWeb;
    this.LinkSetting = parameter.linkSetting;
  }

  static fromJson(data: ProductContentWidget): ProductContentClass {
    return new ProductContentClass({
      isShowTitle: data.is_show_title,
      productCollectionId: data.product_collection_id,
      title: data.title,
      showOnWeb: data.is_show_on_web,
      showOnApp: data.is_show_on_app,
      linkSetting: LinkSettingClass.fromJson(data.link_setting),
    });
  }
}

class BannerHeroSettingClass {
  imageWeb: string;
  imageApp: string;
  linkSetting: LinkSettingClass;

  constructor(parameter: { imageApp: string; imageWeb: string; linkSetting: LinkSettingClass }) {
    this.imageApp = parameter.imageApp;
    this.imageWeb = parameter.imageWeb;
    this.linkSetting = parameter.linkSetting;
  }

  static fromJson(data: BannerSetting[]): BannerHeroSettingClass[] {
    return data.map(
      (item) =>
        new BannerHeroSettingClass({
          imageWeb: item.image_web,
          imageApp: item.image_app,
          linkSetting: LinkSettingClass.fromJson(item.link_setting),
        })
    );
  }
}

export class LinkSettingClass {
  linkTo: string;
  linkType: string;

  constructor(parameter: { linkTo: StringOptional; linkType: StringOptional }) {
    this.linkTo = parameter.linkTo ?? '';
    this.linkType = parameter.linkType ?? '';
  }

  static fromJson(data: LinkSetting): LinkSettingClass {
    return new LinkSettingClass({
      linkTo: data.link_to,
      linkType: data.link_type,
    });
  }
}

export class SingLeBannerContentClass {
  image: string;
  linkSetting: LinkSettingClass;
  showOnWeb: boolean;
  showOnApp: boolean;

  constructor(parameter: {
    image: string;
    linkSetting: LinkSettingClass;
    showOnWeb: boolean;
    showOnApp: boolean;
  }) {
    this.image = parameter.image;
    this.linkSetting = parameter.linkSetting;
    this.showOnApp = parameter.showOnApp;
    this.showOnWeb = parameter.showOnWeb;
  }

  static fromJson(data: SingleBannerContentWidget): SingLeBannerContentClass {
    return new SingLeBannerContentClass({
      image: data.image,
      linkSetting: LinkSettingClass.fromJson(data.link_setting),
      showOnWeb: data.is_show_on_web,
      showOnApp: data.is_show_on_app,
    });
  }
}

export class RawHtmlContentClass {
  html: string;
  showOnWeb: boolean;
  showOnApp: boolean;

  constructor(parameter: { html: string; showOnWeb: boolean; showOnApp: boolean }) {
    this.html = parameter.html;
    this.showOnApp = parameter.showOnApp;
    this.showOnWeb = parameter.showOnWeb;
  }

  static fromJson(data: RawHtmlContentWidget): RawHtmlContentClass {
    return new RawHtmlContentClass({
      html: data.html,
      showOnWeb: data.is_show_on_web,
      showOnApp: data.is_show_on_app,
    });
  }
}

export class HomePageResponse {
  pages: Page;

  constructor(page: Page) {
    this.pages = page;
  }

  static fromJson(data: ApiPageResponse): HomePageResponse {
    return new HomePageResponse(Page.fromJson(data.pages.widgets, data.pages.url_slug ?? ''));
  }
}

class Page {
  widgets: BaseWidgetClass[];
  urlSlug: string;

  constructor(widgets: BaseWidgetClass[], urlSlug: string) {
    this.widgets = widgets;
    this.urlSlug = urlSlug;
  }

  static fromJson(data: Widget[], urlSlug: string): Page {
    const list: BaseWidgetClass[] = [];
    data.forEach((item) => {
      switch (item.module_name) {
        case ModuleName.Hero:
          if (ModuleName.HeroField in item) {
            const widget = GenericWidget.fromJson(
              item,
              ModuleName.HeroField,
              HeroContentClass.fromJson
            );
            list.push({
              moduleName: widget.moduleName,
              isUse: widget.isUse,
              seq: widget.seq,
              [ModuleName.HeroFieldCamelCase]: widget.content,
            });
          }
          break;
        case ModuleName.ProductCarousel:
          if (ModuleName.ProductCarouselField in item) {
            const widget = GenericWidget.fromJson(
              item,
              ModuleName.ProductCarouselField,
              ProductContentClass.fromJson
            );
            list.push({
              moduleName: widget.moduleName,
              isUse: widget.isUse,
              seq: widget.seq,
              [ModuleName.ProductCarouselFieldCamelCase]: widget.content,
            });
          }
          break;
        case ModuleName.SingleBanner:
          if (ModuleName.SingleBannerField in item) {
            const widget = GenericWidget.fromJson(
              item,
              ModuleName.SingleBannerField,
              SingLeBannerContentClass.fromJson
            );
            list.push({
              moduleName: widget.moduleName,
              isUse: widget.isUse,
              seq: widget.seq,
              [ModuleName.SingleBannerFieldCamelCase]: widget.content,
            });
          }
          break;
        case ModuleName.ProductGrid:
          if (ModuleName.ProductGridField in item) {
            const widget = GenericWidget.fromJson(
              item,
              ModuleName.ProductGridField,
              ProductContentClass.fromJson
            );
            list.push({
              moduleName: widget.moduleName,
              isUse: widget.isUse,
              seq: widget.seq,
              [ModuleName.ProductGridFieldCamelCase]: widget.content,
            });
          }
          break;
        case ModuleName.RawHtml:
          if (ModuleName.RawHtmlField in item) {
            const widget = GenericWidget.fromJson(
              item,
              ModuleName.RawHtmlField,
              RawHtmlContentClass.fromJson
            );
            list.push({
              moduleName: widget.moduleName,
              isUse: widget.isUse,
              seq: widget.seq,
              [ModuleName.RawHtmlFieldCamelCase]: widget.content,
            });
          }
          break;
        default:
          console.warn(`Unknown widget: ${item.module_name}`);
          break;
      }
    });
    return new Page(list, urlSlug);
  }
}

interface HeroContentWidget extends BaseFieldWidget {
  //   image_background: string;
  banner_setting: BannerSetting[];
}

interface ProductContentWidget extends BaseFieldWidget {
  is_show_on_app: boolean;
  is_show_on_web: boolean;
  is_show_title: boolean;
  product_collection_id: string;
  title: string;
  link_setting: LinkSetting;
}

interface SingleBannerContentWidget extends BaseFieldWidget {
  is_show_on_app: boolean;
  is_show_on_web: boolean;
  image: string;
  link_setting: LinkSetting;
}

interface RawHtmlContentWidget extends BaseFieldWidget {
  html: string;
}

interface LinkSetting {
  link_type: StringOptional;
  link_to: StringOptional;
}

interface BannerSetting {
  image_web: string;
  image_app: string;
  link_setting: LinkSetting;
}
