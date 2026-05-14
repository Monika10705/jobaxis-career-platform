import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const BackButton = ({ to }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) navigate(to);
        else navigate(-1);
    };

    return (
        <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
            <ArrowLeft className="h-4 w-4" />
            Back
        </button>
    );
};

export default BackButton;
