// =====================================================
// IMAGE URL UTILITY
// Handles images for localhost, LAN/mobile and production
// =====================================================

export const getBackendOrigin = () => {
  const envUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Remove /api from the end
  let origin = envUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

  // ===================================================
  // MOBILE / LAN
  // Example:
  // Frontend: http://192.168.1.10:5173
  // Backend:  http://192.168.1.10:5000
  // ===================================================
  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    const isLocalhost =
      host === "localhost" ||
      host === "127.0.0.1";

    const backendIsLocalhost =
      origin.includes("localhost") ||
      origin.includes("127.0.0.1");

    // If frontend is opened from another device/LAN
    // but backend is still localhost, use the same host
    if (!isLocalhost && backendIsLocalhost) {
      origin = `${window.location.protocol}//${host}:5000`;
    }
  }

  return origin;
};

// =====================================================
// GET IMAGE URL
// =====================================================

export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") {
    return "";
  }

  const clean = imagePath.trim();

  if (!clean) {
    return "";
  }

  // Data URI / Blob
  if (
    clean.startsWith("data:") ||
    clean.startsWith("blob:")
  ) {
    return clean;
  }

  const backendOrigin = getBackendOrigin();

  // ===================================================
  // OLD LOCALHOST / OLD DOCKHOSTING URL
  // Convert them to current backend
  // ===================================================

  if (
    clean.includes("localhost:5000") ||
    clean.includes("127.0.0.1:5000") ||
    clean.includes("careerconnect.dockhosting.dev")
  ) {
    return clean
      .replace(
        /^https?:\/\/localhost:5000/,
        backendOrigin
      )
      .replace(
        /^https?:\/\/127\.0\.0\.1:5000/,
        backendOrigin
      )
      .replace(
        /^https?:\/\/careerconnect\.dockhosting\.dev/,
        backendOrigin
      );
  }

  // ===================================================
  // Already absolute URL
  // ===================================================

  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://")
  ) {
    return clean;
  }

  // ===================================================
  // Relative backend path
  // Example:
  // /uploads/logos/google.png
  // /uploads/profiles/profile.jpg
  // ===================================================

  const normalized = clean.startsWith("/")
    ? clean
    : `/${clean}`;

  return `${backendOrigin}${normalized}`;
};

// =====================================================
// INITIALS
// =====================================================

export const getInitials = (name = "CC") => {
  if (!name || typeof name !== "string") {
    return "CC";
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "CC";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();
};

export default getImageUrl;