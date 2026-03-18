import { Button } from '@/app/components/ui/button';
import { 
  Shield, 
  Car, 
  Camera, 
  TrendingUp, 
  BarChart3,
  Zap,
  CheckCircle2,
  ArrowRight,
  Award,
  Clock,
  AlertTriangle,
  Users,
  ChevronRight,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-card/95 backdrop-blur-lg border-b border-border z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2196f3] via-[#00897b] to-[#2e7d32] flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-foreground">FleetGuard AI</h1>
                <p className="text-xs bg-gradient-to-r from-[#2196f3] to-[#2e7d32] bg-clip-text text-transparent font-semibold">Sri Lanka's #1 Fleet Solution</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="hover:bg-accent"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-[#2e7d32]" />
                ) : (
                  <Moon className="w-5 h-5 text-[#2196f3]" />
                )}
              </Button>
              <Button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-[#2196f3] via-[#0097a7] to-[#2e7d32] hover:from-[#1976d2] hover:via-[#00796b] hover:to-[#1b5e20] text-white font-semibold shadow-lg shadow-[#2196f3]/30"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Images Grid */}
        <div className="absolute inset-0 opacity-20 dark:opacity-20">
          <div className="grid grid-cols-3 h-full gap-2">
            <div 
              className="bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544015759-237f87d55ef3?w=800)' }}
            />
            <div 
              className="bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1612862862126-865765df2ded?w=800)' }}
            />
            <div 
              className="bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578405827843-dba01140f07c?w=800)' }}
            />
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">AI-Powered Fleet Management</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Protect Your Fleet,<br />
                <span className="bg-gradient-to-r from-[#2196f3] to-[#42a5f5] bg-clip-text text-transparent">
                  Build Trust
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Revolutionary vehicle inspection system designed for Sri Lankan travel agencies. 
                Prevent fraud, optimize maintenance, and increase profits with AI technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-[#2196f3] to-[#1976d2] hover:from-[#1976d2] hover:to-[#1565c0] text-white text-lg px-8 py-6 font-bold shadow-xl shadow-[#2196f3]/20"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6 font-bold"
                >
                  Watch Demo
                  <Camera className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Travel Agencies', icon: Car },
              { value: '15,000+', label: 'Vehicles Protected', icon: Shield },
              { value: 'Rs. 250M+', label: 'Fraud Prevented', icon: TrendingUp },
              { value: '98%', label: 'Customer Satisfaction', icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with Images */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Built for Sri Lankan Roads
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From Colombo to Ella, protect your fleet across every journey
            </p>
          </div>

          {/* Feature 1 - AI Damage Detection */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1705730576482-407df8ee3017?w=800"
                  alt="Sri Lanka Train Journey"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-card/80 backdrop-blur-lg rounded-lg p-4 border border-primary/30">
                    <p className="text-primary font-semibold text-sm mb-1">AI Detection Active</p>
                    <p className="text-foreground text-xs">Scanning for damage...</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-2 mb-4">
                <Camera className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">AI-Powered</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Instant Damage Detection
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Our AI automatically detects scratches, dents, and damage in seconds. 
                No more disputes - timestamped photos with GPS prove exactly what happened.
              </p>
              <ul className="space-y-3">
                {[
                  '95% AI accuracy on damage detection',
                  'Timestamped & GPS-tagged evidence',
                  'Before/after photo comparison',
                  'Automatic report generation'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Feature 2 - Fleet Dashboard */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-2 mb-4">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Real-Time Insights</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Smart Fleet Management
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Monitor your entire fleet from one dashboard. Vehicle health scores, 
                maintenance predictions, and smart assignment suggestions.
              </p>
              <ul className="space-y-3">
                {[
                  'Live vehicle health monitoring',
                  'Predictive maintenance alerts',
                  'Smart customer-vehicle matching',
                  'Cost savings analytics'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800"
                  alt="Ella Sri Lanka"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* Feature 3 - Predictive Analytics */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1707324021005-a3d0c48cfcbd?w=800"
                  alt="Kandy Temple"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Predictive AI</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Predict Issues Before They Happen
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                AI analyzes usage patterns to predict maintenance needs. 
                Fix problems before breakdowns, save thousands on emergency repairs.
              </p>
              <ul className="space-y-3">
                {[
                  'Maintenance forecasting',
                  'Route-based wear analysis',
                  'Seasonal service scheduling',
                  'Cost optimization insights'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sri Lankan Locations Showcase */}
      <section className="py-20 bg-card border-y border-border transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Trusted Across Sri Lanka
              </h2>
              <p className="text-xl text-muted-foreground">
                From tea plantations to beach resorts, FleetGuard protects your fleet everywhere
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { img: 'https://images.unsplash.com/photo-1544015759-237f87d55ef3?w=400', name: 'Tea Country Routes', desc: 'Hill Country Tours' },
              { img: 'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=400', name: 'Sigiriya', desc: 'Cultural Triangle' },
              { img: 'https://images.unsplash.com/photo-1578405827843-dba01140f07c?w=400', name: 'Beach Destinations', desc: 'Coastal Tours' },
              { img: 'https://images.unsplash.com/photo-1732273758145-2e2c781637fa?w=400', name: 'City Routes', desc: 'Urban Transport' },
              { img: 'https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=400', name: 'Galle Fort', desc: 'Southern Province' },
              { img: 'https://images.unsplash.com/photo-1751660762088-2c340bd7be73?w=400', name: 'Wildlife Safari', desc: 'National Parks' },
              { img: 'https://images.unsplash.com/photo-1693307379048-890167f73704?w=400', name: 'Whale Watching', desc: 'Mirissa & Beyond' },
              { img: 'https://images.unsplash.com/photo-1705936981588-a4192f66fcfb?w=400', name: 'Yala National Park', desc: 'Safari Tours' },
              { img: 'https://images.unsplash.com/photo-1742620352125-221261555bd4?w=400', name: 'Urban Mobility', desc: 'Colombo Streets' },
              { img: 'https://images.unsplash.com/photo-1675440059488-8dec8dba32c2?w=400', name: 'Anuradhapura', desc: 'Ancient Cities' },
              { img: 'https://images.unsplash.com/photo-1723779761157-a858c456880d?w=400', name: 'Waterfall Tours', desc: 'Nature Routes' },
              { img: 'https://images.unsplash.com/photo-1707318093816-90aae59c3f1a?w=400', name: 'Coastal Highways', desc: 'Beach Routes' },
            ].map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="group relative rounded-xl overflow-hidden aspect-square cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img 
                  src={location.img}
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929] via-[#0a1929]/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-bold text-sm mb-1">{location.name}</p>
                  <p className="text-primary text-xs">{location.desc}</p>
                </div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need to Protect Your Fleet
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools designed specifically for Sri Lankan travel agencies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: 'AI Photo Inspection',
                desc: 'Automated damage detection with 95% accuracy',
                img: 'https://images.unsplash.com/photo-1708338914870-797de586672d?w=600',
                color: '#2196f3',
                gradient: 'from-[#2196f3] to-[#0097a7]'
              },
              {
                icon: Shield,
                title: 'Fraud Prevention',
                desc: 'GPS-tagged, timestamped evidence for every rental',
                img: 'https://images.unsplash.com/photo-1706256840752-c9444038ac3b?w=600',
                color: '#00897b',
                gradient: 'from-[#00897b] to-[#2e7d32]'
              },
              {
                icon: TrendingUp,
                title: 'Smart Analytics',
                desc: 'Track costs, savings, and fleet performance',
                img: 'https://images.unsplash.com/photo-1664256608032-3007263ab0d6?w=600',
                color: '#1976d2',
                gradient: 'from-[#1976d2] to-[#00695c]'
              },
              {
                icon: AlertTriangle,
                title: 'Damage Alerts',
                desc: 'Instant notifications for any vehicle issues',
                img: 'https://images.unsplash.com/photo-1721992499083-637b6ee0c7ba?w=600',
                color: '#388e3c',
                gradient: 'from-[#388e3c] to-[#1565c0]'
              },
              {
                icon: Clock,
                title: 'Real-Time Tracking',
                desc: 'Monitor check-ins and check-outs live',
                img: 'https://images.unsplash.com/photo-1705730576482-407df8ee3017?w=600',
                color: '#0097a7',
                gradient: 'from-[#0097a7] to-[#2196f3]'
              },
              {
                icon: Users,
                title: 'Driver Management',
                desc: 'Track driver performance and history',
                img: 'https://images.unsplash.com/photo-1704798690646-92524b61ce03?w=600',
                color: '#2e7d32',
                gradient: 'from-[#2e7d32] to-[#00796b]'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.img} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                  <div 
                    className={`absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${feature.gradient}`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width Image Banner with Parallax */}
      <motion.section 
        className="relative h-96 overflow-hidden"
        style={{ opacity, scale }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580635849262-3161a7c99dac?w=1600)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929]/90 to-[#0a1929]/70" />
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Protecting Fleets Across Every Corner of Sri Lanka
            </h2>
            <p className="text-xl text-[#bbdefb] mb-8">
              From Colombo to Jaffna, from Galle to Trincomalee, our AI-powered system safeguards your vehicles on every journey.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-[#90caf9]">Agencies</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <p className="text-3xl font-bold text-white">15K+</p>
                <p className="text-sm text-[#90caf9]">Vehicles</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <p className="text-3xl font-bold text-white">Rs.250M+</p>
                <p className="text-sm text-[#90caf9]">Saved</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Trusted by Travel Agencies Nationwide
            </h2>
            <p className="text-xl text-muted-foreground">
              Real results from Sri Lankan fleet managers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "FleetGuard reduced our damage disputes by 90%. The AI detection is incredibly accurate and has saved us countless hours of manual verification.",
                author: "Sandun Perera",
                company: "Lanka Tours & Travels",
                location: "Colombo",
                gradient: "from-[#2196f3]/10 to-[#0097a7]/10"
              },
              {
                quote: "We saved Rs. 3.5M in the first 6 months. The predictive maintenance alerts helped us avoid major breakdowns during peak tourist season.",
                author: "Nimal Fernando",
                company: "Colombo Cabs",
                location: "Negombo",
                gradient: "from-[#00897b]/10 to-[#2e7d32]/10"
              },
              {
                quote: "Customer trust improved dramatically. Having timestamped photo evidence for every rental eliminated false claims and improved our reputation.",
                author: "Chaminda Silva",
                company: "Island Explorers",
                location: "Kandy",
                gradient: "from-[#1976d2]/10 to-[#00695c]/10"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card border-2 border-border rounded-xl p-6 hover:border-primary/40 transition-all shadow-lg hover:shadow-xl bg-gradient-to-br ${testimonial.gradient}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground mb-6 text-lg italic leading-relaxed">{testimonial.quote}</p>
                <div className="pt-4 border-t border-border">
                  <p className="text-foreground font-semibold">{testimonial.author}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.company}</p>
                  <p className="text-primary text-xs mt-1">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-card border-y border-border">
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-20"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1664256608032-3007263ab0d6?w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2196f3]/5 via-[#00897b]/5 to-[#2e7d32]/5" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Transform Your Fleet?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join 500+ Sri Lankan travel agencies protecting their vehicles with FleetGuard AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-[#2196f3] via-[#0097a7] to-[#2e7d32] hover:from-[#1976d2] hover:via-[#00796b] hover:to-[#1b5e20] text-white text-lg px-10 py-6 font-bold shadow-xl shadow-primary/30"
                >
                  Start Your Free Trial
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <p className="text-muted-foreground text-sm mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1929] dark:bg-[#0a1929] border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2196f3] via-[#00897b] to-[#2e7d32] flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">FleetGuard AI</span>
              </div>
              <p className="text-[#90caf9] text-sm">
                Sri Lanka's most trusted vehicle inspection and fleet management platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-[#90caf9] text-sm">
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">Features</li>
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">Case Studies</li>
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">Demo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-[#90caf9] text-sm">
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-[#90caf9] text-sm">
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-[#4caf50] cursor-pointer transition-colors">Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-[#90caf9] text-sm">
            <p>© 2026 FleetGuard AI. Proudly serving Sri Lankan travel agencies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}