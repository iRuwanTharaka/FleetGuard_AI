import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  CheckCircle,
  Download,
  Share2,
  Mail,
  Printer,
  Home,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import logoFull from 'figma:asset/8af09c45f3c6d32331b9124b980b7c787b7c268e.png';
import { inspectionService } from '@/services/inspectionService';

export function ReportGenerated() {
  const navigate = useNavigate();
  const location = useLocation();
  const { inspection, generateReport, resetInspection } = useInspection();
  const statePdfUrl = (location.state as { pdf_url?: string; inspectionId?: number } | null)?.pdf_url;
  const stateInspectionId = (location.state as { inspectionId?: number } | null)?.inspectionId;
  const [inspectionFromApi, setInspectionFromApi] = useState<{ number_plate?: string; customer_name?: string; health_score?: number; damages?: unknown[] } | null>(null);
  const [isGenerating, setIsGenerating] = useState(!statePdfUrl);
  const [reportId, setReportId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareMethod, setShareMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [shareData, setShareData] = useState({
    phone: inspection.customerInfo?.phone || '',
    email: '',
    message: '',
  });

  useEffect(() => {
    if (stateInspectionId) {
      inspectionService.getOne(stateInspectionId).then((data) => setInspectionFromApi(data));
    }
  }, [stateInspectionId]);

  useEffect(() => {
    if (statePdfUrl != null) {
      setIsGenerating(false);
      setReportId(`INS-${String(stateInspectionId ?? '').padStart(6, '0')}`);
      const plate = inspectionFromApi?.number_plate ?? inspection.vehicleNumber;
      const score = inspectionFromApi?.health_score ?? inspection.healthScore ?? 0;
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      setShareData(prev => ({
        ...prev,
        message: `Your vehicle inspection report for ${plate} is ready. Health Score: ${score}/100. Download: ${base}${statePdfUrl}`,
      }));
      return;
    }
    const generate = async () => {
      try {
        const id = await generateReport();
        setReportId(id);
        setIsGenerating(false);
        setShareData(prev => ({
          ...prev,
          message: `Here is your vehicle inspection report for ${inspection.vehicleNumber}. Health Score: ${inspection.healthScore}/100. View the complete report in the attached PDF.`,
        }));
      } catch (error) {
        console.error('Error generating report:', error);
        toast.error('Failed to generate report');
        setIsGenerating(false);
      }
    };
    generate();
  }, []);

  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');

  const handleDownloadPDF = () => {
    if (statePdfUrl && stateInspectionId) {
      window.open(inspectionService.getPdfUrl(stateInspectionId), '_blank');
      toast.success('Opening report...');
      return;
    }
    try {
      toast.info('Generating professional PDF report...');
      
      // Create PDF with better quality
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPos = 15;

      // Header Section with background
      doc.setFillColor(13, 71, 161); // #0d47a1
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      // Add logo on the left side
      const img = new Image();
      img.src = logoFull;
      try {
        doc.addImage(img, 'PNG', margin, yPos - 3, 45, 18);
      } catch (err) {
        console.warn('Could not add logo to PDF');
      }
      
      // Company Info (right side of header)
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.text('FleetGuard AI', pageWidth - margin, yPos, { align: 'right' });
      yPos += 5;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text('Sri Lanka Fleet Management', pageWidth - margin, yPos, { align: 'right' });
      yPos += 4;
      doc.text('AI-Powered Vehicle Inspections', pageWidth - margin, yPos, { align: 'right' });
      
      yPos = 45;

      // Report Title
      doc.setFontSize(20);
      doc.setTextColor(13, 71, 161);
      doc.setFont(undefined, 'bold');
      doc.text('VEHICLE INSPECTION REPORT', pageWidth / 2, yPos, { align: 'center' });
      yPos += 12;

      // Report Info Bar
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos - 2, pageWidth - 2 * margin, 16, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.setFont(undefined, 'normal');
      doc.text(`Report ID: ${reportId}`, margin + 5, yPos + 4);
      doc.text(`Date: ${format(new Date(), 'PPpp')}`, margin + 5, yPos + 10);
      
      const scoreColor = inspection.healthScore! >= 80 ? [76, 175, 80] : inspection.healthScore! >= 60 ? [251, 191, 36] : [220, 38, 38];
      doc.setTextColor(...scoreColor);
      doc.setFont(undefined, 'bold');
      doc.setFontSize(11);
      doc.text(`Health Score: ${inspection.healthScore}/100`, pageWidth - margin - 5, yPos + 7, { align: 'right' });
      
      yPos += 22;

      // Vehicle Information Section
      doc.setFontSize(12);
      doc.setTextColor(13, 71, 161);
      doc.setFont(undefined, 'bold');
      doc.text('VEHICLE INFORMATION', margin, yPos);
      yPos += 2;
      
      // Section underline
      doc.setDrawColor(33, 150, 243);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Vehicle details in table format
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      
      const vehicleData = [
        ['Vehicle Number:', inspection.vehicleNumber || 'N/A'],
        ['Make:', inspection.vehicleMake || 'N/A'],
        ['Model:', inspection.vehicleModel || 'N/A'],
        ['Year:', String(inspection.vehicleYear || 'N/A')],
      ];

      vehicleData.forEach(([label, value]) => {
        doc.setFont(undefined, 'bold');
        doc.text(label, margin + 5, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(value, margin + 45, yPos);
        yPos += 6;
      });

      yPos += 8;

      // Customer Information Section
      doc.setFontSize(12);
      doc.setTextColor(13, 71, 161);
      doc.setFont(undefined, 'bold');
      doc.text('CUSTOMER INFORMATION', margin, yPos);
      yPos += 2;
      
      doc.setDrawColor(33, 150, 243);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Customer details
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      
      const customerData = [
        ['Name:', inspection.customerInfo?.name || 'N/A'],
        ['NIC/Passport:', inspection.customerInfo?.nicPassport || 'N/A'],
        ['Phone:', inspection.customerInfo?.phone || 'N/A'],
        ['Email:', inspection.customerInfo?.email || 'N/A'],
        ['Rental Start:', format(new Date(inspection.customerInfo!.rentalStartDate), 'PPP')],
        ['Rental End:', format(new Date(inspection.customerInfo!.rentalEndDate), 'PPP')],
      ];

      customerData.forEach(([label, value]) => {
        doc.setFont(undefined, 'bold');
        doc.text(label, margin + 5, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(value, margin + 45, yPos);
        yPos += 6;
      });

      yPos += 8;

      // Inspection Results Section
      doc.setFontSize(12);
      doc.setTextColor(13, 71, 161);
      doc.setFont(undefined, 'bold');
      doc.text('INSPECTION RESULTS', margin, yPos);
      yPos += 2;
      
      doc.setDrawColor(33, 150, 243);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Health Score Box
      doc.setFillColor(...scoreColor);
      doc.roundedRect(margin + 5, yPos - 2, 50, 15, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(`SCORE: ${inspection.healthScore}/100`, margin + 30, yPos + 6, { align: 'center' });
      
      // Status text
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const status = inspection.healthScore! >= 80 ? 'Excellent Condition' : inspection.healthScore! >= 60 ? 'Good Condition' : 'Requires Attention';
      doc.text(`Status: ${status}`, margin + 65, yPos + 6);
      
      yPos += 20;

      // Damage Summary
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`Total Damages Found: ${inspection.damages.length}`, margin + 5, yPos);
      yPos += 10;

      // Damage Details Table
      if (inspection.damages.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(13, 71, 161);
        doc.text('DAMAGE DETAILS', margin, yPos);
        yPos += 2;
        doc.setDrawColor(33, 150, 243);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;

        // Table header
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('#', margin + 2, yPos);
        doc.text('Type', margin + 10, yPos);
        doc.text('Severity', margin + 50, yPos);
        doc.text('Location', margin + 85, yPos);
        doc.text('Confidence', margin + 135, yPos);
        yPos += 8;

        // Table rows
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        
        inspection.damages.forEach((damage, index) => {
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = margin;
            
            // Repeat header on new page
            doc.setFillColor(240, 240, 240);
            doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
            doc.setFont(undefined, 'bold');
            doc.text('#', margin + 2, yPos);
            doc.text('Type', margin + 10, yPos);
            doc.text('Severity', margin + 50, yPos);
            doc.text('Location', margin + 85, yPos);
            doc.text('Confidence', margin + 135, yPos);
            yPos += 8;
            doc.setFont(undefined, 'normal');
          }

          // Alternating row colors
          if (index % 2 === 0) {
            doc.setFillColor(250, 250, 250);
            doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 7, 'F');
          }

          doc.setTextColor(0, 0, 0);
          doc.text(`${index + 1}`, margin + 2, yPos);
          doc.text(damage.type.toUpperCase(), margin + 10, yPos);
          
          // Severity with color
          const sevColor = damage.severity === 'High' ? [220, 38, 38] : damage.severity === 'Medium' ? [251, 191, 36] : [76, 175, 80];
          doc.setTextColor(...sevColor);
          doc.text(damage.severity, margin + 50, yPos);
          
          doc.setTextColor(0, 0, 0);
          doc.text(damage.location, margin + 85, yPos);
          doc.text(`${damage.confidence}%`, margin + 135, yPos);
          
          yPos += 7;
        });
      } else {
        doc.setFillColor(76, 175, 80, 30);
        doc.roundedRect(margin + 5, yPos - 2, pageWidth - 2 * margin - 10, 10, 2, 2, 'F');
        doc.setTextColor(27, 94, 32);
        doc.setFontSize(10);
        doc.text('✓ No damages detected. Vehicle is in excellent condition.', margin + 10, yPos + 4);
        yPos += 12;
      }

      // Add new page for signatures
      doc.addPage();
      yPos = margin + 10;

      // Signatures Section
      doc.setFontSize(12);
      doc.setTextColor(13, 71, 161);
      doc.setFont(undefined, 'bold');
      doc.text('SIGNATURES', margin, yPos);
      yPos += 2;
      doc.setDrawColor(33, 150, 243);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 15;

      // Driver Signature
      if (inspection.driverSignature) {
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('Driver Signature:', margin + 5, yPos);
        yPos += 8;
        
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(margin + 5, yPos, 70, 25);
        
        try {
          doc.addImage(inspection.driverSignature, 'PNG', margin + 8, yPos + 2, 64, 21);
        } catch (err) {
          console.warn('Could not add driver signature');
        }
        
        yPos += 30;
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text('Driver Name', margin + 5, yPos);
        doc.line(margin + 5, yPos + 1, margin + 75, yPos + 1);
        yPos += 10;
      }

      // Customer Signature
      if (inspection.customerSignature) {
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Customer Signature:', margin + 5, yPos);
        yPos += 8;
        
        doc.setDrawColor(200, 200, 200);
        doc.rect(margin + 5, yPos, 70, 25);
        
        try {
          doc.addImage(inspection.customerSignature, 'PNG', margin + 8, yPos + 2, 64, 21);
        } catch (err) {
          console.warn('Could not add customer signature');
        }
        
        yPos += 30;
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(inspection.customerInfo?.name || 'Customer Name', margin + 5, yPos);
        doc.line(margin + 5, yPos + 1, margin + 75, yPos + 1);
      }

      // Agreement text
      yPos += 15;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const agreementText = 'Both parties confirm that all information in this report is accurate and complete. This document serves as an official record of the vehicle condition at the time of inspection.';
      const splitAgreement = doc.splitTextToSize(agreementText, pageWidth - 2 * margin - 10);
      doc.text(splitAgreement, margin + 5, yPos);

      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer line
        doc.setDrawColor(13, 71, 161);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        
        // Footer text
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.setFont(undefined, 'normal');
        doc.text(
          'FleetGuard AI - Vehicle Inspection & Fleet Management System',
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        
        doc.setFontSize(7);
        doc.text(
          `Generated on ${format(new Date(), 'PPpp')} | Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 6,
          { align: 'center' }
        );
      }

      // Save PDF
      doc.save(`FleetGuard-Inspection-${reportId}.pdf`);
      toast.success('Professional PDF report downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleShare = (method: 'whatsapp' | 'email') => {
    setShareMethod(method);
    setShareModalOpen(true);
  };

  const handleSendWhatsApp = () => {
    const phone = shareData.phone.replace(/\D/g, '');
    const message = encodeURIComponent(shareData.message);
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, '_blank');
    toast.success('Opening WhatsApp...');
    setShareModalOpen(false);
  };

  const handleSendEmail = () => {
    if (!shareData.email) {
      toast.error('Please enter an email address');
      return;
    }
    
    toast.success('Email sent successfully');
    setShareModalOpen(false);
  };

  const handlePrint = () => {
    toast.info('Print functionality would open print dialog');
  };

  const handleNewInspection = () => {
    resetInspection();
    navigate('/driver/select-vehicle');
  };

  const handleBackToDashboard = () => {
    navigate('/driver/dashboard');
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2196f3] border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Generating report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Inspection Complete</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Success Message */}
        <Card className="p-6 bg-gradient-to-br from-[#4caf50] to-[#388e3c] text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <CheckCircle className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Report Generated!</h2>
              <p className="text-white/90">Report ID: {reportId}</p>
            </div>
          </div>
        </Card>

        {/* PDF Preview */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3">
              <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Inspection Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">PDF Document</p>
            </div>
          </div>
          
          {/* Report Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Vehicle:</span>
              <span className="font-medium text-gray-900 dark:text-white">{inspection.vehicleNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Customer:</span>
              <span className="font-medium text-gray-900 dark:text-white">{inspection.customerInfo?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Date:</span>
              <span className="font-medium text-gray-900 dark:text-white">{format(new Date(), 'PPp')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Health Score:</span>
              <span className={`font-bold ${
                inspection.healthScore! >= 80 ? 'text-[#4caf50]' : 
                inspection.healthScore! >= 60 ? 'text-[#fbbf24]' : 
                'text-[#dc2626]'
              }`}>
                {inspection.healthScore}/100
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Damages:</span>
              <span className="font-medium text-gray-900 dark:text-white">{inspection.damages.length} found</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white"
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button
            className="bg-[#25D366] hover:bg-[#1fb855] text-white"
            onClick={() => handleShare('whatsapp')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('email')}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 space-y-3">
          <Button
            className="w-full bg-[#2196f3] hover:bg-[#1976d2] text-white"
            onClick={handleNewInspection}
          >
            Start New Inspection
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleBackToDashboard}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
          </DialogHeader>

          <Tabs value={shareMethod} onValueChange={(v) => setShareMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            <TabsContent value="whatsapp" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="phone">Customer Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+94 XX XXX XXXX"
                  value={shareData.phone}
                  onChange={(e) => setShareData({ ...shareData, phone: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="whatsapp-message">Message</Label>
                <Textarea
                  id="whatsapp-message"
                  rows={4}
                  value={shareData.message}
                  onChange={(e) => setShareData({ ...shareData, message: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <Button
                className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white"
                onClick={handleSendWhatsApp}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send via WhatsApp
              </Button>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="email">Customer Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  value={shareData.email}
                  onChange={(e) => setShareData({ ...shareData, email: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  value={`Vehicle Inspection Report - ${inspection.vehicleNumber}`}
                  readOnly
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="email-message">Message</Label>
                <Textarea
                  id="email-message"
                  rows={4}
                  value={shareData.message}
                  onChange={(e) => setShareData({ ...shareData, message: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSendEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}