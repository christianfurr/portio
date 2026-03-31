/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as about from "../about.js";
import type * as analytics from "../analytics.js";
import type * as contact from "../contact.js";
import type * as hero from "../hero.js";
import type * as lib_activity from "../lib/activity.js";
import type * as photos from "../photos.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as siteSettings from "../siteSettings.js";
import type * as stageCrew from "../stageCrew.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  about: typeof about;
  analytics: typeof analytics;
  contact: typeof contact;
  hero: typeof hero;
  "lib/activity": typeof lib_activity;
  photos: typeof photos;
  projects: typeof projects;
  seed: typeof seed;
  siteSettings: typeof siteSettings;
  stageCrew: typeof stageCrew;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
