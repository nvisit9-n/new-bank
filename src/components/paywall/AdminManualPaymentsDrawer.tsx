import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Trash2, Clock, User, Phone, CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';
import { PaywallService, ManualPaymentRequest } from '../../services/paywallService';
import { useApp } from '../../context/AppContext';

export interface AdminManualPaymentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminManualPaymentsDrawer: React.FC<AdminManualPaymentsDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const { addToast } = useApp();
  const [payments, setPayments] = useState<ManualPaymentRequest[]>([]);

  const refreshPayments = () => {
    setPayments(PaywallService.getManualPayments());
  };

  useEffect(() => {
    if (isOpen) {
      refreshPayments();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => refreshPayments();
    window.addEventListener('btn:manual-payment-submitted', handleUpdate);
    window.addEventListener('btn:manual-payment-approved', handleUpdate);
    window.addEventListener('btn:manual-payment-rejected', handleUpdate);
    window.addEventListener('btn:manual-payment-deleted', handleUpdate);

    return () => {
      window.removeEventListener('btn:manual-payment-submitted', handleUpdate);
      window.removeEventListener('btn:manual-payment-approved', handleUpdate);
      window.removeEventListener('btn:manual-payment-rejected', handleUpdate);
      window.removeEventListener('btn:manual-payment-deleted', handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const handleApprove = (payment: ManualPaymentRequest) => {
    PaywallService.approveManualPayment(payment.id);
    addToast(`${payment.userName} को भुक्तानी प्रमाणीकरण भयो र पहुँच प्रदान गरियो।`, 'success');
    refreshPayments();
  };

  const handleReject = (payment: ManualPaymentRequest) => {
    PaywallService.rejectManualPayment(payment.id);
    addToast(`${payment.userName} को भुक्तानी अस्वीकार गरियो।`, 'info');
    refreshPayments();
  };

  const handleDelete = (id: string) => {
    PaywallService.deleteManualPayment(id);
    addToast('रेकर्ड हटाइयो।', 'info');
    refreshPayments();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">म्यानुअल भुक्तानी व्यवस्थापन</h3>
              <p className="text-xs text-slate-300">Admin Paywall & Manual Payment Review</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
          {payments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold">कुनै पनि म्यानुअल भुक्तानी रेकर्ड छैन।</p>
              <p className="text-xs text-slate-400 mt-1">विद्यार्थीले QR भुक्तानी पेश गरेपछि यहाँ देखिनेछ।</p>
            </div>
          ) : (
            payments.map((p) => {
              const statusColor = 
                p.status === 'approved' 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : p.status === 'rejected'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300';

              return (
                <div 
                  key={p.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColor}`}>
                      {p.status === 'approved' ? 'स्वीकृत (Approved)' : p.status === 'rejected' ? 'अस्वीकृत (Rejected)' : 'प्रतीक्षारत (Pending)'}
                    </span>
                    <span className="text-xs font-black text-[#1E40AF]">
                      NPR {p.amount}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-700">
                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.userName}</span>
                      <span className="text-slate-400 font-normal">({p.userEmail})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.userPhone}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-slate-600">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.paymentMethod.toUpperCase()} Txn: <strong>{p.transactionId}</strong></span>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      योजना: <strong className="text-slate-700">{p.plan === 'full' ? 'Complete 5-Topic Suite' : p.topicTitle || 'Single Topic'}</strong>
                    </div>
                  </div>

                  {p.screenshotUrl && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">भुक्तानी भौचर:</span>
                      <a href={p.screenshotUrl} target="_blank" rel="noreferrer" className="inline-block">
                        <img 
                          src={p.screenshotUrl} 
                          alt="Voucher" 
                          className="w-24 h-16 object-cover rounded-lg border border-slate-200 hover:opacity-90"
                        />
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {p.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleApprove(p)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>स्वीकार गर्नुहोस् (Approve)</span>
                        </button>
                      )}
                      {p.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleReject(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>अस्वीकार</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="रेकर्ड मेटाउनुहोस्"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={() => {
              PaywallService.resetAllAccess();
              addToast('सबै पहुँच रिसेट गरियो।', 'info');
            }}
            className="text-slate-500 hover:text-rose-600 font-bold"
          >
            सबै पहुँच रिसेट (Debug Reset)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
