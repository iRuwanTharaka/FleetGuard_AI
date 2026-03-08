import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { ArrowLeft, Camera, CalendarIcon, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function EditDriverProfile() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    name: 'Kamal Perera',
    email: 'kamal.perera@kith.lk',
    phone: '+94 77 123 4567',
    dateOfBirth: new Date(1990, 5, 15),
    address: '123 Main Street, Colombo 07, Sri Lanka',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setHasUnsavedChanges(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);
    setHasUnsavedChanges(false);
    toast.success('Profile updated successfully');
    navigate('/driver/profile');
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/driver/profile');
      }
    } else {
      navigate('/driver/profile');
    }
  };

  const handlePhotoChange = () => {
    toast.info('Photo upload functionality would open here');
  };

  const handleRemovePhoto = () => {
    if (window.confirm('Are you sure you want to remove your profile photo?')) {
      setFormData({ ...formData, photoUrl: '' });
      setHasUnsavedChanges(true);
      toast.success('Profile photo removed');
    }
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
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Photo */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.photoUrl} alt={formData.name} />
                <AvatarFallback className="bg-[#1976d2] text-white text-2xl">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handlePhotoChange}
                className="absolute bottom-0 right-0 bg-[#2196f3] rounded-full p-2 shadow-lg hover:bg-[#1976d2] transition-colors cursor-pointer"
              >
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={handleRemovePhoto}>
              Remove Photo
            </Button>
          </div>
        </Card>

        {/* Edit Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
          {/* Full Name */}
          <div>
            <Label htmlFor="name" className="text-gray-900 dark:text-white">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`mt-1.5 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <div className="flex items-center mt-1.5 text-sm text-red-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-gray-900 dark:text-white">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`mt-1.5 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              placeholder="email@example.com"
            />
            {errors.email && (
              <div className="flex items-center mt-1.5 text-sm text-red-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-gray-900 dark:text-white">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`mt-1.5 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              placeholder="+94 XX XXX XXXX"
            />
            {errors.phone && (
              <div className="flex items-center mt-1.5 text-sm text-red-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.phone}
              </div>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <Label className="text-gray-900 dark:text-white">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1.5"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateOfBirth ? format(formData.dateOfBirth, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dateOfBirth}
                  onSelect={(date) => date && handleInputChange('dateOfBirth', date)}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="text-gray-900 dark:text-white">Address</Label>
            <Textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="mt-1.5"
              placeholder="Enter your address"
            />
          </div>

          {/* Unsaved Changes Warning */}
          {hasUnsavedChanges && (
            <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    You have unsaved changes
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Make sure to save your changes before leaving this page.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#2196f3] hover:bg-[#1976d2] text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}