/**
 * Handcrafted type declarations for Next.js 16.x usage.
 * Scope: commonly used APIs from App Router and Pages Router.
 */

declare namespace NodeJS {
  interface TTY {
    setBlocking(blocking: boolean): void;
  }

  interface WriteStream {
    _handle?: TTY;
  }

  interface Process {
    readonly browser: boolean;
  }

  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
  }
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "server-only" {}
declare module "client-only" {}

declare global {
  interface Window {
    MSInputMethodContext?: unknown;
    __NEXT_HMR_CB?: null | ((message?: string) => void);
    __next_root_layout_missing_tags?: ("html" | "body")[];
    __NEXT_DEV_INDICATOR_POSITION?:
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right";
  }

  interface NextFetchRequestConfig {
    revalidate?: number | false;
    tags?: string[];
  }

  interface RequestInit {
    next?: NextFetchRequestConfig | undefined;
  }

  var _N_E_STYLE_LOAD: (href: string) => Promise<void>;
}

declare module "react" {
  interface ImgHTMLAttributes<T> {
    fetchPriority?: "high" | "low" | "auto" | undefined;
  }
}

type Metadata = {
  title?: string;
  description?: string;
  keywords?: string[];
  authors?: Array<{ name: string; url?: string }>;
  creator?: string;
  publisher?: string;
  robots?: string | Record<string, unknown>;
  openGraph?: Record<string, unknown>;
  twitter?: Record<string, unknown>;
};

type MetadataRoute = string;
type ResolvedMetadata = Metadata;
type ResolvingMetadata = Promise<Metadata>;

type Viewport = {
  width?: string | number;
  height?: string | number;
  initialScale?: number;
  minimumScale?: number;
  maximumScale?: number;
  userScalable?: boolean;
  viewportFit?: "auto" | "contain" | "cover";
};

type ResolvedViewport = Viewport;
type ResolvingViewport = Promise<Viewport>;

type Instrumentation = {
  register?(): void | Promise<void>;
  unregister?(): void | Promise<void>;
};

type AppRouterInstance = {
  back(): void;
  forward(): void;
  refresh(): void;
  push(href: string, options?: { scroll?: boolean }): void;
  replace(href: string, options?: { scroll?: boolean }): void;
  prefetch(href: string): void;
};

type NavigateOptions = {
  scroll?: boolean;
};

type ReadonlyURLSearchParams = Iterable<[string, string]> & {
  get(name: string): string | null;
  getAll(name: string): string[];
  has(name: string): boolean;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string>;
  entries(): IterableIterator<[string, string]>;
  toString(): string;
};

type NextFetchEvent = {
  waitUntil(promise: Promise<any>): void;
};

type MiddlewareConfig = {
  matcher?: string | string[];
};

type NextMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
) => Response | void | Promise<Response | void>;

type NextProxy = NextMiddleware;
type ProxyConfig = MiddlewareConfig;

type NextURL = URL & {
  basePath: string;
  buildId: string;
  locale?: string;
  defaultLocale?: string;
  clone(): NextURL;
};

type NextRequest = Request & {
  cookies: {
    get(name: string): { name: string; value: string } | undefined;
    getAll(name?: string): Array<{ name: string; value: string }>;
    has(name: string): boolean;
    set(name: string, value: string): void;
    delete(name: string): void;
    clear(): void;
  };
  nextUrl: NextURL;
  geo?: {
    city?: string;
    country?: string;
    region?: string;
    latitude?: string;
    longitude?: string;
  };
  ip?: string;
};

type NextResponse<Body = unknown> = Response & {
  cookies: {
    set(name: string, value: string, cookie?: Record<string, any>): void;
    get(name: string): { name: string; value: string } | undefined;
    getAll(name?: string): Array<{ name: string; value: string }>;
    delete(name: string): void;
  };
  json(body: Body, init?: ResponseInit): NextResponse<Body>;
};

type NextAdapter = (config: NextConfig) => any;
type AdapterOutput =
  | "PAGES"
  | "PAGES_API"
  | "APP_PAGE"
  | "APP_ROUTE"
  | "PRERENDER"
  | "STATIC_FILE"
  | "MIDDLEWARE";

declare module "next" {
  import * as React from "react";
  import { IncomingMessage, ServerResponse } from "http";
  import { ParsedUrlQuery } from "querystring";

  export type ServerRuntime = "nodejs" | "experimental-edge" | "edge" | undefined;
  export type PreviewData = string | false | object | undefined;
  export type Route<RouteInferType = any> = string & {};

  export type FileSizeSuffix = `${"k" | "K" | "m" | "M" | "g" | "G" | "t" | "T" | "p" | "P"}${"b" | "B"}`;
  export type SizeLimit = number | `${number}${FileSizeSuffix}`;
  export type ResponseLimit = SizeLimit | boolean;

  export type Redirect =
    | {
        statusCode: 301 | 302 | 303 | 307 | 308;
        destination: string;
        basePath?: false;
      }
    | {
        permanent: boolean;
        destination: string;
        basePath?: false;
      };

  export type PageConfig = {
    api?: {
      responseLimit?: ResponseLimit;
      bodyParser?:
        | {
            sizeLimit?: SizeLimit;
          }
        | false;
      externalResolver?: true;
    };
    env?: Array<string>;
    maxDuration?: number;
    runtime?: ServerRuntime;
    unstable_runtimeJS?: false;
    unstable_JsPreload?: false;
  };

  export type NextConfig = {
    reactStrictMode?: boolean;
    swcMinify?: boolean;
    distDir?: string;
    poweredByHeader?: boolean;
    compress?: boolean;
    basePath?: string;
    assetPrefix?: string;
    trailingSlash?: boolean;
    output?: "standalone" | "export";
    pageExtensions?: string[];
    env?: Record<string, string>;
    experimental?: Record<string, unknown>;
    typescript?: {
      ignoreBuildErrors?: boolean;
    };
    eslint?: {
      ignoreDuringBuilds?: boolean;
    };
    i18n?: {
      locales: string[];
      defaultLocale: string;
      domains?: Array<{
        domain: string;
        defaultLocale: string;
        locales?: string[];
        http?: true;
      }>;
      localeDetection?: boolean;
    };
    images?: {
      deviceSizes?: number[];
      imageSizes?: number[];
      qualities?: number[];
      formats?: Array<"image/avif" | "image/webp">;
      minimumCacheTTL?: number;
      path?: string;
      loader?: string;
      domains?: string[];
      remotePatterns?: Array<{
        protocol?: "http" | "https";
        hostname?: string;
        port?: string;
        pathname?: string;
        search?: string;
      }>;
      dangerouslyAllowSVG?: boolean;
      contentSecurityPolicy?: string;
      unoptimized?: boolean;
    };
    webpack?: (config: any, options: any) => any;
    headers?: () => Promise<Array<{ source: string; headers: Array<{ key: string; value: string }> }>>;
    redirects?: () => Promise<Array<{ source: string; destination: string; permanent: boolean }>>;
    rewrites?: () =>
      | Promise<
          | Array<{
              source: string;
              destination: string;
            }>
          | {
              beforeFiles?: Array<{ source: string; destination: string }>;
              afterFiles?: Array<{ source: string; destination: string }>;
              fallback?: Array<{ source: string; destination: string }>;
            }
        >
      | Array<{
          source: string;
          destination: string;
        }>;
    generateBuildId?: () => string | Promise<string>;
    async rewrites?(): Promise<any>;
  };

  export interface NextApiRequest extends IncomingMessage {
    query: ParsedUrlQuery;
    cookies: Partial<Record<string, string>>;
    body: any;
    env: Record<string, string>;
    draftMode?: boolean;
  }

  export interface NextApiResponse<Data = any> extends ServerResponse {
    status(code: number): this;
    send(body: Data | string | null): this;
    json(body: Data): this;
    redirect(statusOrUrl: number | string, url?: string): this;
    setPreviewData(
      data: object | string,
      options?: {
        maxAge?: number;
        path?: string;
      },
    ): this;
    clearPreviewData(options?: { path?: string }): this;
    revalidate(urlPath: string): Promise<void>;
  }

  export type NextApiHandler<Data = any> = (
    req: NextApiRequest,
    res: NextApiResponse<Data>,
  ) => unknown | Promise<unknown>;

  export interface NextPageContext<Q extends ParsedUrlQuery = ParsedUrlQuery> {
    req?: IncomingMessage;
    res?: ServerResponse;
    pathname: string;
    query: Q;
    asPath?: string;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
    AppTree: React.ComponentType;
  }

  export type NextComponentType<
    C extends NextPageContext = NextPageContext,
    IP = {},
    P = {},
  > = React.ComponentType<P> & {
    getInitialProps?(context: C): IP | Promise<IP>;
  };

  export type NextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P>;

  export type GetStaticPropsContext<
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData,
  > = {
    params?: Params;
    preview?: boolean;
    previewData?: Preview;
    draftMode?: boolean;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
    revalidateReason?: "on-demand" | "build" | "stale";
  };

  export type GetStaticPropsResult<Props> =
    | { props: Props; revalidate?: number | boolean }
    | { redirect: Redirect; revalidate?: number | boolean }
    | { notFound: true; revalidate?: number | boolean };

  export type GetStaticProps<
    Props extends { [key: string]: any } = { [key: string]: any },
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData,
  > = (
    context: GetStaticPropsContext<Params, Preview>,
  ) => Promise<GetStaticPropsResult<Props>> | GetStaticPropsResult<Props>;

  export type InferGetStaticPropsType<T extends (args: any) => any> = Extract<
    Awaited<ReturnType<T>>,
    { props: any }
  >["props"];

  export type GetStaticPathsContext = {
    locales?: string[];
    defaultLocale?: string;
  };

  export type GetStaticPathsFallback = boolean | "blocking";

  export type GetStaticPathsResult<Params extends ParsedUrlQuery = ParsedUrlQuery> = {
    paths: Array<string | { params: Params; locale?: string }>;
    fallback: GetStaticPathsFallback;
  };

  export type GetStaticPaths<Params extends ParsedUrlQuery = ParsedUrlQuery> = (
    context: GetStaticPathsContext,
  ) => Promise<GetStaticPathsResult<Params>> | GetStaticPathsResult<Params>;

  export type GetServerSidePropsContext<
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData,
  > = {
    req: IncomingMessage & {
      cookies: Partial<Record<string, string>>;
    };
    res: ServerResponse;
    params?: Params;
    query: ParsedUrlQuery;
    preview?: boolean;
    previewData?: Preview;
    draftMode?: boolean;
    resolvedUrl: string;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
  };

  export type GetServerSidePropsResult<Props> =
    | { props: Props | Promise<Props> }
    | { redirect: Redirect }
    | { notFound: true };

  export type GetServerSideProps<
    Props extends { [key: string]: any } = { [key: string]: any },
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData,
  > = (
    context: GetServerSidePropsContext<Params, Preview>,
  ) => Promise<GetServerSidePropsResult<Props>> | GetServerSidePropsResult<Props>;

  export type InferGetServerSidePropsType<T extends (args: any) => any> = Awaited<
    Extract<Awaited<ReturnType<T>>, { props: any }>["props"]
  >;
}

declare module "next/types" {
  export * from "next";
}

declare module "next/constants" {
  export type ValueOf<T> = Required<T>[keyof T];

  export const COMPILER_NAMES: {
    readonly client: "client";
    readonly server: "server";
    readonly edgeServer: "edge-server";
  };
  export type CompilerNameValues = ValueOf<typeof COMPILER_NAMES>;
  export const COMPILER_INDEXES: {
    [compilerKey in CompilerNameValues]: number;
  };

  export enum AdapterOutputType {
    PAGES = "PAGES",
    PAGES_API = "PAGES_API",
    APP_PAGE = "APP_PAGE",
    APP_ROUTE = "APP_ROUTE",
    PRERENDER = "PRERENDER",
    STATIC_FILE = "STATIC_FILE",
    MIDDLEWARE = "MIDDLEWARE",
  }

  export const PHASE_EXPORT: "phase-export";
  export const PHASE_ANALYZE: "phase-analyze";
  export const PHASE_PRODUCTION_BUILD: "phase-production-build";
  export const PHASE_PRODUCTION_SERVER: "phase-production-server";
  export const PHASE_DEVELOPMENT_SERVER: "phase-development-server";
  export const PHASE_TEST: "phase-test";
  export const PHASE_INFO: "phase-info";
  export type PHASE_TYPE =
    | typeof PHASE_INFO
    | typeof PHASE_TEST
    | typeof PHASE_EXPORT
    | typeof PHASE_ANALYZE
    | typeof PHASE_PRODUCTION_BUILD
    | typeof PHASE_PRODUCTION_SERVER
    | typeof PHASE_DEVELOPMENT_SERVER;
}

declare module "next/app" {
  import * as React from "react";
  import { NextComponentType, NextPageContext } from "next";

  export type AppInitialProps<P = any> = {
    pageProps: P;
  };

  export type AppContext = {
    Component: NextComponentType<NextPageContext>;
    AppTree: React.ComponentType;
    ctx: NextPageContext;
    router: any;
  };

  export type AppProps<P = any> = {
    Component: NextComponentType<NextPageContext, any, any>;
    pageProps: P;
    router: any;
    __N_SSG?: boolean;
    __N_SSP?: boolean;
  };

  export default class App<P = any, CP = {}, S = {}> extends React.Component<
    AppProps<P> & CP,
    S
  > {
    static getInitialProps?(context: AppContext): AppInitialProps | Promise<AppInitialProps>;
  }
}

declare module "next/document" {
  import * as React from "react";

  export type DocumentContext = {
    renderPage: (options?: {
      enhanceApp?: (App: React.ComponentType<any>) => React.ComponentType<any>;
      enhanceComponent?: (
        Component: React.ComponentType<any>,
      ) => React.ComponentType<any>;
    }) => { html: string; head?: Array<React.ReactElement | null> };
    req?: any;
    res?: any;
    pathname: string;
    query: Record<string, any>;
    asPath: string;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
  };

  export type DocumentInitialProps = {
    html: string;
    head?: Array<React.ReactElement | null>;
    styles?: React.ReactElement[];
  };

  export default class Document<P = {}> extends React.Component<P> {
    static getInitialProps?(ctx: DocumentContext):
      | DocumentInitialProps
      | Promise<DocumentInitialProps>;
  }

  export class Html extends React.Component<React.HtmlHTMLAttributes<HTMLHtmlElement>> {}
  export class Head extends React.Component<React.HTMLAttributes<HTMLHeadElement>> {}
  export class Main extends React.Component {}
  export class NextScript extends React.Component {}
}

declare module "next/head" {
  import * as React from "react";
  const Head: React.FC<React.PropsWithChildren<{}>>;
  export default Head;
}

declare module "next/link" {
  import * as React from "react";

  export type Url = string | URL;

  export interface LinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    href: Url;
    as?: Url;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    prefetch?: boolean | null;
    locale?: string | false;
    legacyBehavior?: boolean;
    onNavigate?: (event: Event) => void;
  }

  const Link: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >;

  export default Link;
}

declare module "next/image" {
  import * as React from "react";

  export interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  }

  export interface StaticRequire {
    default: StaticImageData;
  }

  export type StaticImport = StaticImageData | StaticRequire;

  export type ImageLoaderProps = {
    src: string;
    width: number;
    quality?: number;
  };

  export type ImageLoader = (loaderProps: ImageLoaderProps) => string;

  export interface ImageProps
    extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height" | "loading"> {
    src: string | StaticImport;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    loader?: ImageLoader;
    quality?: number;
    priority?: boolean;
    loading?: "eager" | "lazy";
    placeholder?: "empty" | "blur";
    blurDataURL?: string;
    unoptimized?: boolean;
    sizes?: string;
    onLoadingComplete?: (img: HTMLImageElement) => void;
  }

  export function getImageProps(imgProps: ImageProps): { props: any };

  const Image: React.ForwardRefExoticComponent<
    ImageProps & React.RefAttributes<HTMLImageElement>
  >;

  export default Image;
}

declare module "next/script" {
  import * as React from "react";

  export type ScriptStrategy =
    | "afterInteractive"
    | "lazyOnload"
    | "beforeInteractive"
    | "worker";

  export interface ScriptProps
    extends Omit<
      React.ScriptHTMLAttributes<HTMLScriptElement>,
      "strategy" | "onLoad" | "onError"
    > {
    id?: string;
    strategy?: ScriptStrategy;
    onLoad?: (e: Event) => void;
    onReady?: () => void;
    onError?: (e: Error) => void;
    children?: React.ReactNode;
  }

  const Script: React.FC<ScriptProps>;
  export default Script;
}

declare module "next/dynamic" {
  import * as React from "react";

  export type LoaderComponent<P = {}> =
    | Promise<React.ComponentType<P> | { default: React.ComponentType<P> }>
    | React.ComponentType<P>
    | { default: React.ComponentType<P> };

  export type Loader<P = {}> = (() => LoaderComponent<P>) | LoaderComponent<P>;

  export interface DynamicOptions<P = {}> {
    loading?: React.ComponentType<{
      error?: Error;
      isLoading?: boolean;
      pastDelay?: boolean;
    }>;
    loader?: Loader<P>;
    loadableGenerated?: Record<string, unknown>;
    ssr?: boolean;
    suspense?: boolean;
  }

  export default function dynamic<P = {}>(
    dynamicOptions: Loader<P> | DynamicOptions<P>,
    options?: DynamicOptions<P>,
  ): React.ComponentType<P>;
}

declare module "next/router" {
  import { ParsedUrlQuery } from "querystring";

  export interface UrlObject {
    pathname?: string;
    query?: Record<string, any>;
    hash?: string;
  }

  export type Url = string | UrlObject;

  export interface TransitionOptions {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
  }

  export interface PrefetchOptions {
    priority?: boolean;
    locale?: string | false;
  }

  export interface RouterEvents {
    on(event: string, cb: (...args: any[]) => void): void;
    off(event: string, cb: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
  }

  export interface NextRouter {
    basePath: string;
    pathname: string;
    route: string;
    query: ParsedUrlQuery;
    asPath: string;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
    domainLocales?: Array<{
      domain: string;
      defaultLocale: string;
      locales?: string[];
      http?: true;
    }>;
    isLocaleDomain: boolean;
    isReady: boolean;
    isPreview: boolean;
    isFallback: boolean;
    push(url: Url, as?: Url, options?: TransitionOptions): Promise<boolean>;
    replace(url: Url, as?: Url, options?: TransitionOptions): Promise<boolean>;
    reload(): void;
    back(): void;
    forward(): void;
    prefetch(url: Url, asPath?: Url, options?: PrefetchOptions): Promise<void>;
    beforePopState(cb: (state: any) => boolean): void;
    events: RouterEvents;
  }

  export function useRouter(): NextRouter;
  export const Router: NextRouter;
  export default Router;
}

declare module "next/compat/router" {
  import { NextRouter } from "next/router";

  export function useRouter(): NextRouter | null;
}

declare module "next/navigation" {
  export interface NavigateOptions {
    scroll?: boolean;
  }

  export interface AppRouterInstance {
    back(): void;
    forward(): void;
    refresh(): void;
    push(href: string, options?: NavigateOptions): void;
    replace(href: string, options?: NavigateOptions): void;
    prefetch(href: string): void;
  }

  export class ReadonlyURLSearchParams implements Iterable<[string, string]> {
    [Symbol.iterator](): IterableIterator<[string, string]>;
    entries(): IterableIterator<[string, string]>;
    forEach(
      callbackfn: (value: string, key: string, parent: ReadonlyURLSearchParams) => void,
      thisArg?: any,
    ): void;
    get(name: string): string | null;
    getAll(name: string): string[];
    has(name: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    toString(): string;
  }

  export function useRouter(): AppRouterInstance;
  export function usePathname(): string;
  export function useSearchParams(): ReadonlyURLSearchParams;
  export function useParams<T extends Record<string, string | string[]>>(): T;
  export function useSelectedLayoutSegment(parallelRouteKey?: string): string | null;
  export function useSelectedLayoutSegments(parallelRouteKey?: string): string[];

  export function redirect(url: string): never;
  export function permanentRedirect(url: string): never;
  export function notFound(): never;
}

declare module "next/headers" {
  export interface RequestCookie {
    name: string;
    value: string;
  }

  export interface CookieStore {
    get(name: string): RequestCookie | undefined;
    getAll(name?: string): RequestCookie[];
    has(name: string): boolean;
    set(name: string, value: string, options?: Record<string, any>): void;
    delete(name: string): void;
    clear(): void;
    toString(): string;
  }

  export function headers(): Headers;
  export function cookies(): CookieStore;
  export function draftMode(): {
    isEnabled: boolean;
    enable(): void;
    disable(): void;
  };
}

declare module "next/cache" {
  export function revalidatePath(path: string, type?: "layout" | "page"): void;
  export function revalidateTag(tag: string): void;
  export function updateTag(tag: string): void;
  export function refresh(): void;
  export function unstable_noStore(): void;
  export function cacheTag(tag: string): void;

  export function cacheLife(profile: "default"): void;
  export function cacheLife(profile: "seconds"): void;
  export function cacheLife(profile: "minutes"): void;
  export function cacheLife(profile: "hours"): void;
  export function cacheLife(profile: "days"): void;
  export function cacheLife(profile: "weeks"): void;
  export function cacheLife(profile: "max"): void;
  export function cacheLife(profile: string): void;
  export function cacheLife(profile: {
    stale?: number;
    revalidate?: number;
    expire?: number;
  }): void;

  export const unstable_cacheLife: typeof cacheLife;
  export const unstable_cacheTag: typeof cacheTag;

  export function unstable_cache<T extends (...args: any[]) => any>(
    cb: T,
    keyParts?: string[],
    options?: {
      tags?: string[];
      revalidate?: number | false;
    },
  ): T;
}

declare module "next/server" {
  export interface NextFetchEvent {
    waitUntil(promise: Promise<any>): void;
  }

  export type NextMiddleware = (
    request: NextRequest,
    event: NextFetchEvent,
  ) => Response | void | Promise<Response | void>;

  export interface MiddlewareConfig {
    matcher?:
      | string
      | string[]
      | Array<{
          source: string;
          has?: Array<{
            type: "header" | "cookie" | "query";
            key?: string;
            value?: string;
          }>;
          missing?: Array<{
            type: "header" | "cookie" | "query";
            key?: string;
            value?: string;
          }>;
        }>;
  }

  export type NextProxy = NextMiddleware;
  export type ProxyConfig = MiddlewareConfig;

  export class NextURL extends URL {
    basePath: string;
    buildId: string;
    locale?: string;
    defaultLocale?: string;
    domainLocale?: {
      domain: string;
      defaultLocale: string;
      http?: true;
      locales?: string[];
    };
    clone(): NextURL;
  }

  export class NextRequest extends Request {
    cookies: {
      get(name: string): { name: string; value: string } | undefined;
      getAll(name?: string): Array<{ name: string; value: string }>;
      has(name: string): boolean;
      set(name: string, value: string): void;
      delete(name: string): void;
      clear(): void;
    };
    nextUrl: NextURL;
    geo?: {
      city?: string;
      country?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };
    ip?: string;
  }

  export class NextResponse<Body = unknown> extends Response {
    readonly cookies: {
      set(name: string, value: string, cookie?: Record<string, any>): void;
      get(name: string): { name: string; value: string } | undefined;
      getAll(name?: string): Array<{ name: string; value: string }>;
      delete(name: string): void;
    };

    static json<JsonBody>(body: JsonBody, init?: ResponseInit): NextResponse<JsonBody>;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse<null>;
    static rewrite(destination: string | URL, init?: ResponseInit): NextResponse<null>;
    static next(init?: ResponseInit): NextResponse<null>;
  }

  export function userAgentFromString(userAgent: string): any;
  export function userAgent(request: Request): any;
  export const URLPattern: any;

  export class ImageResponse extends Response {
    static displayName: string;
    constructor(...args: any[]);
  }

  export function after(callback: () => void | Promise<void>): void;
  export function connection(): Promise<void>;
}

declare module "next/og" {
  export { ImageResponse } from "next/server";
}

declare module "next/web-vitals" {
  export interface Metric {
    id: string;
    name: string;
    value: number;
    delta: number;
    entries: PerformanceEntry[];
    rating?: "good" | "needs-improvement" | "poor" | string;
    navigationType?: string;
  }

  export function useReportWebVitals(reportWebVitalsFn: (metric: Metric) => void): void;
}

declare module "next/form" {
  import * as React from "react";

  export interface FormProps
    extends Omit<
      React.FormHTMLAttributes<HTMLFormElement>,
      "action" | "method" | "target" | "encType"
    > {
    action: NonNullable<string | ((formData: FormData) => void | Promise<void>) | undefined>;
    prefetch?: false | null;
    replace?: boolean;
    scroll?: boolean;
  }

  const Form: React.ForwardRefExoticComponent<
    Omit<FormProps, "ref"> & React.RefAttributes<HTMLFormElement>
  >;

  export default Form;
}

declare module "next/error" {
  import * as React from "react";

  export interface ErrorProps {
    statusCode: number;
    title?: string;
  }

  const Error: React.ComponentType<ErrorProps>;
  export default Error;
}

declare module "next/head" {
  import * as React from "react";

  export function defaultHead(): React.ReactElement[];
  const Head: React.FC<React.PropsWithChildren<{}>>;
  export default Head;
}

declare module "next/document" {
  import * as React from "react";

  export type DocumentContext = {
    renderPage: (options?: {
      enhanceApp?: (App: React.ComponentType<any>) => React.ComponentType<any>;
      enhanceComponent?: (
        Component: React.ComponentType<any>,
      ) => React.ComponentType<any>;
    }) => { html: string; head?: Array<React.ReactElement | null> };
    req?: any;
    res?: any;
    pathname: string;
    query: Record<string, any>;
    asPath: string;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
  };

  export type DocumentInitialProps = {
    html: string;
    head?: Array<React.ReactElement | null>;
    styles?: React.ReactElement[];
  };

  export default class Document<P = {}> extends React.Component<P> {
    static getInitialProps?(ctx: DocumentContext):
      | DocumentInitialProps
      | Promise<DocumentInitialProps>;
  }

  export class Html extends React.Component<React.HtmlHTMLAttributes<HTMLHtmlElement>> {}
  export class Head extends React.Component<React.HTMLAttributes<HTMLHeadElement>> {}
  export class Main extends React.Component {}
  export class NextScript extends React.Component {}
}

declare module "next/link" {
  import Link from "next/dist/client/link";
  export * from "next/dist/client/link";
  export default Link;
}

declare module "next/image" {
  import Image from "next/dist/shared/lib/image-external";
  export * from "next/dist/shared/lib/image-external";
  export default Image;
}

declare module "next/script" {
  import Script from "next/dist/client/script";
  export * from "next/dist/client/script";
  export default Script;
}

declare module "next/dynamic" {
  import dynamic from "next/dist/shared/lib/dynamic";
  export * from "next/dist/shared/lib/dynamic";
  export default dynamic;
}

declare module "next/router" {
  import Router from "next/dist/client/router";
  export * from "next/dist/client/router";
  export default Router;
}

declare module "next/app" {
  import App from "next/dist/pages/_app";
  export * from "next/dist/pages/_app";
  export default App;
}

declare module "next/types" {
  export * from "next";
  export { default } from "next";
}
