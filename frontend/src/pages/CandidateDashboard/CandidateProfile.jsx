import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaCamera,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import API from "../../api/api";

const CandidateProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profileImage: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // ==========================
  // Get Backend URL
  // ==========================

  const getBackendUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    const baseURL =
      API.defaults?.baseURL || "http://localhost:5000/api";

    const backendURL = baseURL.replace(/\/api\/?$/, "");

    return `${backendURL}${imagePath}`;
  };

  // ==========================
  // Get Profile
  // ==========================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/users/profile");

        console.log("Profile:", response.data);

        const user = response.data.user || response.data;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.location || "",
          bio: user.bio || "",
          profileImage: user.profileImage || "",
        });

        if (user.profileImage) {
          setImagePreview(
            getBackendUrl(user.profileImage)
          );
        }
      } catch (err) {
        console.error("Profile Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================
  // Input Change
  // ==========================

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Select Profile Image
  // ==========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only images
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setMessage("");

    setSelectedImage(file);

    // Preview
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  };

  // ==========================
  // Upload Profile Image
  // ==========================

  const uploadProfileImage = async () => {
    if (!selectedImage) return null;

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append(
        "profileImage",
        selectedImage
      );

      const response = await API.put(
        "/users/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "Profile Image Uploaded:",
        response.data
      );

      const updatedUser =
        response.data.user ||
        response.data.updatedUser;

      if (updatedUser?.profileImage) {
        setProfile((prev) => ({
          ...prev,
          profileImage:
            updatedUser.profileImage,
        }));

        setImagePreview(
          getBackendUrl(
            updatedUser.profileImage
          )
        );
      }

      setSelectedImage(null);

      return response.data;
    } catch (err) {
      console.error(
        "Profile Image Upload Error:",
        err
      );

      throw new Error(
        err.response?.data?.message ||
          "Failed to upload profile image."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // ==========================
  // Update Profile
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      // Upload image first if selected
      if (selectedImage) {
        await uploadProfileImage();
      }

      // Update normal profile information
      const response = await API.put(
        "/users/profile",
        {
          name: profile.name,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
        }
      );

      console.log(
        "Profile Updated:",
        response.data
      );

      setMessage(
        response.data.message ||
          "Profile updated successfully!"
      );

      const updatedUser =
        response.data.user ||
        response.data.updatedUser;

      if (updatedUser) {
        setProfile((prev) => ({
          ...prev,
          name:
            updatedUser.name ?? prev.name,
          email:
            updatedUser.email ?? prev.email,
          phone:
            updatedUser.phone ?? prev.phone,
          location:
            updatedUser.location ??
            prev.location,
          bio:
            updatedUser.bio ?? prev.bio,
          profileImage:
            updatedUser.profileImage ??
            prev.profileImage,
        }));

        if (updatedUser.profileImage) {
          setImagePreview(
            getBackendUrl(
              updatedUser.profileImage
            )
          );
        }
      }
    } catch (err) {
      console.error(
        "Update Profile Error:",
        err
      );

      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // Remove Preview Object URL
  // ==========================

  useEffect(() => {
    return () => {
      if (
        imagePreview?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ==========================
          Header
      ========================== */}

      <header className="bg-[#070B2B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <h1 className="text-2xl font-bold">
              Career
              <span className="text-purple-500">
                Connect
              </span>
            </h1>

            <Link
              to="/candidate-dashboard"
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
            >
              <FaArrowLeft />
              Dashboard
            </Link>

          </div>

        </div>
      </header>

      {/* ==========================
          Main
      ========================== */}

      <main className="max-w-4xl mx-auto px-4 py-10">

        <div className="bg-white rounded-xl shadow-lg p-8">

          {/* ==========================
              Profile Header
          ========================== */}

          <div className="flex items-center gap-5 mb-8">

            {/* Profile Image */}

            <div className="relative">

              <div className="w-20 h-20 rounded-full overflow-hidden bg-purple-100 border-4 border-purple-100 flex items-center justify-center text-purple-600 text-2xl">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(
                        "PROFILE IMAGE FAILED:",
                        imagePreview
                      );

                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <FaUser />
                )}

              </div>

              {/* Camera Button */}

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-white hover:bg-purple-700 transition shadow-md"
                title="Choose profile picture"
              >
                <FaCamera size={13} />
              </button>

              {/* Hidden File Input */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                My Profile
              </h1>

              <p className="text-gray-500">
                Manage your profile information
              </p>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Choose Profile Picture
              </button>

            </div>

          </div>

          {/* ==========================
              Loading
          ========================== */}

          {loading && (
            <div className="text-center py-5 text-gray-500">
              Loading profile...
            </div>
          )}

          {/* ==========================
              Error
          ========================== */}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ==========================
              Success
          ========================== */}

          {message && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          {!loading && (
            <form onSubmit={handleSubmit}>

              {/* ==========================
                  Image Selected Message
              ========================== */}

              {selectedImage && (
                <div className="mb-5 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-lg text-sm">

                  <div className="flex items-center justify-between gap-3">

                    <span>
                      Selected:{" "}
                      <strong>
                        {selectedImage.name}
                      </strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);

                        if (
                          profile.profileImage
                        ) {
                          setImagePreview(
                            getBackendUrl(
                              profile.profileImage
                            )
                          );
                        } else {
                          setImagePreview("");
                        }

                        if (
                          fileInputRef.current
                        ) {
                          fileInputRef.current.value =
                            "";
                        }
                      }}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              )}

              {/* ==========================
                  Fields
              ========================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Full Name */}

                <div>
                  <label className="text-sm text-gray-500">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 border rounded-lg outline-none focus:border-purple-500"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="text-sm text-gray-500">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={profile.email}
                    readOnly
                    className="w-full mt-2 px-4 py-3 border rounded-lg outline-none bg-gray-50 text-gray-500"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label className="text-sm text-gray-500">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 border rounded-lg outline-none focus:border-purple-500"
                  />
                </div>

                {/* Location */}

                <div>
                  <label className="text-sm text-gray-500">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={profile.location}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 border rounded-lg outline-none focus:border-purple-500"
                  />
                </div>

              </div>

              {/* ==========================
                  Bio
              ========================== */}

              <div className="mt-5">

                <label className="text-sm text-gray-500">
                  Bio
                </label>

                <textarea
                  rows="4"
                  name="bio"
                  placeholder="Tell recruiters about yourself..."
                  value={profile.bio}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 border rounded-lg outline-none focus:border-purple-500"
                />

              </div>

              {/* ==========================
                  Save Button
              ========================== */}

              <button
                type="submit"
                disabled={
                  saving || uploadingImage
                }
                className="mt-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg transition"
              >
                {saving || uploadingImage
                  ? "Saving..."
                  : "Save Profile"}
              </button>

            </form>
          )}

        </div>

      </main>

    </div>
  );
};

export default CandidateProfile;