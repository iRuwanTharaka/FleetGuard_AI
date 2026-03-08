import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Search, ChevronDown, Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      { q: 'How do I add a new vehicle to the fleet?', a: 'Navigate to Fleet Management and click the "Add Vehicle" button. Fill in the required details including vehicle number, make, model, and upload photos.' },
      { q: 'How do I assign a driver to a vehicle?', a: 'Go to Smart Assignment, enter booking details, and our AI will recommend the best vehicle based on health, location, and availability.' },
    ]
  },
  {
    category: 'Smart Assignment',
    questions: [
      { q: 'How does Smart Assignment work?', a: 'Our AI analyzes vehicle health scores, distances from pickup location, and availability to recommend the optimal vehicle for each booking.' },
      { q: 'Can I override AI recommendations?', a: 'Yes, AI recommendations are suggestions. You can manually assign any available vehicle.' },
    ]
  },
  {
    category: 'Fleet Tracking',
    questions: [
      { q: 'How often are vehicle locations updated?', a: 'Locations are updated when drivers open the app. This is not real-time tracking but last known location.' },
      { q: 'What if a vehicle shows no GPS data?', a: 'This means the driver hasn\'t opened the app recently or location permission is denied.' },
    ]
  },
];

export function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Help & Support</h1>
        <p className="text-slate-600 dark:text-slate-400">Find answers to common questions or contact our support team</p>
      </div>

      {/* Search */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
        <div className="relative p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 dark:text-slate-400" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
            <div className="relative p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((item, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex;
                  const isExpanded = expandedQuestions.includes(globalIndex);

                  return (
                    <div key={questionIndex} className="rounded-xl bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <span className="font-medium text-slate-900 dark:text-white">{item.q}</span>
                        <ChevronDown className={`h-5 w-5 text-slate-600 dark:text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 text-slate-600 dark:text-slate-400 text-sm border-t border-slate-300/50 dark:border-white/10 pt-4">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Still Need Help?</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Contact our support team for assistance</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ContactCard
              icon={<Mail className="h-5 w-5" />}
              title="Email"
              value="support@fleetguard.ai"
              action="Email Us"
            />
            <ContactCard
              icon={<Phone className="h-5 w-5" />}
              title="Phone"
              value="+94 11 123 4567"
              action="Call Now"
            />
            <ContactCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="WhatsApp"
              value="+94 77 123 4567"
              action="Chat Now"
            />
          </div>
          <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-blue-600 dark:text-blue-300 text-sm">
              <strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (Sri Lanka Time)
            </p>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-slate-500">
        <p>FleetGuard AI v1.0.0 • Last updated January 2026</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <button className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</button>
          <span>•</span>
          <button className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</button>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, value, action }: any) {
  return (
    <div className="p-4 rounded-xl bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-center">
      <div className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-3">
        {icon}
      </div>
      <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">{title}</p>
      <p className="text-slate-900 dark:text-white font-medium text-sm mb-3">{value}</p>
      <Button size="sm" variant="outline" className="w-full border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white text-xs">
        {action}
      </Button>
    </div>
  );
}
