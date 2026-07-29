/**
 * Media service facade.
 *
 * Application code (CMS forms, project cards, galleries) imports ONLY from
 * this module. Providers are swappable behind these functions.
 */
import { cloudinaryProvider } from "./cloudinary";
import { youtubeProvider } from "./youtube";
import type {
  ImageProvider,
  ImageTransform,
  MediaAsset,
  UploadOptions,
  VideoProvider,
} from "./provider";

export type { ImageProvider, ImageTransform, MediaAsset, UploadOptions, VideoProvider };

/** Active providers — change these two lines to migrate providers. */
export const imageProvider: ImageProvider = cloudinaryProvider;
export const videoProvider: VideoProvider = youtubeProvider;

/* ---------------------------------- images --------------------------------- */

export const isImageUploadConfigured = () => imageProvider.isConfigured();

export const uploadImage = async (options?: UploadOptions): Promise<MediaAsset | null> => {
  const [asset] = await imageProvider.openUploadWidget({
    ...options,
    multiple: false,
  });
  return asset ?? null;
};

export const uploadImages = (options?: UploadOptions): Promise<MediaAsset[]> =>
  imageProvider.openUploadWidget({ ...options, multiple: true });

export const optimizedImage = (url: string, transform?: ImageTransform) =>
  imageProvider.optimizedUrl(url, transform);

export const imageSrcSet = (url: string, widths?: number[]) => imageProvider.srcSet(url, widths);

/* ---------------------------------- videos --------------------------------- */

export const parseVideoId = (url: string) => videoProvider.parseId(url);
export const isValidVideoUrl = (url: string) => videoProvider.isValidUrl(url);
export const videoEmbedUrl = (videoId: string) => videoProvider.embedUrl(videoId);
export const videoThumbnailUrl = (videoId: string) => videoProvider.thumbnailUrl(videoId);
