import type { ImageProvider, ImageTransform, MediaAsset, UploadOptions } from "./provider";

/**
 * Cloudinary image provider.
 *
 * Uploads go browser → Cloudinary (unsigned upload preset). Only the returned
 * secure URL + metadata is ever persisted to the database — no binaries.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

const WIDGET_SRC = "https://upload-widget.cloudinary.com/global/all.js";
const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280, 1600];

type CloudinaryWidgetResult = {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
};

type CloudinaryGlobal = {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: unknown, result: CloudinaryWidgetResult | null) => void,
  ) => { open: () => void; destroy: () => void };
};

declare global {
  interface Window {
    cloudinary?: CloudinaryGlobal;
  }
}

let widgetScript: Promise<CloudinaryGlobal> | null = null;

function loadWidgetScript(): Promise<CloudinaryGlobal> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cloudinary widget requires a browser."));
  }
  if (window.cloudinary) return Promise.resolve(window.cloudinary);
  if (widgetScript) return widgetScript;

  widgetScript = new Promise<CloudinaryGlobal>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = WIDGET_SRC;
    el.async = true;
    el.onload = () =>
      window.cloudinary
        ? resolve(window.cloudinary)
        : reject(new Error("Cloudinary widget failed to initialise."));
    el.onerror = () => reject(new Error("Could not load the Cloudinary upload widget."));
    document.head.appendChild(el);
  });
  return widgetScript;
}

function isCloudinaryUrl(url: string) {
  return url.includes("res.cloudinary.com");
}

/** Injects a transformation string into a Cloudinary delivery URL. */
function withTransform(url: string, transform: string): string {
  if (!isCloudinaryUrl(url) || !transform) return url;
  const marker = "/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const head = url.slice(0, i + marker.length);
  const tail = url.slice(i + marker.length);
  return `${head}${transform}/${tail}`;
}

function buildTransform(t: ImageTransform = {}): string {
  const parts = ["f_auto", `q_${t.quality ?? "auto"}`, `dpr_${t.dpr ?? "auto"}`];
  if (t.width) parts.push(`w_${t.width}`);
  if (t.height) parts.push(`h_${t.height}`);
  if (t.crop) parts.push(`c_${t.crop}`);
  return parts.join(",");
}

export const cloudinaryProvider: ImageProvider = {
  name: "cloudinary",

  isConfigured() {
    return Boolean(CLOUD_NAME && UPLOAD_PRESET);
  },

  async openUploadWidget(options: UploadOptions = {}): Promise<MediaAsset[]> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.",
      );
    }
    const cloudinary = await loadWidgetScript();

    return new Promise<MediaAsset[]>((resolve, reject) => {
      const uploaded: MediaAsset[] = [];
      const widget = cloudinary.createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          folder: options.folder ?? "student-projects",
          multiple: options.multiple ?? false,
          maxFiles: options.maxFiles ?? (options.multiple ? 12 : 1),
          sources: ["local", "url", "camera"],
          resourceType: "image",
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "avif", "gif"],
          maxFileSize: 10_000_000,
          challenge: undefined,
        },
        (error, result) => {
          if (error) {
            widget.destroy();
            reject(error instanceof Error ? error : new Error(String(error)));
            return;
          }
          if (!result) return;
          if (result.event === "success") {
            uploaded.push({
              url: result.info.secure_url,
              id: result.info.public_id,
              width: result.info.width,
              height: result.info.height,
              format: result.info.format,
              bytes: result.info.bytes,
              provider: "cloudinary",
            });
          }
          if (result.event === "close") {
            widget.destroy();
            resolve(uploaded);
          }
        },
      );
      widget.open();
    });
  },

  optimizedUrl(url: string, transform?: ImageTransform) {
    if (!url) return url;
    return withTransform(url, buildTransform(transform));
  },

  srcSet(url: string, widths: number[] = DEFAULT_WIDTHS) {
    if (!isCloudinaryUrl(url)) return "";
    return widths
      .map((w) => `${withTransform(url, buildTransform({ width: w }))} ${w}w`)
      .join(", ");
  },
};
