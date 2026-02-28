import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Zap, Shield, Crown, Users, TrendingUp, DollarSign, 
  Brain, MessageSquare, Calendar, Send, Search, FileText,
  Bot, BarChart3, ChevronRight, CheckCircle, Sparkles,
  ArrowRight, Gift, Wallet, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { CursorSpotlight } from "@/components/cursor-spotlight";

const aiCapabilities = [
  { icon: MessageSquare, title: "Answer questions 24/7", desc: "Provides around-the-clock responses for administrators, prospective patients, and families" },
  { icon: Calendar, title: "Book consultations", desc: "Schedules confidential calls or assessments and sends automatic reminders" },
  { icon: Send, title: "Send follow-ups", desc: "Checks in with inquiries and keeps communication consistent so no lead is missed" },
  { icon: Search, title: "Find potential clients", desc: "Identifies and engages people actively searching for treatment services" },
  { icon: FileText, title: "Create marketing content", desc: "Produces and distributes video marketing, social media posts, and educational content" },
  { icon: Brain, title: "Do research online", desc: "Gathers insights on trends, competitors, and local demand to support smarter strategy" },
  { icon: Zap, title: "Automate operations", desc: "Organizes intake forms, updates records, and routes messages efficiently" },
  { icon: BarChart3, title: "Provide insights", desc: "Analyzes performance, marketing data, and trends to help you scale" },
];

export default function Sponsor() {
  const { user, loading: authLoading } = useAuth();
  const { profile, upsertProfile, profileLoading } = useProfile();
  const [, setLocation] = useLocation();
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  const isSponsor = profile?.role === "sponsor";
  const canActivate = user && !isSponsor;

  const handleActivate = async () => {
    if (!user) {
      setLocation("/?signin=true");
      return;
    }

    setActivating(true);
    try {
      const { error } = await upsertProfile({ role: "sponsor" });
      if (!error) {
        setActivated(true);
      }
    } catch (err) {
      console.error("Failed to activate sponsor:", err);
    }
    setActivating(false);
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white noise-overlay">
      <CursorSpotlight />
      
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-gradient">
            Omni AI
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setLocation("/?signin=true")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeUp}
          className="text-center py-16 px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card neon-border mb-6">
            <Gift className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Sponsor Program</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Become a Sponsor</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Invest in AI infrastructure and marketing. Watch your money grow through affiliate contracts and AI-powered automation.
          </p>

          {canActivate && (
            <Button 
              onClick={handleActivate}
              disabled={activating || activated}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-lg px-8 py-6"
            >
              {activated ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Activated! Go to Dashboard
                </>
              ) : activating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                  Activating...
                </>
              ) : (
                <>
                  Activate Sponsor Status
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          )}

          {isSponsor && (
            <div className="mt-6">
              <Button 
                onClick={() => setLocation("/dashboard")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-lg px-8 py-6"
              >
                View Your Sponsor Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </motion.div>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Where is your money going?
              </h2>
              <p className="text-gray-400">Your investment powers two critical areas</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={fadeUp}>
                <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border-purple-500/20 h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
                      <Brain className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">AI Infrastructure</h3>
                    <p className="text-gray-400">
                      Building and maintaining powerful AI systems that work 24/7 to grow your business
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="bg-gradient-to-br from-pink-900/30 to-pink-800/10 border-pink-500/20 h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-4">
                      <TrendingUp className="w-8 h-8 text-pink-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Marketing</h3>
                    <p className="text-gray-400">
                      Promoting affiliate contracts and driving revenue through strategic campaigns
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What the AI Infrastructure Does
              </h2>
              <p className="text-gray-400">8 powerful AI capabilities working for you</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {aiCapabilities.map((cap, idx) => (
                <motion.div key={idx} variants={fadeUp}>
                  <Card className="bg-white/5 border-white/10 hover:border-purple-500/30 transition-colors h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                        <cap.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <h4 className="font-semibold mb-2">{cap.title}</h4>
                      <p className="text-sm text-gray-400">{cap.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How You'll See Results
              </h2>
              <p className="text-gray-400">Track everything in your sponsor dashboard</p>
            </motion.div>

            <div className="space-y-4">
              {[
                { icon: CheckCircle, title: "Tasks Completed", desc: "See all the work your AI has done" },
                { icon: DollarSign, title: "Revenue Generated", desc: "Track earnings from affiliate contracts" },
                { icon: Building2, title: "Assets (Businesses)", desc: "Number of businesses under your affiliate contracts" },
                { icon: Bot, title: "AI Agents", desc: "Personal Assistant, Newsletter Agent, Marketing Agent" },
              ].map((item, idx) => (
                <motion.div key={idx} variants={fadeUp}>
                  <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/10">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{item.title}</h4>
                        <p className="text-gray-400">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 ml-auto" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-b from-purple-900/20 to-transparent">
          <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-gray-400 mb-8">
              Join the sponsor program and let AI work for you around the clock
            </p>
            {user && !isSponsor ? (
              <Button 
                onClick={handleActivate}
                disabled={activating || activated}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-lg px-8 py-6"
              >
                {activated ? "Activated!" : "Activate Now"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : !user ? (
              <Button 
                onClick={() => setLocation("/?signin=true")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-lg px-8 py-6"
              >
                Sign In to Activate
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : null}
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          © 2025 Omni Leads LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
