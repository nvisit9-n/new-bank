import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Clock, 
  MapPin, 
  Laptop, 
  Smartphone, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  FileText, 
  Download, 
  RefreshCw, 
  Calendar, 
  Layers, 
  Activity,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AdminRegisteredUser } from '../../services/adminAnalyticsService';
import { ActivityTrackingService, GlobalUserActivityLog } from '../../services/activityTrackingService';

interface UserDetailModalProps {
  user: AdminRegisteredUser | null;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  const [logs, setLogs] = useState<GlobalUserActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    setIsLoading(true);

    ActivityTrackingService.getUserActivityTimeline(user.id, user.email)
      .then((records) => {
        if (isMounted) {
          setLogs(records);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Error loading user timeline:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user) return null;

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const records = await ActivityTrackingService.getUserActivityTimeline(user.id, user.email);
      setLogs(records);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'all' && log.activityType !== filterType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchAction = log.action?.toLowerCase().includes(q);
      const matchDetails = log.details?.toLowerCase().includes(q);
      const matchPage = log.page?.toLowerCase().includes(q);
      if (!matchAction && !matchDetails && !matchPage) {
        return false;
      }
    }
    return true;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'quiz_complete':
      case 'exam_complete':
        return <Award className="w-4 h-4 text-emerald-500" />;
      case 'quiz_start':
      case 'exam_start':
        return <Activity className="w-4 h-4 text-indigo-500" />;
      case 'youtube_subscribe':
      case 'channel_subscribe':
        return <span className="text-rose-500 font-bold text-xs">▶</span>;
      case 'download':
        return <Download className="w-4 h-4 text-cyan-500" />;
      case 'reading':
      case 'notes_view':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'page_view':
        return <Globe className="w-4 h-4 text-purple-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300';
      case 'quiz_complete':
      case 'exam_complete':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300';
      case 'quiz_start':
      case 'exam_start':
        return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300';
      case 'youtube_subscribe':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300/40';
      case 'download':
        return 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300';
      case 'reading':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div 
      id="user-detail-timeline-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="" 
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shrink-0" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                {user.displayName.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {user.displayName}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  user.isPro 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                    : user.email?.includes('@gmail.com')
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {user.entryStatus || (user.isPro ? 'प्रो सक्रिय' : (user.email?.includes('@gmail.com') ? 'Google प्रमाणीकृत' : 'सक्रिय'))}
                </span>
                {user.isYouTubeSubscribed && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
                    YouTube Subscribed ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                <span>{user.email || 'अतिथि (Guest)'}</span>
                {user.district && (
                  <span className="flex items-center gap-0.5 text-slate-400">
                    <MapPin className="w-3 h-3" />
                    {user.district} ({user.province || 'बागमती प्रदेश'})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition cursor-pointer"
              title="टाइमलाइन रिफ्रेस गर्नुहोस्"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950 hover:text-rose-600 text-slate-700 dark:text-slate-200 transition cursor-pointer"
              title="बन्द गर्नुहोस्"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 sm:p-4 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">कुल लगइन</span>
            <span className="text-base font-black text-blue-600 dark:text-blue-400">
              {user.totalLogins || 1} पटक
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">परीक्षा सब्मिसन</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              {user.testsTaken || user.quizzesCompleted || 0} सेटहरू
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">यन्त्र / ब्राउजर</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
              {user.device === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-slate-500" /> : <Laptop className="w-3.5 h-3.5 text-slate-500" />}
              {user.device || 'Desktop'} • {user.browser || 'Browser'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">अन्तिम सक्रिय समय</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5" title={user.lastActive}>
              {new Date(user.lastActive).toLocaleDateString()} {new Date(user.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Visited Pages Tags */}
        {user.pagesVisited && user.pagesVisited.length > 0 && (
          <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
              भ्रमण गरिएका पृष्ठहरू ({user.pagesVisited.length}):
            </span>
            {user.pagesVisited.map((p, idx) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Timeline Search & Filter Controls */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="टाइमलाइन गतिविधि खोज्नुहोस्..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">सबै गतिविधिहरू ({logs.length})</option>
              <option value="login">लगइन (Logins)</option>
              <option value="quiz_complete">परीक्षा सम्पन्न</option>
              <option value="quiz_start">परीक्षा सुरु</option>
              <option value="youtube_subscribe">युट्युब अनलक</option>
              <option value="page_view">पृष्ठ भ्रमण</option>
              <option value="download">डाउनलोड</option>
              <option value="reading">नोट्स अध्ययन</option>
            </select>
          </div>
        </div>

        {/* Timeline Logs Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-2" />
              <p className="text-xs">डाटाबेसबाट विद्यार्थीको गतिविधि टाइमलाइन लोड हुँदैछ...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">कुनै गतिविधि रेकर्ड फेला परेन।</p>
              <p className="text-xs text-slate-500 mt-1">
                विद्यार्थीले लगइन, क्विज वा पृष्ठहरू भ्रमण गरेपछि यहाँ प्रत्यक्ष स्टेप-बाई-स्टेप टाइमलाइन देखिनेछ।
              </p>
            </div>
          ) : (
            <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-amber-500 flex items-center justify-center shadow-sm">
                    {getActivityIcon(log.activityType)}
                  </div>

                  {/* Activity Card */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-400/60 transition-colors">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getActivityBadgeColor(log.activityType)}`}>
                          {log.activityType}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {log.action}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleDateString()} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {log.details}
                    </p>

                    {/* Metadata chips */}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap font-mono">
                      {log.page && (
                        <span className="bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded">
                          पृष्ठ: {log.page}
                        </span>
                      )}
                      {(log.device || log.browser) && (
                        <span className="bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded">
                          {log.device} • {log.browser}
                        </span>
                      )}
                      {log.metadata?.quizTitle && (
                        <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                          सेट: {log.metadata.quizTitle}
                        </span>
                      )}
                      {typeof log.metadata?.score === 'number' && (
                        <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                          अङ्क: {log.metadata.score}/{log.metadata.totalQuestions || 10}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            देखाउँदै: <strong>{filteredLogs.length}</strong> / {logs.length} गतिविधिहरू
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold transition cursor-pointer"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
