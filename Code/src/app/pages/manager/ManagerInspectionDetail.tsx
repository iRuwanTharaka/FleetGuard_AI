import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, Download, Share2, Car, User, FileText, Activity, CheckCircle, Flag } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { inspectionService } from '@/services/inspectionService';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');

export function ManagerInspectionDetail() {
  const navigate = useNavigate();
  const { inspectionId } = useParams<{ inspectionId: string }>();
  const id = inspectionId ?? '';

  const [inspection, setInspection] = useState<{
    id: string;
    date: string;
    vehicle: { id: string; make: string; model: string; year: number | string };
    customer: { name: string; phone: string; email?: string };
    inspector: { name: string; id: string };
    health: number;
    damages: Array<{ type: string; severity: string; location: string; confidence: number }>;
    photos: string[];
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    inspectionService.getOne(id)
      .then((data: any) => {
        const bbox = (d: any) => (typeof d.bbox_json === 'string' ? JSON.parse(d.bbox_json || '{}') : d.bbox_json || {});
        setInspection({
          id: `#INS-${String(data.id).padStart(6, '0')}`,
          date: new Date(data.created_at).toLocaleString(),
          vehicle: {
            id: data.number_plate,
            make: data.make,
            model: data.model,
            year: (data as any).year ?? 'N/A',
          },
          customer: { name: data.customer_name || '—', phone: data.customer_phone || '—' },
          inspector: { name: data.driver_name || '—', id: String(data.driver_id) },
          health: data.health_score ?? 0,
          damages: (data.damages || []).map((d: any) => ({
            type: (d.damage_type || '').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            severity: (d.severity || '').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            location: bbox(d).location || '—',
            confidence: parseFloat(d.confidence) || 0,
          })),
          photos: (data.photos || []).map((p: any) => p.file_url ? `${API_BASE}${p.file_url}` : '').filter(Boolean),
          status: data.status,
        });
      })
      .catch(() => setInspection(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReview = async (status: 'approved' | 'flagged') => {
    if (!id) return;
    setReviewing(true);
    setError('');
    try {
      await inspectionService.reviewInspection(id, status, reviewNotes);
      setInspection((prev) => (prev ? { ...prev, status: 'reviewed' } : null));
    } catch (e: any) {
      setError(e.response?.data?.error || 'Review failed');
    } finally {
      setReviewing(false);
    }
  };

  const handleDownloadPdf = () => {
    window.open(inspectionService.getPdfUrl(id), '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading inspection...</p>
      </div>
    );
  }
  if (!inspection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Inspection not found.</p>
        <Button variant="outline" onClick={() => navigate('/manager/inspections')}>Back to list</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/manager/inspections')}
            className="border-white/10 text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{inspection.id}</h1>
            <p className="text-slate-400 mt-1">{inspection.date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="border-white/10 text-white">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Car className="h-5 w-5 text-blue-400" />
            <h3 className="font-bold text-white">Vehicle</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{inspection.vehicle.id}</p>
          <p className="text-slate-400">{inspection.vehicle.make} {inspection.vehicle.model} {inspection.vehicle.year}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-green-400" />
            <h3 className="font-bold text-white">Customer</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{inspection.customer.name}</p>
          <p className="text-slate-400">{inspection.customer.phone}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-orange-400" />
            <h3 className="font-bold text-white">Inspector</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{inspection.inspector.name}</p>
          <p className="text-slate-400">{inspection.inspector.id}</p>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="text-center">
          <Activity className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">Health Score</p>
          <p className="text-6xl font-bold text-green-400 mb-2">{inspection.health}</p>
          <p className="text-slate-500">Excellent Condition</p>
        </div>
      </GlassCard>

      <GlassCard title="Detected Damages">
        <div className="space-y-3">
          {inspection.damages.map((damage, index) => (
            <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{damage.type} - {damage.severity}</p>
                  <p className="text-sm text-slate-400">{damage.location}</p>
                </div>
                <p className="text-sm text-slate-500">{damage.confidence}% confidence</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard title="Inspection Photos">
        <div className="grid grid-cols-3 gap-4">
          {inspection.photos.length > 0 ? inspection.photos.map((photo, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden h-40">
              <ImageWithFallback
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          )) : (
            <p className="text-slate-500 col-span-3">No photos</p>
          )}
        </div>
      </GlassCard>

      {inspection.status !== 'reviewed' && (
        <GlassCard title="Review inspection">
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <textarea
            placeholder="Notes (optional)"
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 mb-4 min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={reviewing}
              onClick={() => handleReview('approved')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              disabled={reviewing}
              onClick={() => handleReview('flagged')}
            >
              <Flag className="h-4 w-4 mr-2" />
              Flag
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function GlassCard({ title, children }: any) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
      <div className="relative p-6">
        {title && <h2 className="text-xl font-bold text-white mb-6">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
