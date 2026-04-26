import { useState } from "react";
import {
  Save,
  X,
  Camera,
  Building2,
  User,
  Mail,
  UploadCloud,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ChangeEmailModal from "../../components/ChangeEmailModal";

const EditProfileDetails = ({
  formData,
  handleImageChange,
  handleInputChange,
  handleSave,
  handleCancel,
  saving,
  uploading,
}) => {
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  return (
    <DashboardLayout activeMenu="company-profile">
      {formData && (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 sm:px-8 py-6 border-b border-slate-200 bg-white">
                <h1 className="text-2xl font-bold text-blue-600">
                  Edit Employer Profile
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Update your personal details and company branding
                </p>
              </div>

              {/* Form */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-700" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Personal Information
                        </h2>
                        <p className="text-sm text-slate-500">
                          Manage your profile details
                        </p>
                      </div>
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                      <div className="relative">
                        <img
                          src={formData?.avatar || ""}
                          alt="Avatar"
                          className="w-24 h-24 rounded-3xl object-cover border border-slate-200"
                        />

                        {uploading?.avatar && (
                          <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        <div className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                          <Camera className="h-4 w-4 text-slate-600" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <label className="block">
                          <span className="sr-only">Choose avatar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, "avatar")}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-300 transition-colors"
                          />
                        </label>
                        <p className="text-xs text-slate-500 mt-2">
                          Recommended: square image, JPG or PNG
                        </p>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-2xl bg-white text-slate-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowChangeEmail(true)}
                          className="px-4 py-3 border border-slate-200 rounded-2xl text-sm text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-slate-700" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Company Information
                        </h2>
                        <p className="text-sm text-slate-500">
                          Manage company identity and branding
                        </p>
                      </div>
                    </div>

                    {/* Company Logo */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                      <div className="relative">
                        <img
                          src={formData.companyLogo || ""}
                          alt="Company Logo"
                          className="w-24 h-24 rounded-3xl object-cover border border-slate-200"
                        />

                        {uploading.logo && (
                          <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        <div className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                          <UploadCloud className="h-4 w-4 text-slate-600" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <label className="block">
                          <span className="sr-only">Choose company logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, "logo")}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-300 transition-colors"
                          />
                        </label>
                        <p className="text-xs text-slate-500 mt-2">
                          Recommended: square logo, transparent PNG preferred
                        </p>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                        placeholder="Enter company name"
                      />
                    </div>

                    {/* Company Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company Description
                      </label>
                      <textarea
                        value={formData.companyDescription}
                        onChange={(e) =>
                          handleInputChange("companyDescription", e.target.value)
                        }
                        rows={5}
                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all resize-none"
                        placeholder="Describe your company..."
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving || uploading.avatar || uploading.logo}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
      )}
      {showChangeEmail && <ChangeEmailModal onClose={() => setShowChangeEmail(false)} />}
    </DashboardLayout>
  );
};

export default EditProfileDetails;