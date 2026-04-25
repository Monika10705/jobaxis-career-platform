import { useState, useEffect } from "react";
import { Building2, Mail, Edit3, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EditProfileDetails from "./EditProfileDetails";

const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, logo: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user?.name || "",
        email: user?.email || "",
        avatar: user?.avatar || null,
        companyName: user?.companyName || "",
        companyDescription: user?.companyDescription || "",
        companyLogo: user?.companyLogo || null,
      });
    }
  }, [user]);

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
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, avatarUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, previewURL);
      handleImageUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );

      if (response.status === 200) {
        const updatedUser = response.data;

        setProfileData(updatedUser);
        setFormData(updatedUser);
        updateUser(updatedUser);

        toast.success("Profile updated");
        setEditMode(false);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditMode(false);
  };

  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
      />
    );
  }

  if (!profileData) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 sm:px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Employer Profile
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage your personal details and company identity
                </p>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Personal Information
                      </h2>
                      <p className="text-sm text-slate-500">
                        Your profile details
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-3xl object-cover border border-slate-200"
                    />

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {profileData.name}
                      </h3>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{profileData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Company Information
                      </h2>
                      <p className="text-sm text-slate-500">
                        Your company details
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={profileData.companyLogo}
                      alt="Company logo"
                      className="w-20 h-20 rounded-3xl object-cover border border-slate-200"
                    />

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {profileData.companyName}
                      </h3>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <Building2 className="w-4 h-4 mr-2" />
                        <span>Company</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Company */}
              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  About Company
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {profileData.companyDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;