import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { ArrowLeft, Eye, EyeOff, Check, X, AlertCircle, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function ChangePassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);
  
  const getStrengthLabel = (strength: number) => {
    if (strength < 40) return { label: 'Weak', color: 'text-red-600' };
    if (strength < 70) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Strong', color: 'text-green-600' };
  };

  const strengthData = getStrengthLabel(passwordStrength);

  // Password requirements
  const requirements = [
    { label: 'At least 8 characters', met: formData.newPassword.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.newPassword) },
    { label: 'Contains number', met: /[0-9]/.test(formData.newPassword) },
    { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(formData.newPassword) },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock validation - in real app, backend would validate current password
    const currentPasswordCorrect = true; // Mock validation
    
    if (!currentPasswordCorrect) {
      setErrors({ currentPassword: 'Current password is incorrect' });
      setIsLoading(false);
      toast.error('Current password is incorrect');
      return;
    }

    setIsLoading(false);
    toast.success('Password changed successfully');
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/driver/profile');
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/driver/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Info Card */}
        <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-2">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Secure Your Account</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Use a strong password to protect your account. Avoid using common words or personal information.
              </p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <Label htmlFor="currentPassword" className="text-gray-900 dark:text-white">
              Current Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className={errors.currentPassword ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <div className="flex items-center mt-1.5 text-sm text-red-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.currentPassword}
              </div>
            )}
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword" className="text-gray-900 dark:text-white">
              New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={errors.newPassword ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <div className="flex items-center mt-1.5 text-sm text-red-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.newPassword}
              </div>
            )}

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                  <span className={`font-medium ${strengthData.color}`}>{strengthData.label}</span>
                </div>
                <Progress value={passwordStrength} className="h-2" />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-900 dark:text-white">
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center mt-1.5 text-sm text-red-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Password Requirements */}
          <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Password Requirements:</p>
            <ul className="space-y-2">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-center text-sm">
                  {req.met ? (
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  )}
                  <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                    {req.label}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#2196f3] hover:bg-[#1976d2] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}