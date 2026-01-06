import { useNavigate } from "react-router-dom";
import { FaBug, FaExclamationTriangle, FaListAlt, FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ReportChoice = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <FaArrowLeft />
            <span>{t('Back')}</span>
          </button>
          <h1 className="text-2xl font-bold">{t('Report an Issue')}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">{t('Help Us Improve')}</h2>
          <p className="text-slate-300">{t('Report issues to help us maintain a better transit system')}</p>
        </div>

        {/* Report Type Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate("/report/app-bug")}
            className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-8 text-left hover:from-blue-500/20 hover:to-blue-600/10 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-blue-500/20 text-blue-300 grid place-items-center mb-4">
                <FaBug size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('Report App Bug')}</h3>
              <p className="text-slate-300 text-sm mb-4">{t('Experiencing technical issues? Report bugs or app malfunctions.')}</p>
              <div className="inline-flex items-center gap-2 text-blue-300 font-medium">
                {t('Submit Report')}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/report/station-hazard")}
            className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-8 text-left hover:from-amber-500/20 hover:to-amber-600/10 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-amber-500/20 text-amber-300 grid place-items-center mb-4">
                <FaExclamationTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('Report Station Hazard')}</h3>
              <p className="text-slate-300 text-sm mb-4">{t('Found safety concerns or hazards at stations? Let us know immediately.')}</p>
              <div className="inline-flex items-center gap-2 text-amber-300 font-medium">
                {t('Submit Report')}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </button>
        </div>

        {/* View Reports Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaListAlt className="text-emerald-300" size={20} />
            <h3 className="text-xl font-semibold">{t('Your Submitted Reports')}</h3>
          </div>
          <p className="text-slate-300 mb-6 text-sm">{t('Track the status of your previously submitted reports')}</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/my-app-bug-reports")}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-300 grid place-items-center flex-shrink-0">
                <FaBug size={20} />
              </div>
              <div>
                <div className="font-semibold">{t('App Bug Reports')}</div>
                <div className="text-sm text-slate-400">{t('View your bug reports')}</div>
              </div>
            </button>

            <button
              onClick={() => navigate("/my-station-hazard-reports")}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 text-amber-300 grid place-items-center flex-shrink-0">
                <FaExclamationTriangle size={20} />
              </div>
              <div>
                <div className="font-semibold">{t('Hazard Reports')}</div>
                <div className="text-sm text-slate-400">{t('View your hazard reports')}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportChoice;

