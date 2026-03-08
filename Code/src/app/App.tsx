import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/app/components/ui/sonner';
import { InspectionProvider } from '@/contexts/InspectionContext';
import { DriverLayout } from '@/app/components/layout/DriverLayout';
import { ManagerLayout } from '@/app/components/layout/ManagerLayout';

// Landing & Auth
import { LandingPage } from '@/app/pages/landing/LandingPage';
import { DesignSystem } from '@/app/pages/DesignSystem';
import { DriverLogin } from '@/app/pages/driver/auth/DriverLogin';
import { DriverSignup } from '@/app/pages/driver/auth/DriverSignup';
import { DriverForgotPassword } from '@/app/pages/driver/auth/DriverForgotPassword';
import { ManagerLogin } from '@/app/pages/manager/auth/ManagerLogin';
import { ManagerForgotPassword } from '@/app/pages/manager/auth/ManagerForgotPassword';

// Driver Pages
import { DriverDashboard } from '@/app/pages/driver/DriverDashboard';
import { VehicleSelection } from '@/app/pages/driver/inspection/VehicleSelection';
import { CustomerDetails } from '@/app/pages/driver/inspection/CustomerDetails';
import { PhotoCapture } from '@/app/pages/driver/inspection/PhotoCapture';
import { PhotoReview } from '@/app/pages/driver/inspection/PhotoReview';
import { AIProcessing } from '@/app/pages/driver/inspection/AIProcessing';
import { InspectionResults } from '@/app/pages/driver/inspection/InspectionResults';
import { DigitalSignatures } from '@/app/pages/driver/inspection/DigitalSignatures';
import { ReportGenerated } from '@/app/pages/driver/inspection/ReportGenerated';
import { InspectionHistory } from '@/app/pages/driver/InspectionHistory';
import { InspectionDetail } from '@/app/pages/driver/InspectionDetail';
import { DriverProfile } from '@/app/pages/driver/DriverProfile';
import { EditDriverProfile } from '@/app/pages/driver/EditDriverProfile';
import { ChangePassword } from '@/app/pages/driver/ChangePassword';

// Manager Pages
import { ManagerDashboard } from '@/app/pages/manager/ManagerDashboard';
import { FleetManagement } from '@/app/pages/manager/FleetManagement';
import { VehicleDetails } from '@/app/pages/manager/VehicleDetails';
import { AddEditVehicle } from '@/app/pages/manager/AddEditVehicle';
import { ManagerInspections } from '@/app/pages/manager/ManagerInspections';
import { ManagerInspectionDetail } from '@/app/pages/manager/ManagerInspectionDetail';
import { SmartAssignment } from '@/app/pages/manager/SmartAssignment';
import { MapView } from '@/app/pages/manager/MapView';
import { AnalyticsDashboard } from '@/app/pages/manager/AnalyticsDashboard';
import { ManagerSettings } from '@/app/pages/manager/ManagerSettings';
import { ManagerProfile } from '@/app/pages/manager/ManagerProfile';
import { Notifications } from '@/app/pages/manager/Notifications';
import { HelpSupport } from '@/app/pages/manager/HelpSupport';
import { DriverManagement } from '@/app/pages/manager/DriverManagement';
import { DriverDetail } from '@/app/pages/manager/DriverDetail';
import { AddEditDriver } from '@/app/pages/manager/AddEditDriver';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <InspectionProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/design-system" element={<DesignSystem />} />

            {/* Driver Auth Routes (No Layout) */}
            <Route path="/driver/login" element={<DriverLogin />} />
            <Route path="/driver/signup" element={<DriverSignup />} />
            <Route path="/driver/forgot-password" element={<DriverForgotPassword />} />

            {/* Driver Routes (With Layout) */}
            <Route path="/driver/dashboard" element={<DriverLayout><DriverDashboard /></DriverLayout>} />
            <Route path="/driver/select-vehicle" element={<DriverLayout><VehicleSelection /></DriverLayout>} />
            <Route path="/driver/inspection/customer-details" element={<DriverLayout><CustomerDetails /></DriverLayout>} />
            <Route path="/driver/inspection/photos" element={<DriverLayout><PhotoCapture /></DriverLayout>} />
            <Route path="/driver/inspection/review-photos" element={<DriverLayout><PhotoReview /></DriverLayout>} />
            <Route path="/driver/inspection/processing" element={<DriverLayout><AIProcessing /></DriverLayout>} />
            <Route path="/driver/inspection/results" element={<DriverLayout><InspectionResults /></DriverLayout>} />
            <Route path="/driver/inspection/signatures" element={<DriverLayout><DigitalSignatures /></DriverLayout>} />
            <Route path="/driver/inspection/report" element={<DriverLayout><ReportGenerated /></DriverLayout>} />
            <Route path="/driver/history" element={<DriverLayout><InspectionHistory /></DriverLayout>} />
            <Route path="/driver/history/:id" element={<DriverLayout><InspectionDetail /></DriverLayout>} />
            <Route path="/driver/profile" element={<DriverLayout><DriverProfile /></DriverLayout>} />
            <Route path="/driver/profile/edit" element={<DriverLayout><EditDriverProfile /></DriverLayout>} />
            <Route path="/driver/profile/change-password" element={<DriverLayout><ChangePassword /></DriverLayout>} />

            {/* Manager Routes */}
            <Route path="/manager/login" element={<ManagerLogin />} />
            <Route path="/manager/forgot-password" element={<ManagerForgotPassword />} />
            <Route path="/manager/dashboard" element={<ManagerLayout><ManagerDashboard /></ManagerLayout>} />
            <Route path="/manager/fleet" element={<ManagerLayout><FleetManagement /></ManagerLayout>} />
            <Route path="/manager/fleet/add" element={<ManagerLayout><AddEditVehicle /></ManagerLayout>} />
            <Route path="/manager/fleet/:id" element={<ManagerLayout><VehicleDetails /></ManagerLayout>} />
            <Route path="/manager/fleet/:id/edit" element={<ManagerLayout><AddEditVehicle /></ManagerLayout>} />
            <Route path="/manager/inspections" element={<ManagerLayout><ManagerInspections /></ManagerLayout>} />
            <Route path="/manager/inspections/:id" element={<ManagerLayout><ManagerInspectionDetail /></ManagerLayout>} />
            <Route path="/manager/smart-assignment" element={<ManagerLayout><SmartAssignment /></ManagerLayout>} />
            <Route path="/manager/map" element={<ManagerLayout><MapView /></ManagerLayout>} />
            <Route path="/manager/analytics" element={<ManagerLayout><AnalyticsDashboard /></ManagerLayout>} />
            <Route path="/manager/settings" element={<ManagerLayout><ManagerSettings /></ManagerLayout>} />
            <Route path="/manager/profile" element={<ManagerLayout><ManagerProfile /></ManagerLayout>} />
            <Route path="/manager/notifications" element={<ManagerLayout><Notifications /></ManagerLayout>} />
            <Route path="/manager/help" element={<ManagerLayout><HelpSupport /></ManagerLayout>} />
            <Route path="/manager/drivers" element={<ManagerLayout><DriverManagement /></ManagerLayout>} />
            <Route path="/manager/drivers/:id" element={<ManagerLayout><DriverDetail /></ManagerLayout>} />
            <Route path="/manager/drivers/add" element={<ManagerLayout><AddEditDriver /></ManagerLayout>} />
            <Route path="/manager/drivers/:id/edit" element={<ManagerLayout><AddEditDriver /></ManagerLayout>} />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </InspectionProvider>
    </ThemeProvider>
  );
}