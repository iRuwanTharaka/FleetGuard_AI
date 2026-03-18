import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Car, Shield, Brain, BarChart3, MapPin, Users, CheckCircle, Star, ArrowRight, Zap, Award, Clock, TrendingUp, Camera, FileText, Bell, Activity, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import logoFull from 'figma:asset/55aa009e656ec7bb3a1624f42ee7391769762ee0.png';

export function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            <img 
              src={logoFull} 
              alt="FleetGuard AI" 
              className="h-12 object-contain drop-shadow-lg"
            />
          </motion.div>
          <div className="flex space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                className="bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-white"
                onClick={() => navigate('/driver/login')}
              >
                Driver Login
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                className="bg-[#1b5e20] hover:bg-[#2e7d32] text-white"
                onClick={() => navigate('/manager/login')}
              >
                Manager Login
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Background */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0d47a1]/20 to-slate-950 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1761491713025-a7e66bf9427e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwZmxlZXQlMjBwYXJraW5nJTIwYWVyaWFsfGVufDF8fHx8MTc2OTUyOTY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Fleet Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center px-4 py-2 rounded-full bg-[#1b5e20]/20 backdrop-blur-sm mb-6 border border-[#2e7d32]/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Brain className="h-5 w-5 text-[#4caf50] mr-2" />
                <span className="text-slate-200 font-medium">AI-Powered Vehicle Inspection & Fleet Management</span>
              </motion.div>
              
              <motion.h2 
                className="text-5xl md:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Protect Your Fleet,<br />
                <span className="text-[#4caf50]">Build Trust</span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-slate-400 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Comprehensive AI-powered damage detection, real-time fleet tracking, and smart vehicle assignment 
                for travel agencies across Sri Lanka.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-8 py-6 text-lg"
                    onClick={() => navigate('/driver/dashboard')}
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg"
                    onClick={() => navigate('/manager/dashboard')}
                  >
                    View Demo
                  </Button>
                </motion.div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">100+</div>
                  <div className="text-sm text-slate-500">Active Fleets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">15,000+</div>
                  <div className="text-sm text-slate-500">Inspections</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">Rs 2.3M+</div>
                  <div className="text-sm text-slate-500">Saved Monthly</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#0d47a1]/30"
              >
                <img
                  src="figma:asset/ca6668e346985565d37f7e9a2897955462b4767c.png"
                  alt="FleetGuard AI Dashboard" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
              </motion.div>
              
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-[#2e7d32]/30"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#4caf50]" />
                  <div>
                    <div className="text-white font-bold">95% Accuracy</div>
                    <div className="text-slate-400 text-xs">AI Detection</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Gallery Grid - Sri Lankan Culture */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for Sri Lankan Roads
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Designed specifically for the unique challenges of Sri Lankan travel agencies
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { img: 'https://images.unsplash.com/photo-1694962951262-a5f84ad0da68?w=400', title: 'Heritage Sites' },
            { img: 'https://images.unsplash.com/photo-1707318321915-71b1a42038ce?w=400', title: 'Coastal Beauty' },
            { img: 'https://images.unsplash.com/photo-1628058733047-3b73ee23a164?w=400', title: 'Wildlife' },
            { img: 'https://images.unsplash.com/photo-1649853762237-7ef38a6ea6c0?w=400', title: 'Mountains' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative rounded-xl overflow-hidden group cursor-pointer h-64"
            >
              <img 
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex items-end p-4">
                <h4 className="text-white font-bold text-lg">{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technology Showcase with Images */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Damage Detection */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden group bg-slate-900 border border-slate-800"
          >
            <div className="relative h-96">
              <img 
                src="https://images.unsplash.com/photo-1725199984598-20faa3755843?w=800"
                alt="Damage Detection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
            </div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <Camera className="h-12 w-12 text-[#2196f3] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">AI Damage Detection</h3>
              <p className="text-slate-300 mb-4">
                Advanced computer vision analyzes every scratch, dent, and damage in seconds
              </p>
              <ul className="space-y-2">
                {['Real-time photo analysis', 'Damage severity scoring', 'GPS & timestamp verification'].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-slate-300"
                  >
                    <CheckCircle className="h-4 w-4 text-[#4caf50]" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Fleet Tracking */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden group bg-slate-900 border border-slate-800"
          >
            <div className="relative h-96">
              <img 
                src="https://images.unsplash.com/photo-1638447841552-8194177a5536?w=800"
                alt="GPS Tracking"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
            </div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <MapPin className="h-12 w-12 text-[#4caf50] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Real-Time GPS Tracking</h3>
              <p className="text-slate-300 mb-4">
                Monitor your entire fleet across Sri Lanka with live location updates
              </p>
              <ul className="space-y-2">
                {['Live vehicle locations', 'Route optimization', 'Geofencing alerts'].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-slate-300"
                  >
                    <CheckCircle className="h-4 w-4 text-[#4caf50]" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Flow with Images */}
      <section className="container mx-auto px-4 py-20 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-400">
            Simple 4-step process for complete vehicle protection
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { 
              step: '01', 
              icon: <Camera className="h-8 w-8" />, 
              title: 'Capture Photos', 
              desc: 'Take photos of vehicle from all angles',
              img: 'https://images.unsplash.com/photo-1730817403158-b30479c8d473?w=400'
            },
            { 
              step: '02', 
              icon: <Brain className="h-8 w-8" />, 
              title: 'AI Analysis', 
              desc: 'AI detects and highlights any damages',
              img: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?w=400'
            },
            { 
              step: '03', 
              icon: <FileText className="h-8 w-8" />, 
              title: 'Generate Report', 
              desc: 'Create detailed inspection report',
              img: 'https://images.unsplash.com/photo-1604445415362-2a9840bd5ff6?w=400'
            },
            { 
              step: '04', 
              icon: <CheckCircle className="h-8 w-8" />, 
              title: 'Digital Signature', 
              desc: 'Customer signs to confirm condition',
              img: 'https://images.unsplash.com/photo-1768829781487-a697bc656313?w=400'
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-[#2e7d32]/50 transition-all">
                <div className="relative h-48">
                  <img 
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-[#0d47a1] text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[#4caf50] mb-3">
                    {item.icon}
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Complete Fleet Coverage
          </h2>
          <p className="text-xl text-slate-400">
            From luxury sedans to tourist coaches - we protect every vehicle
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              img: 'https://images.unsplash.com/photo-1758411897888-3ca658535fdf?w=600',
              title: 'Luxury Vehicles',
              count: '200+'
            },
            { 
              img: 'https://images.unsplash.com/photo-1611460470622-edf833bb0e6c?w=600',
              title: 'Modern Fleet',
              count: '150+'
            },
            { 
              img: 'https://images.unsplash.com/photo-1769218402167-b0ef15eaf7cc?w=600',
              title: 'Inspection Ready',
              count: '500+'
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative rounded-2xl overflow-hidden group cursor-pointer h-80"
            >
              <img 
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-6 flex flex-col justify-end">
                <div className="text-[#4caf50] text-3xl font-bold mb-2">{item.count}</div>
                <h4 className="text-white font-bold text-xl">{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Prevent Issues Section with More Images */}
      <section className="container mx-auto px-4 py-20 bg-slate-950">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1762169985718-40919441a74e?w=400"
                alt="Safety Inspection"
                className="rounded-xl h-48 w-full object-cover border border-slate-800"
              />
              <img 
                src="https://images.unsplash.com/photo-1668943620228-f0f9397629f4?w=400"
                alt="Vehicle Cleaning"
                className="rounded-xl h-48 w-full object-cover border border-slate-800"
              />
              <img 
                src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400"
                alt="Vehicle Check"
                className="rounded-xl h-48 w-full object-cover border border-slate-800 col-span-2"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prevent Issues Before They Happen
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Stop damage disputes and false claims with AI-powered inspection that creates an indisputable record
            </p>
            <div className="space-y-4">
              {[
                { icon: <Shield className="h-6 w-6" />, title: 'Complete Documentation', desc: 'Timestamped photos with GPS location' },
                { icon: <CheckCircle className="h-6 w-6" />, title: 'Digital Signatures', desc: 'Customer & driver sign-off on every inspection' },
                { icon: <Zap className="h-6 w-6" />, title: 'Instant Reports', desc: 'Generate PDF reports in seconds' },
                { icon: <Bell className="h-6 w-6" />, title: 'Smart Alerts', desc: 'Get notified of maintenance issues instantly' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 bg-slate-900 backdrop-blur-sm rounded-xl p-4 border border-slate-800"
                >
                  <div className="bg-[#1b5e20]/20 rounded-lg p-3 text-[#4caf50] border border-[#2e7d32]/30">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{item.title}</h4>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sri Lankan Locations */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted Across Sri Lanka
          </h2>
          <p className="text-xl text-slate-400">
            From Colombo to Jaffna, travel agencies trust FleetGuard AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { img: 'https://images.unsplash.com/photo-1664256608032-3007263ab0d6?w=400', name: 'Colombo', location: 'Commercial Capital', vehicles: '150+' },
            { img: 'https://images.unsplash.com/photo-1613694307143-116cf24691fb?w=400', name: 'Kandy', location: 'Cultural Hub', vehicles: '80+' },
            { img: 'https://images.unsplash.com/photo-1760547804788-c37113b00319?w=400', name: 'Galle', location: 'Coastal Paradise', vehicles: '60+' },
            { img: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=400', name: 'Jaffna', location: 'Northern Province', vehicles: '40+' },
          ].map((location, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative rounded-2xl overflow-hidden group cursor-pointer bg-slate-900 border border-slate-800"
            >
              <div className="relative h-64">
                <img 
                  src={location.img}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-[#4caf50] font-bold mb-1">{location.vehicles} Vehicles</div>
                <h4 className="text-white font-bold text-xl">{location.name}</h4>
                <p className="text-slate-300 text-sm">{location.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to Protect Your Fleet
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Brain />, title: 'AI Damage Detection', desc: 'Real-time AI analysis identifies scratches, dents, and damages with 95%+ accuracy', color: 'from-[#0d47a1] to-[#1976d2]' },
            { icon: <Shield />, title: 'Fraud Prevention', desc: 'Prevent false damage claims with timestamped photos and digital signatures', color: 'from-[#1b5e20] to-[#2e7d32]' },
            { icon: <Car />, title: 'Smart Assignment', desc: 'AI recommends best vehicles based on health score, proximity, and customer tier', color: 'from-[#0d47a1] to-[#2196f3]' },
            { icon: <MapPin />, title: 'GPS Fleet Tracking', desc: 'Track vehicle locations across Sri Lanka in real-time', color: 'from-[#1b5e20] to-[#388e3c]' },
            { icon: <BarChart3 />, title: 'Advanced Analytics', desc: 'Comprehensive insights on fleet health, costs, and performance', color: 'from-[#0d47a1] to-[#1976d2]' },
            { icon: <Smartphone />, title: 'Mobile-First Design', desc: 'Optimized for drivers on Android/iOS with offline support', color: 'from-[#1b5e20] to-[#2e7d32]' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#2e7d32]/50 transition-all h-full">
                <div className={`bg-gradient-to-br ${feature.color} rounded-lg p-3 inline-block mb-4`}>
                  {React.cloneElement(feature.icon, { className: 'h-6 w-6 text-white' })}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Travel Agencies Nationwide
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Rajesh Fernando', role: 'Fleet Manager, Colombo Tours', text: 'FleetGuard AI has saved us over Rs. 500,000 in false damage claims. The AI detection is incredibly accurate.', rating: 5 },
            { name: 'Priya Wickramasinghe', role: 'Owner, Kandy Express', text: 'Our drivers love how easy it is to use. Inspections that used to take 20 minutes now take 3 minutes.', rating: 5 },
            { name: 'Anil Perera', role: 'Operations Manager, Galle Rentals', text: 'The smart assignment feature has optimized our fleet utilization by 40%. Best investment we made.', rating: 5 },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 italic">"{testimonial.text}"</p>
              <div>
                <p className="text-white font-bold">{testimonial.name}</p>
                <p className="text-slate-400 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-12"
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Award className="h-8 w-8 mx-auto mb-2 text-[#4caf50]" />, value: '95%', label: 'AI Accuracy' },
              { icon: <TrendingUp className="h-8 w-8 mx-auto mb-2 text-[#4caf50]" />, value: '60%', label: 'Cost Savings' },
              { icon: <Car className="h-8 w-8 mx-auto mb-2 text-[#4caf50]" />, value: '500+', label: 'Vehicles Tracked' },
              { icon: <Activity className="h-8 w-8 mx-auto mb-2 text-[#4caf50]" />, value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {stat.icon}
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section with Background Image */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-[#1b5e20] to-[#0d47a1] rounded-3xl p-12 text-center relative overflow-hidden border border-slate-800"
        >
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Fleet?
            </h2>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              Join 100+ travel agencies across Sri Lanka protecting their fleets with FleetGuard AI
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-white text-[#1b5e20] hover:bg-slate-100 px-12 py-8 text-xl font-bold"
                onClick={() => navigate('/manager/login')}
              >
                Get Started Today <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-slate-800 bg-slate-950">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-[#2196f3]" />
              <span className="text-xl font-bold text-white">FleetGuard AI</span>
            </div>
            <p className="text-slate-400 text-sm">
              AI-powered vehicle inspection and fleet management for Sri Lankan travel agencies
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/design-system')}
                  className="bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-white w-full cursor-pointer"
                >
                  Design System
                </Button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-slate-500 text-sm pt-8 border-t border-slate-800">
          <p>© 2026 FleetGuard AI. Built for Sri Lankan Travel Agencies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}