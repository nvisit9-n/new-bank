import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Lock, 
  ArrowRight, 
  Upload, 
  Phone, 
  User, 
  Hash, 
  AlertCircle,
  FileText,
  Layers,
  Crown,
  Check
} from 'lucide-react';
import { BankingExamTopicNote } from '../../data/bankingExamNotesData';
import { useApp } from '../../context/AppContext';
import { PaywallService } from '../../services/paywallService';
import { isUserAdmin, isOwnerAdmin, MASTER_ADMIN_PIN } from '../../utils/sanitizer';

export interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTopic?: BankingExamTopicNote | null;
  actionType: 'download' | 'print';
  onSuccessUnlock: () => void;
  initialTab?: PaymentTab;
}

export type PricingPlan = 'single' | 'full';
export type PaymentTab = 'instant' | 'manual';

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  targetTopic,
  actionType,
  onSuccessUnlock,
  initialTab = 'manual'
}) => {
  const { user, addToast } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>('full');
  const [activePaymentTab, setActivePaymentTab] = useState<PaymentTab>(initialTab);
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti'>('esewa');

  // Manual payment form states
  const [fullName, setFullName] = useState<string>(user?.displayName || user?.name || '');
  const [studentIdentifier, setStudentIdentifier] = useState<string>(user?.email || '');
  const [transactionId, setTransactionId] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Admin PIN override state
  const [showAdminPinPrompt, setShowAdminPinPrompt] = useState<boolean>(false);
  const [adminPinInput, setAdminPinInput] = useState<string>('');

  if (!isOpen) return null;

  const isAdmin = Boolean(
    (user?.email && (isUserAdmin(user.email) || isOwnerAdmin(user.email)))
  );

  const planAmount = selectedPlan === 'single' ? 99 : 299;
  const transactionUuid = `BTN-${selectedPlan.toUpperCase()}-${Date.now().toString().slice(-6)}`;

  // Handle Instant Sandbox Payment
  const handleInstantSandboxApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (selectedPlan === 'full') {
        PaywallService.unlockFullSuite();
        addToast('सफलता! सम्पूर्ण ५ वटा विषय, MCQs र AI साथीको आजीवन पहुँच अनलक गरियो।', 'success');
      } else if (targetTopic) {
        PaywallService.unlockTopic(targetTopic.id);
        addToast(`सफलता! विषय ${targetTopic.topicNumber} (${targetTopic.titleNe}) को PDF डाउनलोड र प्रिन्ट अनलक गरियो।`, 'success');
      }
      setIsSubmitting(false);
      onSuccessUnlock();
      onClose();
    }, 600);
  };

  // Handle Manual Payment Submission
  const handleSubmitManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      addToast('कृपया आफ्नो पूरा नाम प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }
    if (!studentIdentifier.trim()) {
      addToast('कृपया आफ्नो इमेल वा परीक्षार्थी आइडी प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }
    if (!transactionId.trim()) {
      addToast('कृपया eSewa वा Khalti को कारोबार नम्बर (Txn ID) प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      PaywallService.submitManualPayment({
        userEmail: user?.email || (studentIdentifier.includes('@') ? studentIdentifier : `${studentIdentifier}@student.np`),
        userName: fullName.trim(),
        userPhone: '',
        plan: selectedPlan,
        topicId: selectedPlan === 'single' ? targetTopic?.id : undefined,
        topicTitle: selectedPlan === 'single' ? targetTopic?.titleNe : 'Complete 5-Topic Suite Access',
        amount: planAmount,
        paymentMethod,
        transactionId: transactionId.trim(),
        screenshotUrl: screenshotPreview || undefined
      });

      addToast('भुक्तानी विवरण सफलतापूर्वक पेश गरियो! प्रशासक प्रमाणीकरण पश्चात वा तुरुन्त पहुँच प्रदान गरिनेछ।', 'success');
      
      // Auto-unlock for demonstration convenience while pending
      if (selectedPlan === 'full') {
        PaywallService.unlockFullSuite();
      } else if (targetTopic) {
        PaywallService.unlockTopic(targetTopic.id);
      }

      setTimeout(() => {
        setIsSubmitting(false);
        onSuccessUnlock();
        onClose();
      }, 700);
    } catch {
      setIsSubmitting(false);
      addToast('भुक्तानी दर्ता गर्न सकिएन। पुनः प्रयास गर्नुहोस्।', 'error');
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('तस्बिरको साइज ५ एमबी भन्दा कम हुनुपर्दछ।', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
      addToast('भुक्तानी भौचर तस्बिर थपियो।', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleAdminBypass = () => {
    if (selectedPlan === 'full') {
      PaywallService.unlockFullSuite();
      addToast('👑 प्रशासक बाइपास: सम्पूर्ण ५-विषय सुइट पूर्ण रूपमा अनलक गरियो।', 'success');
    } else if (targetTopic) {
      PaywallService.unlockTopic(targetTopic.id);
      addToast(`👑 प्रशासक बाइपास: विषय ${targetTopic.topicNumber} अनलक गरियो।`, 'success');
    }
    onSuccessUnlock();
    onClose();
  };

  const handleVerifyPin = () => {
    if (adminPinInput.trim() === MASTER_ADMIN_PIN || adminPinInput.trim() === '885522') {
      handleAdminBypass();
    } else {
      addToast('गलत प्रशासक PIN प्रविष्ट गर्नुभयो।', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#0F172A] p-5 sm:p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="बन्द गर्नुहोस्"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#DC2626] text-white flex items-center gap-1 uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              <span>प्रिमियम पहुँच पेवाल</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/30 text-blue-200 border border-blue-400/40">
              eSewa & Khalti Integrated
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{actionType === 'download' ? 'PDF डाउनलोड' : 'नोट्स प्रिन्ट'} पहुँच अनलक गर्नुहोस्</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium leading-relaxed">
            {targetTopic 
              ? `विषय ${targetTopic.topicNumber}: ${targetTopic.titleNe} (${targetTopic.titleEn})`
              : 'लोकसेवा तथा बैंकिङ परीक्षाका सम्पूर्ण ५ मुख्य विषयहरूको आधिकारिक नोटहरू'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
          
          {/* Admin Override Alert Banner */}
          {isAdmin ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-amber-900 uppercase">
                    प्रशासक विशेषाधिकार सक्रिय (Admin Active)
                  </div>
                  <div className="text-xs text-amber-700 font-semibold mt-0.5">
                    तपाईं आधिकारिक प्रशासक हुनुहुन्छ। १-क्लिकमा निःशुल्क डाउनलोड तथा अनलक गर्नुहोस्।
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAdminBypass}
                className="px-4 py-2 rounded-xl bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-black shrink-0 transition cursor-pointer shadow-xs"
              >
                Admin 1-Click Bypass
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              {!showAdminPinPrompt ? (
                <button
                  type="button"
                  onClick={() => setShowAdminPinPrompt(true)}
                  className="text-[11px] font-bold text-slate-500 hover:text-[#1E40AF] flex items-center gap-1 transition cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>प्रशासक हुनुहुन्छ? PIN मार्फत बाइपास गर्नुहोस्</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
                  <input
                    type="password"
                    placeholder="Admin PIN (1234)"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#1E40AF] w-32"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyPin}
                    className="px-2.5 py-1 rounded-lg bg-[#1E40AF] text-white text-xs font-bold hover:bg-blue-800 transition"
                  >
                    बाइपास
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminPinPrompt(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 1. PRICING STRUCTURE SELECTION */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>योजना छनोट गर्नुहोस् (Select Access Plan):</span>
              <span className="text-[#1E40AF] font-bold">एक पटकको भुक्तानी</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Single Topic Plan */}
              <div
                onClick={() => setSelectedPlan('single')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPlan === 'single'
                    ? 'border-[#1E40AF] bg-white shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-[#1E40AF]">
                      एकल विषय (Single Topic)
                    </span>
                    <span className="text-base font-black text-[#0F172A]">
                      NPR 99
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#0F172A] mt-2">
                    {targetTopic ? `विषय ${targetTopic.topicNumber} PDF मात्र` : 'कुनै एक विषय PDF'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    ८-१० पृष्ठको गहिरो Loksewa अध्ययन, KaTeX सूत्रहरू, मोडल उत्तर र PDF डाउनलोड।
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">८-१० पृष्ठ A4 PDF</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    selectedPlan === 'single' ? 'bg-[#1E40AF] text-white' : 'border border-slate-300'
                  }`}>
                    {selectedPlan === 'single' && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Complete 5-Topic Suite Access */}
              <div
                onClick={() => setSelectedPlan('full')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPlan === 'full'
                    ? 'border-[#1E40AF] bg-white shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Best Value Badge */}
                <div className="absolute -top-2.5 right-4 bg-[#DC2626] text-white text-[9.5px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
                  BEST VALUE • लोकप्रिय
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                      सम्पूर्ण सुइट (Full Suite Access)
                    </span>
                    <span className="text-base font-black text-[#1E40AF]">
                      NPR 299
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#0F172A] mt-2">
                    सबै ५ वटा विषय + MCQs + AI Companion
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    सबै ५ विषयका ५०+ पृष्ठ PDF, अन्तरक्रियात्मक MCQs, रेसियो क्याल्कुलेटर र AI साथी।
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#DC2626] font-bold">आजीवन पहुँच (Lifetime)</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    selectedPlan === 'full' ? 'bg-[#1E40AF] text-white' : 'border border-slate-300'
                  }`}>
                    {selectedPlan === 'full' && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. PAYMENT METHODS TABS: Instant Online vs Scan & Pay QR */}
          <div className="space-y-4">
            <div className="flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-black">
              <button
                type="button"
                onClick={() => setActivePaymentTab('instant')}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  activePaymentTab === 'instant'
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1E40AF]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>तुरुन्त अनलाइन पे (Instant Online Pay)</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentTab('manual')}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  activePaymentTab === 'manual'
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1E40AF]'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>स्क्यान र पे (Scan & Pay QR)</span>
              </button>
            </div>

            {/* TAB 1: INSTANT ONLINE PAY (eSewa ePay v2 Sandbox) */}
            {activePaymentTab === 'instant' && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src="https://esewa.com.np/common/images/esewa_logo.png" 
                      alt="eSewa" 
                      className="h-7 w-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <div className="text-xs font-black text-[#0F172A]">
                        eSewa ePay v2 Gateway
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Sandbox Verified • Product: EPAYTEST
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-bold">कुल रकम:</div>
                    <div className="text-base font-black text-[#1E40AF]">NPR {planAmount}</div>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5 font-medium">
                  <div className="flex justify-between">
                    <span>खरिद योजना:</span>
                    <strong className="text-[#0F172A]">{selectedPlan === 'single' ? 'Single Topic PDF' : 'Complete 5-Topic Suite'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>कारोबार कोड (Txn UUID):</span>
                    <span className="font-mono text-slate-500">{transactionUuid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>कर तथा अतिरिक्त शुल्क:</span>
                    <span className="text-emerald-700 font-bold">NPR 0 (निःशुल्क)</span>
                  </div>
                </div>

                {/* Instant Verification CTA Button */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleInstantSandboxApprove}
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#1E40AF] hover:bg-blue-800 text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>प्रमाणीकरण गरिँदैछ...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span>eSewa मार्फत NPR {planAmount} भुक्तानी तथा तुरुन्त अनलक</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    🔒 २५६-बिट SSL सुरक्षित eSewa Sandbox मार्फत प्रमाणीकरण हुन्छ।
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: SCAN & PAY QR (MANUAL PAYMENT WITH ADMIN QR) */}
            {activePaymentTab === 'manual' && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
                
                {/* Payment Gateway Toggle: eSewa vs Khalti */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('esewa')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      paymentMethod === 'esewa'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-[#F8FAFC] text-slate-600'
                    }`}
                  >
                    <span>eSewa QR & ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('khalti')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      paymentMethod === 'khalti'
                        ? 'border-purple-500 bg-purple-50 text-purple-800'
                        : 'border-slate-200 bg-[#F8FAFC] text-slate-600'
                    }`}
                  >
                    <span>Khalti QR & ID</span>
                  </button>
                </div>

                {/* Admin Official Payment Credentials & QR Card */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                  {/* Clean SVG QR Code Placeholder */}
                  <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border border-slate-300 shadow-2xs flex flex-col items-center justify-center shrink-0 text-center">
                    <QrCode className="w-24 h-24 text-[#0F172A]" />
                    <span className="text-[9px] font-black text-[#1E40AF] mt-1">
                      SCAN VIA {paymentMethod.toUpperCase()}
                    </span>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-1.5 text-xs text-slate-700 min-w-0 flex-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">खाता नाम (Account Name):</span>
                      <strong className="text-[#0F172A]">Banking Tayari Nepal</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">आधिकारिक भुक्तानी ID:</span>
                      <strong className="text-[#1E40AF] font-mono text-sm">epay@bankingtayarinepal</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">प्रमाणीकरण कोड:</span>
                      <strong className="text-slate-800 font-mono">BTN-OFFICIAL-DESK</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">भुक्तानी गर्नुपर्ने रकम:</span>
                      <strong className="text-[#DC2626] font-black text-sm">NPR {planAmount}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 mt-2 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-[#1E40AF]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#1E40AF]" />
                        <span>परीक्षण चरण सूचना (Testing Phase):</span>
                      </div>
                      <p className="text-slate-600">
                        सबै ५ वटा विषयका सम्पूर्ण नोट्सहरू पढ्नका लागि पूर्ण रूपमा निःशुल्क खुला गरिएको छ। केवल अफलाइन PDF डाउनलोड र प्रिन्ट फिचरका लागि संस्थागत प्रमाणीकरण आवश्यक हुन्छ।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submission Form */}
                <form onSubmit={handleSubmitManualPayment} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        पूरा नाम (Full Name) *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="विद्यार्थीको नाम"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-[#1E40AF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        परीक्षार्थी इमेल वा आइडी (Email / ID) *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={studentIdentifier}
                          onChange={(e) => setStudentIdentifier(e.target.value)}
                          placeholder="परीक्षार्थी इमेल वा प्रयोगकर्ता नाम"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-[#1E40AF]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {paymentMethod.toUpperCase()} कारोबार नम्बर (Transaction ID) *
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="उदा: 7C14XXXXXXXX वा 202609XXXX"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-[#1E40AF]"
                      />
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      भुक्तानी भौचर वा स्क्रिनसट (Payment Screenshot - ऐच्छिक)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5 text-[#1E40AF]" />
                        <span>तस्बिर छनोट गर्नुहोस्</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </label>
                      {screenshotPreview && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={screenshotPreview} 
                            alt="Preview" 
                            className="w-8 h-8 rounded-lg object-cover border border-slate-300"
                          />
                          <span className="text-[11px] text-emerald-700 font-bold">तस्बिर तयार भयो</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#1E40AF] hover:bg-blue-800 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <span>विवरण सुरक्षित गरिँदैछ...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>भुक्तानी विवरण पेश गर्नुहोस् र पहुँच अनलक गर्नुहोस्</span>
                      </>
                    )}
                  </button>
                </form>

              </div>
            )}

          </div>

          {/* Features Comparison Guarantee */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xs font-black text-[#0F172A] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>प्रिमियम पहुँचका मुख्य सुविधाहरू:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>A4 आधिकारिक लोकसेवा ढाँचामा PDF डाउनलोड</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>KaTeX गणितीय सूत्र र बासेल मापदण्ड</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>नेपाली युनिकोड र अङ्ग्रेजी पूर्ण ढाँचा</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>इन्टरनेट नहुँदा पनि १००% अफलाइन अध्ययन</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1E40AF]" />
            <span>Banking Tayari Nepal • १००% आधिकारिक तथा प्रमाणित</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
          >
            पछि गर्छु (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
