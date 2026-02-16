import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, Mail, Building2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const purposeOptions = [
  "Strategic Alignment & Vision Roadmap",
  "Implementation & Execution Planning",
  "Performance Review & Optimization Strategy",
];

export function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPhone("");
      setBusinessName("");
      setPurpose("");
      setIsSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const isValid = name.trim() && validateEmail(email) && phone.trim() && businessName.trim() && purpose;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/demo-booking", {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        businessName: businessName.trim(),
        purpose,
      });
      setIsSuccess(true);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md glass-card neon-border rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSuccess ? (
            <>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-1" data-testid="text-demo-heading">
                Book a Demo
              </h2>
              <p className="text-gray-400 text-sm text-center mb-6">
                Let's explore how Omni AI can transform your business
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required
                    data-testid="input-demo-name"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required
                    data-testid="input-demo-email"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required
                    data-testid="input-demo-phone"
                  />
                </div>

                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required
                    data-testid="input-demo-business"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Purpose</p>
                  <div className="space-y-2">
                    {purposeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPurpose(option)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                          purpose === option
                            ? "border-purple-500/50 bg-purple-500/10"
                            : "border-white/10 bg-white/5"
                        }`}
                        data-testid={`button-purpose-${option.split(" ")[0].toLowerCase()}`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                            purpose === option
                              ? "border-purple-500 bg-purple-500"
                              : "border-white/30"
                          }`}
                        >
                          {purpose === option && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-200">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white py-5 text-base font-medium rounded-lg neon-glow"
                  data-testid="button-submit-demo"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2" data-testid="text-demo-success">
                Request Submitted
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                We'll be in touch soon to schedule your demo.
              </p>
              <Button
                variant="outline"
                className="border-white/20 bg-transparent text-gray-300"
                onClick={onClose}
                data-testid="button-close-success"
              >
                Close
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
