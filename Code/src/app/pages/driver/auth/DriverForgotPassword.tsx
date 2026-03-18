import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Mail, ArrowLeft, CheckCircle, Zap, Activity } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import logoFull from 'figma:asset/55aa009e656ec7bb3a1624f42ee7391769762ee0.png';

export function DriverForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Multi-layer Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Background Image Layer */}
        <div className="absolute inset-0 opacity-30">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1621962225583-94d5bf016eb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwZmxlZXQlMjBwYXJraW5nJTIwbmlnaHR8ZW58MXx8fHwxNzY5NDk1ODczfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fleet background"
            className="w-full h-full object-cover scale-110 animate-slow-zoom"
          />
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="w-full max-w-6xl relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-8 animate-fade-in-up">
          {/* Logo Section */}
          <div className="space-y-6">
            <div 
              className="inline-block cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/')}
            >
              <img 
                src={logoFull} 
                alt="FleetGuard AI" 
                className="h-20 object-contain drop-shadow-2xl"
              />
            </div>
            <p className="text-lg text-slate-300 leading-relaxed">
              Reset your password and get back to protecting your fleet
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="space-y-4">
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Secure Reset Process"
              description="Your password reset link is encrypted and secure"
              image="https://images.unsplash.com/photo-1758411897888-3ca658535fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjB0ZWNobm9sb2d5JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2OTQ5NTg3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
              delay={100}
            />
            <FeatureCard
              icon={<Activity className="h-5 w-5" />}
              title="Quick Recovery"
              description="Get back to work in minutes"
              image="https://images.unsplash.com/photo-1758369636841-241369c12f3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2ZWhpY2xlJTIwaW50ZXJpb3IlMjBkZXRhaWx8ZW58MXx8fHwxNzY5NDk1ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080"
              delay={200}
            />
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="w-full animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-8">
            <div 
              className="inline-block mb-3 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/')}
            >
              <img 
                src={logoFull} 
                alt="FleetGuard AI" 
                className="h-14 object-contain drop-shadow-2xl"
              />
            </div>
            <p className="text-slate-400 text-sm">Reset Password</p>
          </div>

          {/* Glassmorphism Card */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Glass effect */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10"></div>
            
            {/* Content */}
            <div className="relative p-8 space-y-6">
              {!sent ? (
                <>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-slate-400">We'll send you a reset link via email</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                      <Label htmlFor="email" className="text-slate-300 mb-2 block">Email Address</Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="driver@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/20 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    {/* Send Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-md font-semibold rounded-xl transition-all"
                    >
                      Send Reset Link
                    </Button>

                    {/* Back to Login */}
                    <Link to="/driver/login">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-12 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white rounded-xl transition-all"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                      </Button>
                    </Link>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="h-16 w-16 text-[#4caf50] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Check Your Email</h3>
                  <p className="text-slate-400 mb-6">
                    We've sent a password reset link to <strong className="text-white">{email}</strong>
                  </p>
                  <Link to="/driver/login">
                    <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-md font-semibold rounded-xl transition-all">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              )}

              {/* Back Link */}
              <div className="text-center">
                <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 mt-6 text-sm">
            FleetGuard AI © 2026 • Professional Fleet Management
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, image, delay }: any) {
  return (
    <div 
      className="group relative rounded-2xl overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Glassmorphism Card */}
      <div className="relative flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}