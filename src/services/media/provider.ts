/**
 * Provider-agnostic media contracts.
 *
 * The rest of the app imports only from `@/services/media` — never from a
 * provider module directly. Swapping Cloudinary for S3 / BunnyCDN / R2 means
 * implementing these interfaces in a new file and re-exporting it from index.
 */

export type MediaAsset = {
  /** Canonical, publicly reachable URL stored in the database. */
  url: string;
  /** Provider-specific identifier (e.g. Cloudinary public_id). */
  id?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  provider: MediaProviderName;
};

export type MediaProviderName = "cloudinary" | "external";

export type ImageTransform = {
  /** Target width in px. Omit for automatic/responsive width. */
  width?: number;
  height?: number;
  /** 1–100, or "auto" (default). */
  quality?: number | "auto";
  /** Crop behaviour when both width and height are given. */
  crop?: "fill" | "fit" | "limit";
  /** Device pixel ratio. Defaults to "auto". */
  dpr?: number | "auto";
};

export type UploadOptions = {
  folder?: string;
  multiple?: boolean;
  /** Max files when `multiple` is true. */
  maxFiles?: number;
};

/** Contract every image provider must satisfy. */
export interface ImageProvider {
  readonly name: MediaProviderName;
  /** Is the provider configured (keys/cloud name present)? */
  isConfigured(): boolean;
  /** Opens the provider's upload UI and resolves with the uploaded assets. */
  openUploadWidget(options?: UploadOptions): Promise<MediaAsset[]>;
  /** Returns an optimized delivery URL for a stored asset URL. */
  optimizedUrl(url: string, transform?: ImageTransform): string;
  /** Builds a `srcset` string for responsive delivery. */
  srcSet(url: string, widths?: number[]): string;
}

/** Contract every video provider must satisfy. */
export interface VideoProvider {
  readonly name: string;
  /** Extracts a canonical video id from any supported URL form. */
  parseId(url: string): string | null;
  isValidUrl(url: string): boolean;
  /** Privacy-friendly, non-autoplay embed URL. */
  embedUrl(videoId: string): string;
  thumbnailUrl(videoId: string): string;
}
