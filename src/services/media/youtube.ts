import type { VideoProvider } from "./provider";

/**
 * YouTube video provider — the CMS never uploads video files, it stores a
 * validated URL plus the extracted video id.
 *
 * Supported inputs:
 *   https://youtu.be/<id>
 *   https://www.youtube.com/watch?v=<id>
 *   https://youtube.com/shorts/<id>
 *   https://www.youtube.com/embed/<id>
 */

const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function extractId(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (ID_PATTERN.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  const segments = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") return ID_PATTERN.test(segments[0] ?? "") ? segments[0] : null;

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v && ID_PATTERN.test(v)) return v;
    const [first, second] = segments;
    if (
      (first === "shorts" || first === "embed" || first === "live" || first === "v") &&
      ID_PATTERN.test(second ?? "")
    ) {
      return second;
    }
  }
  return null;
}

export const youtubeProvider: VideoProvider = {
  name: "youtube",
  parseId: extractId,
  isValidUrl: (url: string) => extractId(url) !== null,
  /** Privacy-enhanced host, no autoplay, no related videos from other channels. */
  embedUrl: (videoId: string) =>
    `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
  thumbnailUrl: (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
};
