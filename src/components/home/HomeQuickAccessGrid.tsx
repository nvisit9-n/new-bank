import React from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Award, 
  Timer, 
  Globe2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HomeQuickAccessGrid: React.FC = () => {
  const { setActiveTab } = useApp();

  const modules = [
    {
      id: 'courses',
      titleNe: 'पाठ्यक्रम (Syllabus)',
      subtitleNe: 'आधिकारिक सिलेबस र अङ्कभार',
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-100 dark:border-blue-900/50',
      badge: 'सिलेबस',
      onClick: () => setActiveTab('courses')
    },
    {
      id: 'video-lectures',
      titleNe: 'भिडियो क्लास (Video Lectures)',
      subtitleNe: 'विज्ञ प्रशिक्षकहरूका कक्षा भिडियो',
      icon: Video,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/40',
      borderColor: 'border-red-100 dark:border-red-900/50',
      badge: 'लाइब्रेरी',
      onClick: () => setActiveTab('video-lectures')
    },
    {
      id: 'notes-hub',
      titleNe: 'नोट्स हब (Banking Notes Hub)',
      subtitleNe: 'गहन अध्ययन सामग्री र PDF',
      icon: FileText,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-100 dark:border-emerald-900/50',
      badge: 'LaTeX + PDF',
      onClick: () => setActiveTab('notes-hub')
    },
    {
      id: 'quiz',
      titleNe: 'क्विज र मोक टेस्ट (Mock Tests)',
      subtitleNe: '५० सेट पूर्वयोग्यता परीक्षा प्रणाली',
      icon: Award,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-100 dark:border-amber-900/50',
      badge: '५० सेट',
      onClick: () => setActiveTab('quiz')
    },
    {
      id: 'tools',
      titleNe: 'फ्ल्यासबोर्ड / टाइमर (Study Tools)',
      subtitleNe: 'पोमोडोरो टाइमर र स्मार्ट फ्ल्यासकार्ड',
      icon: Timer,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      borderColor: 'border-purple-100 dark:border-purple-900/50',
      badge: 'फोकस टूल',
      onClick: () => setActiveTab('tools')
    },
    {
      id: 'portal',
      titleNe: 'समसामयिक & पोर्टल (Portal)',
      subtitleNe: 'आर्थिक परिसूचक, समाचार र ऐनहरू',
      icon: Globe2,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      borderColor: 'border-teal-100 dark:border-teal-900/50',
      badge: 'लाइभ डाटा',
      onClick: () => setActiveTab('portal')
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider">
              Quick-Access Modules
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            द्रुत पहुँच मोड्युलहरू (Quick Access)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            एपका मुख्य सुविधाहरूमा एक क्लिकमै सिधै प्रवेश गर्नुहोस्।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              onClick={mod.onClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  mod.onClick();
                }
              }}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${mod.bgColor} ${mod.color} flex items-center justify-center border ${mod.borderColor} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                    {mod.badge}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {mod.titleNe}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {mod.subtitleNe}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <span>खोल्नुहोस्</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
