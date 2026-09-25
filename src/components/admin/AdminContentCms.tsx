import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Search, 
  Layers, 
  RefreshCw, 
  Lock, 
  Check, 
  Sliders, 
  Scale, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { OFFICIAL_SOURCE_REGISTRY } from '../../data/sourceVerificationData';
import { OFFICIAL_SYLLABUS_VERSIONS } from '../../data/syllabusVersionData';
import { MASTER_BOOKS_DATABASE } from '../../data/masterBooksData';
import { useApp } from '../../context/AppContext';

export const AdminContentCms: React.FC = () => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'sources' | 'syllabus' | 'lifecycle' | 'generate'>('sources');
  const [sourcesList, setSourcesList] = useState(OFFICIAL_SOURCE_REGISTRY);

  const handleApproveContent = (title: string) => {
    addToast(`"${title}" लाई Human-Reviewed & Approved मा स्वीकृत गरियो!`, 'success');
  };

  return (
    <div id="admin-content-cms" className="space-y-6 pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B192C] text-white border border-slate-700 shadow-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/50 text-[11px] font-black">
                प्रशासक CMS & अनुसन्धान डेस्क
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-[11px] font-black">
                Zero-Hallucination Policy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              शैक्षिक सामग्री, स्रोत प्रमाणीकरण तथा पाठ्यक्रम CMS
            </h1>
            <p className="text-sm text-[#CBD5E1]">
              आधिकारिक स्रोत दर्ता, पाठ्यक्रम संशोधन तुलना, र AI ड्राफ्ट → मानव समीक्षा (Human Review) → प्रकाशन (Publish) कार्यप्रणाली।
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
              ● Live Admin Mode
            </span>
          </div>
        </div>
      </div>

      {/* 2. CMS Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sources' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>आधिकारिक स्रोत दर्ता (Source Registry)</span>
        </button>

        <button
          onClick={() => setActiveTab('syllabus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'syllabus' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>पाठ्यक्रम संशोधन तुलना (Syllabus Diff)</span>
        </button>

        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'lifecycle' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>प्रकाशन कार्यप्रवाह (Draft → Review → Publish)</span>
        </button>

        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'generate' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>मास्टर बुक जेनेरेटर (Generate Book)</span>
        </button>
      </div>

      {/* 3. Tab Body 1: Source Registry */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
            <strong>⚠️ Anti-Hallucination Hierarchy:</strong> Tier 1 (नेपाल कानुन आयोग, NRB, अर्थ मन्त्रालय) बाहेकका स्रोतहरूलाई प्रमाणीकरण बिना स्थायी अध्ययन सामग्रीमा समावेश गर्न निषेध गरिएको छ।
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            {sourcesList.map(src => (
              <div key={src.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                      {src.tier}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      प्रकाशन: {src.publicationDate} • आर्थिक वर्ष: {src.referenceFiscalYear}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {src.sourceName}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>कभरेज:</strong> {src.topicRef}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    उद्धरण (Citation): {src.officialCitation}
                  </p>
                </div>

                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-black self-start md:self-auto shrink-0 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  {src.verificationStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Tab Body 2: Syllabus Diff Comparator */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              नेपाल राष्ट्र बैंक - सहायक (तह ४) पाठ्यक्रम संशोधन विश्लेषण (२०८२ vs पूर्ववर्ती)
            </h3>

            {OFFICIAL_SYLLABUS_VERSIONS[0].diffFromPreviousVersion?.map((diff, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                    diff.changeType === 'ADDED' 
                      ? 'bg-emerald-600 text-white' 
                      : diff.changeType === 'MODIFIED' 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-rose-600 text-white'
                  }`}>
                    {diff.changeType}
                  </span>
                  <h4 className="font-black text-slate-900 dark:text-white">
                    {diff.topicNameNepali}
                  </h4>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-sky-500 space-y-1">
                  <p><strong>वर्तमान व्यवस्था:</strong> {diff.currentSyllabusText}</p>
                  <p className="text-amber-700 dark:text-amber-400 font-medium">🎯 प्रभाव विश्लेषण: {diff.changeImpactNotice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Tab Body 3: Lifecycle Review */}
      {activeTab === 'lifecycle' && (
        <div className="space-y-4">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
              सामग्री अनुमोदन तथा गुणस्तर चेकलिस्ट (Publishing Pipeline)
            </h3>

            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  अध्याय १: बैंकिङ अवधारणा, विकासक्रम र कानुनी संरचना (Master Chapter 1)
                </h4>
                <p className="text-xs text-slate-500">
                  ३०-बुँदे संरचना, १० अङ्कको नमुना उत्तर, CAR हिसाब र BAFIA दफा ४९ समावेश।
                </p>
              </div>
              <button
                onClick={() => handleApproveContent('Master Chapter 1')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition shadow-xs"
              >
                स्वीकृत एवं प्रकाशित (Approve & Publish)
              </button>
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  अध्याय २: वित्तीय अनुपात र कर्जा-निक्षेप अनुपात (CD Ratio 90%)
                </h4>
                <p className="text-xs text-slate-500">
                  NRB एकीकृत निर्देशन नं. १ र २ का दफाहरू, संख्यात्मक समाधान र परीक्षा ट्र्याप समावेश।
                </p>
              </div>
              <button
                onClick={() => handleApproveContent('Master Chapter 2')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition shadow-xs"
              >
                स्वीकृत एवं प्रकाशित (Approve & Publish)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab Body 4: Generate Master Book */}
      {activeTab === 'generate' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            नयाँ मास्टर पाठ्यपुस्तक कम्पाइलेसन (Generate Master Book Engine)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            कुनै पनि बैंक तथा तहको आधिकारिक पाठ्यक्रम छनोट गरी कभर, विषयसूची, ३०-बुँदे अध्याय, संख्यात्मक हिसाब र विगतका प्रश्नहरू सहितको नयाँ मास्टर बुक स्वतः निर्माण गर्नुहोस्।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => addToast('NRB Level 4 Master Book सफलतापूर्वक निर्माण भयो!', 'success')}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition cursor-pointer"
            >
              <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase">नेपाल राष्ट्र बैंक</span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1">
                NRB तह ४ सहायक मास्टर बुक निर्माण
              </h4>
            </button>

            <button
              onClick={() => addToast('RBB Level 4 Master Book सफलतापूर्वक निर्माण भयो!', 'success')}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition cursor-pointer"
            >
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">राष्ट्रिय वाणिज्य बैंक</span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1">
                RBB तह ४ लिखित मास्टर बुक निर्माण
              </h4>
            </button>

            <button
              onClick={() => addToast('Officer Level 6 Master Book सफलतापूर्वक निर्माण भयो!', 'success')}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition cursor-pointer"
            >
              <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase">अधिकृत स्तर</span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1">
                तह ६ सहायक निर्देशक मास्टर बुक निर्माण
              </h4>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContentCms;
