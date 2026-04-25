import { useEffect, useState } from "react";
import {
  Save,
  X,
  Trash2,
  Upload,
  User,
  Mail,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    resume: user?.resume || "",
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, logo: false });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const imgUploadRes = await uploadImage(file);
      const avatarUrl = imgUploadRes.imageUrl || "";
      handleInputChange(type, avatarUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      handleInputChange(type, previewUrl);
      handleImageUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const resposne = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );

      if (resposne.status === 200) {
        toast.success("Profile Details Updated Successfully !!");
        setProfileData({ ...formData });
        updateUser({ ...formData });
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
  };

  const DeleteResume = async () => {
    setSaving(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.DELETE_RESUME, {
        resumeUrl: user.resume || "",
      });

      if (response.status === 200) {
        toast.success("Resume Deleted Successfully!!");
        setProfileData({ ...formData, resume: "" });
        updateUser({ ...formData, resume: "" });
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const userData = {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
      resume: user?.resume || "",
    };

    setProfileData({ ...userData });
    setFormData({ ...userData });
    return () => {};
  }, [user]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <div className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Top */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              to="/find-jobs"
              onClick={handleCancel}
              className="h-11 w-11 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                My Profile
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your personal details and resume
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 sm:px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800">
              <h2 className="text-xl font-semibold text-white">
                Profile Settings
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Keep your profile updated for better opportunities
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative">
                  <img
                    src={formData?.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-200 shadow-sm"
                  />

                  {uploading?.avatar && (
                    <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    Profile Photo
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 mb-3">
                    Upload a professional photo to build trust
                  </p>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors text-sm font-medium text-slate-700">
                    <Upload className="w-4 h-4" />
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "avatar")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-slate-500"
                  />
                </div>
              </div>

              {/* Resume */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <FileText className="w-4 h-4" />
                  Resume
                </label>

                {user?.resume ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        Resume Uploaded
                      </p>
                      <a
                        href={user?.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-slate-500 hover:text-slate-900 underline truncate block mt-1"
                      >
                        View Resume
                      </a>
                    </div>

                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
                      onClick={DeleteResume}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 cursor-pointer hover:border-slate-400 hover:bg-slate-100 transition-colors">
                    <Upload className="w-6 h-6 text-slate-500" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">
                        Upload Resume
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PDF, DOC, DOCX supported
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => handleImageChange(e, "resume")}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200">
                <Link
                  onClick={handleCancel}
                  to="/find-jobs"
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Link>

                <button
                  onClick={handleSave}
                  disabled={saving || uploading.avatar || uploading.logo}
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;