import { Bookmark, Briefcase, Building, Building2, Calendar, CheckCircle, MapPin } from "lucide-react"
import moment from "moment"
import { useState } from "react"
import { createPortal } from "react-dom"
import { useAuth } from "../../context/AuthContext"
import StatusBadge from "../StatusBadge"

const JobCard = ({ job, onClick, onToggleSave, onApply, saved, hideApply }) => {
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);

    const formatSalary = (min, max) => {
        const formatNumber = (num) => {
            if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
            return `$${num}`;
        };
        return `${formatNumber(min)}/m`;
    };

    const handleConfirmApply = (e) => {
        e.stopPropagation();
        onApply(job._id);
        setShowConfirm(false);
    };

    return (
        <>
            <div
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:shadow-gray-200 transition-all duration-300 group relative overflow-hidden cursor-pointer"
                onClick={onClick}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        {job?.company?.companyLogo ? (
                            <img
                                src={job?.company?.companyLogo}
                                alt="Company Logo"
                                className="w-14 h-14 object-cover rounded-2xl border-4 border-white/20 shadow-lg"
                            />
                        ) : (
                            <div className="w-14 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                        )}

                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
                                {job?.title}
                            </h3>
                            <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                                <Building className="w-3.5 h-3.5" />
                                {job?.company?.companyName}
                            </p>
                        </div>
                    </div>
                    {user && (
                        <button
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
                        >
                            <Bookmark className={`w-5 h-5 hover:text-blue-600 ${job?.isSaved || saved ? "text-blue-600" : "text-gray-400"}`} />
                        </button>
                    )}
                </div>

                <div className="mb-5">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                            <MapPin className="w-3 h-3" />
                            {job?.location}
                        </span>
                        <span className={`px-3 py-1 rounded-full font-medium ${
                            job?.type === "Full-Time" ? "bg-green-100 text-green-800"
                            : job.type === "Part-Time" ? "bg-yellow-100 text-yellow-800"
                            : job.type === "Contract" ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                            {job?.type}
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                            {job?.category}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-5 pb-4 border-b border-gray-100">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {job?.createdAt ? moment(job.createdAt).format("Do MMM YYYY") : "N/A"}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-blue-600 font-semibold text-lg">
                        {formatSalary(job?.salaryMin, job?.salaryMax)}
                    </div>
                    {!saved && (
                        <>
                            {job?.applicationStatus ? (
                                <StatusBadge status={job?.applicationStatus} />
                            ) : (
                                !hideApply && (
                                    <button
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                        onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                                    >
                                        Apply Now
                                    </button>
                                )
                            )}
                        </>
                    )}
                </div>
            </div>

            {showConfirm && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm mx-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 text-center mb-1">Apply for this job?</h3>
                        <p className="text-sm text-slate-500 text-center mb-6">
                            You're about to apply for <span className="font-semibold text-slate-700">{job?.title}</span> at <span className="font-semibold text-slate-700">{job?.company?.companyName}</span>.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmApply}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default JobCard;
