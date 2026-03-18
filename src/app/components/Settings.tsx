import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { 
  Building2, 
  Users, 
  Settings as SettingsIcon, 
  Link as LinkIcon,
  CreditCard,
  Upload
} from 'lucide-react';
import { motion } from 'motion/react';

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Hero Banner with Sri Lankan Imagery */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden h-48 shadow-xl"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1707324021005-a3d0c48cfcbd?w=1200)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929]/95 via-[#0a1929]/80 to-transparent dark:from-[#0a1929]/95 dark:via-[#0a1929]/80" />
        <div className="relative z-10 h-full flex items-center p-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2196f3]/20 to-[#2e7d32]/20 border border-[#2196f3]/30 rounded-full px-4 py-2 mb-3 backdrop-blur-sm">
              <SettingsIcon className="w-4 h-4 text-[#4caf50]" />
              <span className="text-sm text-[#90caf9] dark:text-[#90caf9] font-medium">System Configuration</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-lg text-[#bbdefb]">Manage your agency settings and preferences</p>
          </div>
        </div>
      </motion.div>

      {/* Settings Tabs */}
      <Tabs defaultValue="agency" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="agency">
            <Building2 className="w-4 h-4 mr-2" />
            Agency
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="system">
            <SettingsIcon className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <LinkIcon className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Agency Profile Tab */}
        <TabsContent value="agency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agency Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Agency Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>

              {/* Business Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" defaultValue="Sri Lanka Travel Tours" className="bg-input-background border-border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration">Registration Number</Label>
                  <Input id="registration" defaultValue="REG-2020-SL-12345" className="bg-input-background border-border text-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Galle Road, Colombo 03, Sri Lanka" className="bg-input-background border-border text-foreground" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+94 11 234 5678" className="bg-input-background border-border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="info@srilankataxi.lk" className="bg-input-background border-border text-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Input id="operatingHours" defaultValue="24/7 - Open Daily" className="bg-input-background border-border text-foreground" />
              </div>

              <Button className="bg-gradient-to-r from-[#2196f3] to-[#0097a7] hover:from-[#1976d2] hover:to-[#00796b] text-white">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Button className="bg-gradient-to-r from-[#2196f3] to-[#2e7d32] hover:from-[#1976d2] hover:to-[#1b5e20] text-white">
                  Add New User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Pradeep Silva', role: 'Fleet Manager', email: 'pradeep@agency.lk' },
                  { name: 'Sanduni Fernando', role: 'Admin', email: 'sanduni@agency.lk' },
                  { name: 'Kamal Perera', role: 'Driver', email: 'kamal@agency.lk' },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-[#1A2332]">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{user.role}</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI & Inspection Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1A2332]">AI Damage Detection Sensitivity</p>
                    <p className="text-sm text-gray-600">Adjust how strict the AI is in detecting damage</p>
                  </div>
                  <select className="border rounded-lg px-3 py-2" defaultValue="Medium (85% confidence)">
                    <option>High (95% confidence)</option>
                    <option>Medium (85% confidence)</option>
                    <option>Low (75% confidence)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1A2332]">Minimum Photo Quality</p>
                    <p className="text-sm text-gray-600">Required image quality for inspections</p>
                  </div>
                  <select className="border rounded-lg px-3 py-2" defaultValue="Medium (720p)">
                    <option>High (1080p)</option>
                    <option>Medium (720p)</option>
                    <option>Low (480p)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1A2332]">Required Photos per Inspection</p>
                    <p className="text-sm text-gray-600">Number of mandatory photos</p>
                  </div>
                  <Input type="number" defaultValue="8" className="w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language & Currency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <select className="w-full border rounded-lg px-3 py-2" defaultValue="English">
                    <option>English</option>
                    <option>සිංහල (Sinhala)</option>
                    <option>தமிழ் (Tamil)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <select className="w-full border rounded-lg px-3 py-2" defaultValue="LKR (Sri Lankan Rupee)">
                    <option>LKR (Sri Lankan Rupee)</option>
                    <option>USD (US Dollar)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'New damage detected', enabled: true },
                { label: 'Maintenance predictions', enabled: true },
                { label: 'Inspection completed', enabled: false },
                { label: 'Vehicle health score changes', enabled: true },
                { label: 'Driver performance alerts', enabled: false },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">{notification.label}</p>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'WhatsApp Business API', status: 'Connected', desc: 'Send inspection reports via WhatsApp' },
                { name: 'Accounting Software', status: 'Not Connected', desc: 'Sync damage costs and expenses' },
                { name: 'Insurance API', status: 'Not Connected', desc: 'Submit claims automatically' },
                { name: 'Payment Gateway', status: 'Connected', desc: 'Process customer payments' },
              ].map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold text-[#1A2332]">{integration.name}</p>
                    <p className="text-sm text-gray-600">{integration.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${
                      integration.status === 'Connected' ? 'text-[#00A86B]' : 'text-gray-500'
                    }`}>
                      {integration.status}
                    </span>
                    <Button variant="outline" size="sm">
                      {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-[#0077BE] to-[#00A86B] text-white p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-2">Professional Plan</h3>
                <p className="text-white/90 mb-4">Up to 50 vehicles, unlimited inspections</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">Rs. 49,999</span>
                  <span className="text-white/80">/month</span>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-600">Next billing date: February 1, 2026</p>
                <Button variant="outline">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: 'January 1, 2026', amount: 'Rs. 49,999', status: 'Paid' },
                  { date: 'December 1, 2025', amount: 'Rs. 49,999', status: 'Paid' },
                  { date: 'November 1, 2025', amount: 'Rs. 49,999', status: 'Paid' },
                ].map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-[#1A2332]">{payment.date}</p>
                      <p className="text-sm text-gray-600">{payment.amount}</p>
                    </div>
                    <span className="text-sm text-[#00A86B] font-medium">{payment.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}