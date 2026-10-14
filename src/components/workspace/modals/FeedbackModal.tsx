import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { api, type FeedbackPayload } from '../../../services/api';
import { 
  Bug, 
  Lightbulb, 
  ShieldAlert, 
  Star, 
  Send, 
  CheckCircle2, 
  Database 
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { colorTheme, activeSession, addToast } = useWorkspace();
  const isBexer = colorTheme === 'bexer-clean';

  const [category, setCategory] = useState<FeedbackPayload['category']>('feature_request');
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      addToast('Feedback Required', 'Please enter your thoughts or report.', 'warn');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitFeedback({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        category,
        rating,
        feedback: feedback.trim(),
        room_id: activeSession?.id
      });
      setIsSubmitted(true);
      addToast('Feedback Saved', 'Your feedback is saved in Supabase public.feedback_reports', 'success');
    } catch (err: any) {
      addToast('Error', err.message || 'Failed to submit feedback.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFeedback('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitted ? handleReset : onClose}
      title="Feedback & Vulnerability Reports"
      description="Help shape DevSync pair programming and autonomous AI code review"
      maxWidth="md"
    >
      {isSubmitted ? (
        <div className="py-6 px-2 text-center space-y-4">
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border shadow-xl ${
            isBexer
              ? 'bg-[#86c33a]/20 border-[#86c33a]/50 text-[#86c33a]'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          }`}>
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-zinc-300">
              Saved directly to our <strong className={isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}>Supabase public.feedback_reports</strong> table.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Button variant={isBexer ? 'bexer' : 'primary'} size="sm" onClick={handleReset}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'feature_request', label: 'Feature Idea', icon: Lightbulb },
                { id: 'bug', label: 'Bug Report', icon: Bug },
                { id: 'security', label: 'Security Flag', icon: ShieldAlert },
                { id: 'general', label: 'General Review', icon: Star }
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategory(c.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                      category === c.id
                        ? (isBexer
                            ? 'bg-[#86c33a]/20 border-[#86c33a] text-white font-bold'
                            : 'bg-indigo-600/25 border-indigo-500 text-white font-semibold')
                        : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Experience Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                    rating >= star ? 'text-amber-400' : 'text-zinc-600'
                  }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
              <span className="text-xs text-zinc-400 ml-2 font-mono">{rating}/5 Stars</span>
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Your Feedback or Findings *
            </label>
            <textarea
              required
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What worked well, or what needs improvement?"
              className={`w-full px-3 py-2 text-xs rounded-xl border bg-black/30 text-white placeholder-zinc-500 focus:outline-none transition-colors resize-none ${
                isBexer ? 'border-[#2d384b] focus:border-[#86c33a]' : 'border-white/10 focus:border-indigo-500'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              className="px-3 py-1.5 text-xs rounded-xl border border-white/10 bg-black/30 text-white placeholder-zinc-500 focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="px-3 py-1.5 text-xs rounded-xl border border-white/10 bg-black/30 text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
              <Database className="w-3 h-3 text-[#86c33a]" />
              public.feedback_reports
            </span>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant={isBexer ? 'bexer' : 'primary'}
                size="sm"
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
