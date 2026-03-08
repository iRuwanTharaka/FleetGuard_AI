import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { ArrowLeft, CalendarIcon, AlertCircle, User, CreditCard, Phone, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { inspectionService } from '@/services/inspectionService';

export function CustomerDetails() {
  const navigate = useNavigate();
  const { inspection, setCustomerInfo, setCurrentInspectionId } = useInspection();
  
  const [formData, setFormData] = useState({
    name: '',
    nicPassport: '',
    phone: '',
    rentalStartDate: undefined as Date | undefined,
    rentalEndDate: undefined as Date | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check for vehicle selection on mount
  useEffect(() => {
    if (!inspection.vehicleNumber) {
      navigate('/driver/select-vehicle');
    }
  }, [inspection.vehicleNumber, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (!formData.nicPassport.trim()) {
      newErrors.nicPassport = 'NIC or Passport number is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else if (!/^\+?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.rentalStartDate) {
      newErrors.rentalStartDate = 'Rental start date is required';
    }

    if (!formData.rentalEndDate) {
      newErrors.rentalEndDate = 'Rental end date is required';
    } else if (formData.rentalStartDate && formData.rentalEndDate < formData.rentalStartDate) {
      newErrors.rentalEndDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setCustomerInfo({
      name: formData.name,
      nicPassport: formData.nicPassport,
      phone: formData.phone,
      rentalStartDate: formData.rentalStartDate!.toISOString(),
      rentalEndDate: formData.rentalEndDate!.toISOString(),
    });

    try {
      const created = await inspectionService.create({
        vehicle_id: parseInt(inspection.vehicleId!, 10),
        customer_name: formData.name,
        customer_nic: formData.nicPassport,
        customer_phone: formData.phone,
        rental_start: format(formData.rentalStartDate!, 'yyyy-MM-dd'),
        rental_end: format(formData.rentalEndDate!, 'yyyy-MM-dd'),
      });
      setCurrentInspectionId(created.id);
      toast.success('Customer details saved');
      navigate('/driver/inspection/photos');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      toast.error(ax.response?.data?.error || 'Failed to start inspection');
    }
  };

  const handleCancel = () => {
    navigate('/driver/select-vehicle');
  };

  return (
    <div className="min-h-screen relative">
      {/* Professional Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1717323454555-f053c31ff4b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwaW50ZXJmYWNlfGVufDF8fHx8MTc2OTQ3OTE2Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="relative -mx-4 sm:-mx-6 -mt-6 mb-8">
          <div className="relative h-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-950"></div>
            <div className="relative h-full flex items-center px-6 sm:px-8">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancel}
                className="mr-4 text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Customer Details</h1>
                <p className="text-slate-400 text-sm">Step 1 of 3 • Vehicle inspection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 text-white flex items-center justify-center mx-auto mb-2 font-semibold">
                1
              </div>
              <p className="text-white text-xs">Customer</p>
            </div>
            <div className="flex-1 border-t-2 border-white/10 mx-2"></div>
            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-500 flex items-center justify-center mx-auto mb-2 font-semibold">
                2
              </div>
              <p className="text-slate-500 text-xs">Photos</p>
            </div>
            <div className="flex-1 border-t-2 border-white/10 mx-2"></div>
            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-500 flex items-center justify-center mx-auto mb-2 font-semibold">
                3
              </div>
              <p className="text-slate-500 text-xs">Report</p>
            </div>
          </div>
        </div>

        {/* Selected Vehicle - Glassmorphism Card */}
        <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4 p-5">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1765597119459-2fc27a978af3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBzZWRhbiUyMGNhciUyMHNpbHZlcnxlbnwxfHx8fDE3Njk0OTIyMzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Vehicle"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-white mb-1">{inspection.vehicleNumber}</p>
              <p className="text-slate-400 text-sm">
                {inspection.vehicleMake} {inspection.vehicleModel} • {inspection.vehicleYear}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {/* Customer Name */}
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:bg-white/8 transition-all">
            <Label htmlFor="name" className="text-white mb-3 block flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/20 ${
                errors.name ? 'border-red-500/50' : ''
              }`}
            />
            {errors.name && (
              <div className="flex items-center mt-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name}
              </div>
            )}
          </div>

          {/* NIC/Passport */}
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:bg-white/8 transition-all">
            <Label htmlFor="nicPassport" className="text-white mb-3 block flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              NIC or Passport Number <span className="text-red-400">*</span>
            </Label>
            <Input
              id="nicPassport"
              placeholder="Enter ID number"
              value={formData.nicPassport}
              onChange={(e) => {
                setFormData({ ...formData, nicPassport: e.target.value });
                if (errors.nicPassport) setErrors({ ...errors, nicPassport: '' });
              }}
              className={`bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/20 ${
                errors.nicPassport ? 'border-red-500/50' : ''
              }`}
            />
            {errors.nicPassport && (
              <div className="flex items-center mt-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.nicPassport}
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:bg-white/8 transition-all">
            <Label htmlFor="phone" className="text-white mb-3 block flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Number <span className="text-red-400">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+94 XX XXX XXXX"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              className={`bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/20 ${
                errors.phone ? 'border-red-500/50' : ''
              }`}
            />
            {errors.phone && (
              <div className="flex items-center mt-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.phone}
              </div>
            )}
          </div>

          {/* Rental Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:bg-white/8 transition-all">
              <Label className="text-white mb-3 block flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Rental Start Date <span className="text-red-400">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 ${
                      !formData.rentalStartDate && 'text-slate-500'
                    } ${errors.rentalStartDate ? 'border-red-500/50' : ''}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.rentalStartDate ? format(formData.rentalStartDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.rentalStartDate}
                    onSelect={(date) => {
                      setFormData({ ...formData, rentalStartDate: date });
                      if (errors.rentalStartDate) setErrors({ ...errors, rentalStartDate: '' });
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.rentalStartDate && (
                <div className="flex items-center mt-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.rentalStartDate}
                </div>
              )}
            </div>

            {/* End Date */}
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:bg-white/8 transition-all">
              <Label className="text-white mb-3 block flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Rental End Date <span className="text-red-400">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 ${
                      !formData.rentalEndDate && 'text-slate-500'
                    } ${errors.rentalEndDate ? 'border-red-500/50' : ''}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.rentalEndDate ? format(formData.rentalEndDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.rentalEndDate}
                    onSelect={(date) => {
                      setFormData({ ...formData, rentalEndDate: date });
                      if (errors.rentalEndDate) setErrors({ ...errors, rentalEndDate: '' });
                    }}
                    disabled={(date) => {
                      if (formData.rentalStartDate) {
                        return date < formData.rentalStartDate;
                      }
                      return date < new Date(new Date().setHours(0, 0, 0, 0));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.rentalEndDate && (
                <div className="flex items-center mt-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.rentalEndDate}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 p-4 z-20">
        <div className="container mx-auto max-w-3xl flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-md"
          >
            Next: Take Photos
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}