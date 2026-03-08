import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shield, Mail, Lock, Eye, EyeOff, BarChart3, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import logoFull from 'figma:asset/55aa009e656ec7bb3a1624f42ee7391769762ee0.png';
import { authService } from '@/services/authService';

export function ManagerLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await authService.login({ email, password });
      navigate(user.role === 'manager' ? '/manager/dashboard' : '/driver/dashboard');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Multi-layer Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        {/* Background Image Layer */}
        <div className="absolute inset-0 opacity-30">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1761491713025-a7e66bf9427e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwZmxlZXQlMjBwYXJraW5nJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3Njk1MTM4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fleet background"
            className="w-full h-full object-cover scale-110 animate-slow-zoom"
          />
        </div>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-slate-950/90"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="w-full max-w-6xl relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding with Images */}
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
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Manager Portal</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Comprehensive fleet management and AI-powered analytics platform
              </p>
            </div>
          </div>
          
          {/* Feature Cards with Images */}
          <div className="space-y-4">
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Analytics Dashboard"
              description="Real-time insights and performance metrics"
              image="https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmbGVldCUyMG1hbmFnZW1lbnQlMjBvZmZpY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2OTUxMzg5MXww&ixlib=rb-4.1.0&q=80&w=1080"
              delay={100}
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Smart Assignment"
              description="AI-powered vehicle allocation system"
              image="https://images.unsplash.com/photo-1543171165-6ec6ede147ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB2ZWhpY2xlJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc2OTUxMzg5MXww&ixlib=rb-4.1.0&q=80&w=1080"
              delay={200}
            />
            <FeatureCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Predictive Maintenance"
              description="Prevent issues before they occur"
              image="https://images.unsplash.com/photo-1665491641078-1f8b275c8108?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY5NTEzODkyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              delay={300}
            />
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <Shield className="h-10 w-10 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold">Enterprise-Grade Security</p>
              <p className="text-slate-400 text-sm">Protected by bank-level encryption</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
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
            <p className="text-slate-400 text-sm">Manager Portal</p>
          </div>

          {/* Glassmorphism Login Card */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Glass effect */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10"></div>
            
            {/* Content */}
            <div className="relative p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400">Sign in to your manager dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                    {error}
                  </div>
                )}
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
                      placeholder="manager@kith.lk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/20 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password" className="text-slate-300 mb-2 block">Password</Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/20 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="border-white/20" />
                    <label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link to="/manager/forgot-password" className="text-sm text-slate-300 hover:text-white transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-md font-semibold rounded-xl transition-all"
                >
                  {loading ? 'Signing in...' : 'Access Manager Dashboard'}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-transparent text-slate-400">OR</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white rounded-xl transition-all"
                >
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </Button>
              </form>

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
            FleetGuard AI © 2026 • Enterprise Fleet Management
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