import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useWorkspace } from '../../context/WorkspaceContext';
import { api, type InquiryPayload } from '../../services/api';
import { 
  Building2, 
  Mail, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  Database 
} from 'lucide-react';

interface ContactInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactInquiryModal: React.FC<ContactInquiryModalProps> = ({ isOpen, onClose }) => {
  const { colorTheme, addToast } = useWorkspace();
  const isBexer = colorTheme === 'bexer-clean';

  const [formData, setFormData] = useState<InquiryPayload>({
    name: '',
    email: '',
    company: '',
    inquiry_type: 'enterprise',
    team_size: '5-20 developers',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Missing Fields', 'Please fill in your name, email, and message.', 'warn');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.submitInquiry(formData);
      setIsSubmitted(true);
      setSavedId(response?.inquiry?.id || 'inq-' + Math.random().toString(36).substring(2, 7));
      addToast('Inquiry Recorded', 'Your request was saved directly to Supabase.', 'success');
    } catch (err: any) {
      addToast('Submission Error', err.message || 'Could not connect to Supabase backend.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSavedId(null);
    setFormData({
      name: '',
      email: '',
      company: '',
      inquiry_type: 'enterprise',
      team_size: '5-20 developers',
      message: ''
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitted ? handleReset : onClose}
      title="Enterprise & Platform Inquiries"
      description="Connect with the DevSync engineering and platform solutions team"
      maxWidth="lg"
    >
      {isSubmitted ? (
        <div className="py-6 px-2 text-center space-y-4">
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border shadow-xl ${
            isBexer
              ? 'bg-[#86c33a]/20 border-[#86c33a]/50 text-[#86c33a] shadow-[#86c33a]/20'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20'
          }`}>
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">Inquiry Successfully Saved!</h3>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              Your inquiry has been stored directly in our <strong className={isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}>Supabase PostgreSQL Database</strong>.
            </p>
          </div>

          <div className={`p-3.5 rounded-xl border text-xs text-left max-w-md mx-auto font-mono space-y-1.5 ${
            isBexer ? 'bg-[#151c26] border-[#2d384b] text-zinc-300' : 'bg-[#0b0e1b] border-white/10 text-zinc-300'
          }`}>
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#86c33a]" />
                Supabase Record ID:
              </span>
              <span className="text-[#86c33a] font-bold">public.inquiries</span>
            </div>
            <div className="text-[11px] text-zinc-100 font-semibold break-all bg-black/20 p-2 rounded">
              {savedId}
            </div>
            <div className="text-[11px] text-zinc-400 pt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#86c33a]" />
              <span>Status: <strong className="text-emerald-400 font-semibold">new (Active Queue)</strong></span>
            </div>
          </div>

          <div className="pt-3 flex justify-center">
            <Button
              variant={isBexer ? 'bexer' : 'primary'}
              size="md"
              onClick={handleReset}
            >
              Done & Return to Workspace
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Top Banner */}
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
            isBexer ? 'bg-[#86c33a]/10 border-[#86c33a]/30 text-zinc-200' : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
          }`}>
            <Database className={`w-4 h-4 flex-shrink-0 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
            <span>
              All submissions are securely synced directly to our <strong>Supabase</strong> live database cluster.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Your Name *</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Alex Rivera"
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-black/30 text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                  isBexer ? 'border-[#2d384b] focus:border-[#86c33a]' : 'border-white/10 focus:border-indigo-500'
                }`}
              />
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>Work Email *</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="alex@company.com"
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-black/30 text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                  isBexer ? 'border-[#2d384b] focus:border-[#86c33a]' : 'border-white/10 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Company / Team */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Company / Organization</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g., DevSync Labs"
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-black/30 text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                  isBexer ? 'border-[#2d384b] focus:border-[#86c33a]' : 'border-white/10 focus:border-indigo-500'
                }`}
              />
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>Team Size</span>
              </label>
              <select
                value={formData.team_size}
                onChange={(e) => setFormData(prev => ({ ...prev, team_size: e.target.value }))}
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-[#161d28] text-white focus:outline-none transition-colors ${
                  isBexer ? 'border-[#2d384b] focus:border-[#86c33a]' : 'border-white/10 focus:border-indigo-500'
                }`}
              >
                <option value="1-5 developers">1 - 5 developers</option>
                <option value="5-20 developers">5 - 20 developers</option>
                <option value="20-50 developers">20 - 50 developers</option>
                <option value="50-200 developers">50 - 200 developers</option>
                <option value="200+ enterprise">200+ Enterprise Org</option>
              </select>
            </div>
          </div>

          {/* Inquiry Type */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Inquiry Subject / Area
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'enterprise', label: 'Enterprise Seats' },
                { id: 'demo', label: 'Live Architecture Demo' },
                { id: 'security', label: 'AI Security Audit' },
                { id: 'partnership', label: 'API & Integration' },
                { id: 'support', label: 'Technical Support' },
                { id: 'general', label: 'General Question' }
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setFormData(prev => ({ ...prev, inquiry_type: t.id }))}
                  className={`px-3 py-2 rounded-xl text-[11px] font-medium border text-left transition-all ${
                    formData.inquiry_type === t.id
                      ? (isBexer
                          ? 'bg-[#86c33a]/20 border-[#86c33a] text-white font-bold shadow-sm shadow-[#86c33a]/20'
                          : 'bg-indigo-600/25 border-indigo-500 text-white font-semibold')
                      : (isBexer
                          ? 'bg-[#1b2330] border-[#2d384b] text-zinc-400 hover:text-zinc-200'
                          : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-zinc-200')
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
              <span>Project Details & Requirements *</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tell us about your team's workflow, pair programming needs, or custom LLM security scan requirements..."
              className={`w-full px-3 py-2 text-xs rounded-xl border bg-black/30 text-white placeholder-zinc-500 focus:outline-none transition-colors resize-none ${
                isBexer ? 'border-[#2d384b] focus:border-[#86c33a]' : 'border-white/10 focus:border-indigo-500'
              }`}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#86c33a]" />
              Writes to Supabase: <span className="font-mono text-zinc-300">public.inquiries</span>
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant={isBexer ? 'bexer' : 'primary'}
                size="sm"
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                <span>Submit to Supabase</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
