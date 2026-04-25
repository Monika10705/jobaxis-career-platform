import { Briefcase, MapPin, CalendarDays } from "lucide-react";
import moment from "moment";

const JobDashboardCard = ({ job }) => {
  return (
    <div className="group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-blue-600" />
        </div>

        <div className="min-w-0">
          <h4 className="text-sm sm:text-[15px] font-semibold text-slate-900 truncate">
            {job.title}
          </h4>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>

            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {moment(job.createdAt)?.format("DD MMM YYYY")}
            </span>
          </div>
        </div>
      </div>

      <span
        className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full ${
          !job.isClosed
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {job.isClosed ? "Closed" : "Active"}
      </span>
    </div>
  );
};

export default JobDashboardCard;