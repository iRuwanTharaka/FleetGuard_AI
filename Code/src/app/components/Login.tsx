import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a1929]">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-card relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2196f3]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#1565c0]/10 to-transparent rounded-full blur-3xl" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2196f3] to-[#1565c0] flex items-center justify-center shadow-lg shadow-[#2196f3]/20">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">FleetGuard AI</h1>
                <p className="text-sm text-[#1565c0]">Manager Portal</p>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-2">Welcome Back!</h2>
            <p className="text-muted-foreground text-lg">Sign in to manage your fleet</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@fleetguard.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 border-2 border-border focus:border-primary bg-input-background text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 border-2 border-border focus:border-primary bg-input-background text-foreground placeholder:text-muted-foreground pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:text-primary/80 font-semibold">
                Forgot Password?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-gradient-to-r from-[#2196f3] to-[#1565c0] hover:from-[#1976d2] hover:to-[#0d47a1] text-white text-lg font-bold shadow-lg shadow-[#2196f3]/20"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Demo Account Info */}
          <div className="mt-8 p-4 bg-secondary border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground font-medium mb-2">Demo Account Available</p>
            <p className="text-xs text-muted-foreground">
              Just click "Sign In" to explore the dashboard with sample data
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 FleetGuard AI • Built for Sri Lankan Travel Agencies</p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Hero with Sri Lankan Images */}
      <div className="hidden lg:block relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-2 p-4">
          {[
            'https://images.unsplash.com/photo-1544015759-237f87d55ef3?w=600',
            'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=600',
            'https://images.unsplash.com/photo-1578405827843-dba01140f07c?w=600',
            'https://images.unsplash.com/photo-1705730576482-407df8ee3017?w=600',
            'https://images.unsplash.com/photo-1707324021005-a3d0c48cfcbd?w=600',
            'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=600',
          ].map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="rounded-2xl overflow-hidden"
            >
              <img 
                src={img}
                alt={`Sri Lankan Scenery ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1929]/95 via-[#0a1929]/90 to-[#1565c0]/90" />
        
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-xl text-white"
          >
            <div className="inline-flex items-center gap-2 bg-[#2196f3]/20 border border-[#2196f3]/30 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-[#2196f3]" />
              <span className="text-sm text-[#90caf9] font-medium">Trusted by 500+ Agencies</span>
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Protect Every Journey,<br />
              <span className="bg-gradient-to-r from-[#2196f3] to-[#90caf9] bg-clip-text text-transparent">
                Across Sri Lanka
              </span>
            </h2>
            
            <p className="text-xl mb-8 text-[#bbdefb] leading-relaxed">
              AI-powered vehicle inspection platform preventing fraud and optimizing fleet health for travel agencies nationwide.
            </p>
            
            <div className="space-y-6">
              {[
                {
                  stat: 'Rs. 250M+',
                  label: 'Fraud Prevented',
                  desc: 'Timestamped photos eliminate false damage claims'
                },
                {
                  stat: '15,000+',
                  label: 'Vehicles Protected',
                  desc: 'From Colombo to Ella, we guard your fleet'
                },
                {
                  stat: '98%',
                  label: 'Accuracy',
                  desc: 'AI damage detection you can trust'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2196f3] to-[#1565c0] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#2196f3]/20">
                    <span className="text-xl font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2196f3] mb-1">{item.stat}</p>
                    <p className="font-semibold mb-1">{item.label}</p>
                    <p className="text-sm text-[#90caf9]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-white/10">
              <p className="text-sm text-[#90caf9] italic">
                "FleetGuard reduced our damage disputes by 90% and saved us Rs. 3.5M in the first quarter. Best investment we've made!"
              </p>
              <p className="text-sm font-semibold mt-3 text-[#2196f3]">
                - Sandun Perera, Travel Lanka Tours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}