import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '@/contexts/InspectionContext';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ArrowLeft, Check, Eraser, PenTool } from 'lucide-react';
import SignaturePad from 'signature_pad';
import { toast } from 'sonner';
import { inspectionService } from '@/services/inspectionService';

export function DigitalSignatures() {
  const navigate = useNavigate();
  const { inspection, currentInspectionId } = useInspection();
  
  const driverCanvasRef = useRef<HTMLCanvasElement>(null);
  const customerCanvasRef = useRef<HTMLCanvasElement>(null);
  const driverPadRef = useRef<SignaturePad | null>(null);
  const customerPadRef = useRef<SignaturePad | null>(null);

  const [driverSigned, setDriverSigned] = useState(false);
  const [customerSigned, setCustomerSigned] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (inspection.healthScore === null) {
      navigate('/driver/inspection/photos');
      return;
    }
    if (!currentInspectionId) {
      navigate('/driver/inspection/results');
      return;
    }

    // Initialize signature pads
    if (driverCanvasRef.current) {
      driverPadRef.current = new SignaturePad(driverCanvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      });
      
      driverPadRef.current.addEventListener('endStroke', () => {
        setDriverSigned(!driverPadRef.current!.isEmpty());
      });
    }

    if (customerCanvasRef.current) {
      customerPadRef.current = new SignaturePad(customerCanvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      });
      
      customerPadRef.current.addEventListener('endStroke', () => {
        setCustomerSigned(!customerPadRef.current!.isEmpty());
      });
    }

    // Handle canvas resize
    const handleResize = () => {
      resizeCanvas(driverCanvasRef.current, driverPadRef.current);
      resizeCanvas(customerCanvasRef.current, customerPadRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const resizeCanvas = (canvas: HTMLCanvasElement | null, pad: SignaturePad | null) => {
    if (!canvas || !pad) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.getContext('2d')!.scale(ratio, ratio);

    pad.clear();
  };

  const clearDriverSignature = () => {
    if (driverPadRef.current) {
      driverPadRef.current.clear();
      setDriverSigned(false);
    }
  };

  const clearCustomerSignature = () => {
    if (customerPadRef.current) {
      customerPadRef.current.clear();
      setCustomerSigned(false);
    }
  };

  const handleBack = () => {
    navigate('/driver/inspection/results');
  };

  const handleGenerateReport = async () => {
    if (!driverSigned || !customerSigned || !agreed) return;
    if (!driverPadRef.current || !customerPadRef.current || driverPadRef.current.isEmpty() || customerPadRef.current.isEmpty()) {
      toast.error('Both signatures are required');
      return;
    }
    if (!currentInspectionId) {
      toast.error('Inspection session lost. Please start again.');
      return;
    }

    setGenerating(true);
    try {
      const driverBlob = await new Promise<Blob | null>((res) =>
        driverPadRef.current!.toBlob((b) => res(b), 'image/png')
      );
      const customerBlob = await new Promise<Blob | null>((res) =>
        customerPadRef.current!.toBlob((b) => res(b), 'image/png')
      );
      if (!driverBlob || !customerBlob) {
        toast.error('Could not capture signatures');
        setGenerating(false);
        return;
      }
      await inspectionService.uploadSignature(currentInspectionId, driverBlob, 'driver');
      await inspectionService.uploadSignature(currentInspectionId, customerBlob, 'customer');
      const { pdf_url } = await inspectionService.generatePdf(currentInspectionId);
      toast.success('Report generated');
      navigate('/driver/inspection/report', { state: { pdf_url, inspectionId: currentInspectionId } });
    } catch (err) {
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const canProceed = driverSigned && customerSigned && agreed;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Digital Signatures</h1>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex-1 text-center">
              <div className="w-8 h-8 rounded-full bg-[#4caf50] text-white flex items-center justify-center mx-auto mb-1 font-semibold">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-[#4caf50] font-medium">Customer</p>
            </div>
            <div className="flex-1 border-t-2 border-[#4caf50] mx-2 mt-[-20px]"></div>
            <div className="flex-1 text-center">
              <div className="w-8 h-8 rounded-full bg-[#4caf50] text-white flex items-center justify-center mx-auto mb-1 font-semibold">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-[#4caf50] font-medium">Photos</p>
            </div>
            <div className="flex-1 border-t-2 border-[#4caf50] mx-2 mt-[-20px]"></div>
            <div className="flex-1 text-center">
              <div className="w-8 h-8 rounded-full bg-[#2196f3] text-white flex items-center justify-center mx-auto mb-1 font-semibold">
                3
              </div>
              <p className="text-[#2196f3] font-medium">Report</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Instructions */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-2">
              <PenTool className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">Signature Required</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Both driver and customer must sign to complete the inspection report.
              </p>
            </div>
          </div>
        </Card>

        {/* Driver Signature */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Driver Signature</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Signing as: <span className="font-medium">Driver Name</span>
              </p>
            </div>
            {driverSigned && (
              <div className="flex items-center text-[#4caf50]">
                <Check className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Signed</span>
              </div>
            )}
          </div>
          
          <Card className="overflow-hidden">
            <div className="bg-white p-1">
              <canvas
                ref={driverCanvasRef}
                className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded cursor-crosshair"
                style={{ height: '200px', touchAction: 'none' }}
              />
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearDriverSignature}
                disabled={!driverSigned}
              >
                <Eraser className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </Card>
        </div>

        {/* Customer Signature */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Signature</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customer: <span className="font-medium">{inspection.customerInfo?.name}</span>
              </p>
            </div>
            {customerSigned && (
              <div className="flex items-center text-[#4caf50]">
                <Check className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Signed</span>
              </div>
            )}
          </div>
          
          <Card className="overflow-hidden">
            <div className="bg-white p-1">
              <canvas
                ref={customerCanvasRef}
                className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded cursor-crosshair"
                style={{ height: '200px', touchAction: 'none' }}
              />
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCustomerSignature}
                disabled={!customerSigned}
              >
                <Eraser className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </Card>
        </div>

        {/* Agreement Checkbox */}
        <Card className="p-4 bg-white dark:bg-gray-800">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label
              htmlFor="agreement"
              className="text-sm text-gray-900 dark:text-white leading-relaxed cursor-pointer flex-1"
            >
              I confirm that all information provided in this inspection report is accurate and complete. Both parties
              acknowledge the current condition of the vehicle as documented.
            </label>
          </div>
        </Card>

        {/* Warning if not all signed */}
        {(!driverSigned || !customerSigned || !agreed) && (
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-lg p-2">
                <PenTool className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Action Required</p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                  {!driverSigned && <li>• Driver signature required</li>}
                  {!customerSigned && <li>• Customer signature required</li>}
                  {!agreed && <li>• Agreement confirmation required</li>}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 md:relative md:border-0 md:p-0">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleBack}>
              Back to Results
            </Button>
            <Button
              className="flex-1 bg-[#2196f3] hover:bg-[#1976d2] text-white"
              onClick={handleGenerateReport}
              disabled={!canProceed || generating}
            >
              {generating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}