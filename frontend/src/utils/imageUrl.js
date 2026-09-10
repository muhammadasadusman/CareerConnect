// =====================================================
// IMAGE URL UTILITY
// Resolves relative and absolute backend image paths across
// desktop, mobile devices on LAN, and production environments.
// =====================================================

export const getBackendOrigin = () => {
  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
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

  // If already absolute URL
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    // If the database has hardcoded http://localhost:5000 but the client is running
    // on a mobile device / LAN IP or deployed in production, point to the current backend
    if (clean.includes("localhost:5000")) {
      const isLocalhostClient =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");

      if (!isLocalhostClient || !backendOrigin.includes("localhost:5000")) {
        return clean.replace(/https?:\/\/localhost:5000/, backendOrigin);
      }
    }
    return clean;
  }

  // Relative path (/uploads/... or uploads/...)
  const normalized = clean.startsWith("/") ? clean : `/${clean}`;
  return `${backendOrigin}${normalized}`;
};

export const getInitials = (name = "CC") => {
  if (!name || typeof name !== "string") return "CC";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
};

export default getImageUrl;
