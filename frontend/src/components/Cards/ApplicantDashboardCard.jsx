import { Clock, Briefcase } from "lucide-react";

const ApplicantDashboardCard = ({ applicant, position, time }) => {
  return (
    <div className="group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {applicant?.name
              ?.split(" ")
              ?.map((n) => n[0])
              ?.join("")}
          </span>
        </div>

        <div className="min-w-0">
          <h4 className="text-sm sm:text-[15px] font-semibold text-slate-900 truncate">
            {applicant?.name}
          </h4>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {position}
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
        <Clock className="h-3.5 w-3.5" />
        {time}
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;