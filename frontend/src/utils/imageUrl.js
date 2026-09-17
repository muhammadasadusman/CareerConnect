// =====================================================
// IMAGE URL UTILITY
// Resolves relative and absolute backend image paths across
// desktop, mobile devices on LAN, and production environments.
// =====================================================

export const getBackendOrigin = () => {
  const envUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  let origin = envUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

  // If the frontend is being viewed on a mobile device or another machine over LAN
  // (e.g. http://192.168.1.15:5173), and the backend URL points to localhost/127.0.0.1,
  // adapt the origin so the mobile phone connects to the host machine instead of itself.
  if (typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname;
    const isLocalhost = host === "localhost" || host === "127.0.0.1";
    if (!isClientLocalhost(host) && (origin.includes("localhost") || origin.includes("127.0.0.1"))) {
      origin = `${window.location.protocol}//${host}:5000`;
    }
  }

  return origin;
};

const isClientLocalhost = (host) => {
  return host === "localhost" || host === "127.0.0.1";
};

export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") {
    return "";
  }

  const clean = imagePath.trim();
  if (!clean) {
    return "";
  }

  // Handle data URIs and blob URIs
  if (clean.startsWith("data:") || clean.startsWith("blob:")) {
    return clean;
  }

  const backendOrigin = getBackendOrigin();

  // If database contains old staging host or localhost URL, map to current active backend origin
  if (
    clean.includes("careerconnect.dockhosting.dev") ||
    clean.includes("localhost:5000") ||
    clean.includes("127.0.0.1:5000")
  ) {
    return clean
      .replace(/https?:\/\/careerconnect\.dockhosting\.dev/, backendOrigin)
      .replace(/https?:\/\/(localhost|127\.0\.0\.1):5000/, backendOrigin);
  }

  // If already absolute URL
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  // Relative path (/uploads/... or uploads/...)
  const normalized = clean.startsWith("/") ? clean : `/${clean}`;
  return `${backendOrigin}${normalized}`;
};

export const getInitials = (name = "CC") => {
  if (!name || typeof name !== "string") return "CC";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "CC";
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
};

export default getImageUrl;
