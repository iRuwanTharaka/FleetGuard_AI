/**
 * @module     Client Portal (Driver-Facing Interface)
 * @author     Yuraj Malinda <yurajmalinda123@gmail.com>
 * @description This file is part of the Client (Driver) Portal of FleetGuard AI.
 *              All pages and components in this section were developed by Yuraj Malinda.
 * @date       2026-02-24
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { ArrowLeft, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function EditDriverProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photoUrl: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    authService.getMe()
      .then((user: any) => {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          photoUrl: user.avatar_url ? `${API_BASE.replace('/api', '')}${user.avatar_url}` : '',
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasUnsavedChanges(true);
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (formData.phone && !/^[0-9+\s-]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
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
    try {
      const fd = new FormData();
      fd.append('name', formData.name.trim());
      if (formData.phone) fd.append('phone', formData.phone.trim());
      if (avatarFile) fd.append('avatar', avatarFile);
      await userService.updateProfile(fd);
      setHasUnsavedChanges(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('Profile updated successfully');
      navigate('/driver/profile');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) return;
    navigate('/driver/profile');
  };

  const handlePhotoChange = () => fileInputRef.current?.click();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setHasUnsavedChanges(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  const avatarSrc = avatarPreview || formData.photoUrl;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6">
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
        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarSrc} alt={formData.name} />
                <AvatarFallback className="bg-[#1976d2] text-white text-2xl">
                  {formData.name.split(' ').map((n) => n[0]).join('') || '?'}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handlePhotoChange}
                className="absolute bottom-0 right-0 bg-[#2196f3] rounded-full p-2 shadow-lg hover:bg-[#1976d2] transition-colors cursor-pointer"
              >
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-sm text-gray-500">Tap to change photo</p>
          </div>
        </Card>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-gray-900 dark:text-white">Full Name <span className="text-red-500">*</span></Label>
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

          <div>
            <Label htmlFor="email" className="text-gray-900 dark:text-white">Email Address</Label>
            <Input id="email" type="email" value={formData.email} disabled className="mt-1.5 bg-gray-100 dark:bg-gray-700" />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-900 dark:text-white">Phone Number</Label>
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

          {hasUnsavedChanges && (
            <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">You have unsaved changes</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Save your changes before leaving.</p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#2196f3] hover:bg-[#1976d2] text-white" disabled={isSaving}>
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