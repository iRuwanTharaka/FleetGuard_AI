import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Bell, Globe, Lock, User, Save } from 'lucide-react';

export function ManagerSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    language: 'en',
    timezone: 'Asia/Colombo',
    dateFormat: 'DD/MM/YYYY',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your preferences and account settings</p>
      </div>

      {/* Notification Settings */}
      <SettingsCard title="Notification Settings" icon={<Bell className="h-5 w-5" />}>
        <div className="space-y-4">
          <ToggleRow
            label="Email Notifications"
            description="Receive inspection and damage alerts via email"
            checked={settings.emailNotifications}
            onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
          />
          <ToggleRow
            label="Push Notifications"
            description="Get real-time notifications on your device"
            checked={settings.pushNotifications}
            onChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
          />
          <ToggleRow
            label="Weekly Summary Report"
            description="Receive a weekly summary of fleet performance"
            checked={settings.weeklyReport}
            onChange={(checked) => setSettings({ ...settings, weeklyReport: checked })}
          />
        </div>
      </SettingsCard>

      {/* Language & Localization */}
      <SettingsCard title="Language & Localization" icon={<Globe className="h-5 w-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="language" className="text-slate-700 dark:text-slate-300">Language</Label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="mt-2 w-full h-10 px-3 rounded-md bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
            >
              <option value="en">English</option>
              <option value="si">Sinhala</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
          <div>
            <Label htmlFor="timezone" className="text-slate-700 dark:text-slate-300">Timezone</Label>
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="mt-2 w-full h-10 px-3 rounded-md bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
            >
              <option value="Asia/Colombo">Asia/Colombo</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <Label htmlFor="dateFormat" className="text-slate-700 dark:text-slate-300">Date Format</Label>
            <select
              id="dateFormat"
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              className="mt-2 w-full h-10 px-3 rounded-md bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </SettingsCard>

      {/* Security */}
      <SettingsCard title="Security" icon={<Lock className="h-5 w-5" />}>
        <div className="space-y-4">
          <Button variant="outline" className="border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white">
            Change Password
          </Button>
          <div className="pt-4 border-t border-slate-300/50 dark:border-white/10">
            <h4 className="text-slate-900 dark:text-white font-medium mb-2">Active Sessions</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">You're currently signed in on 2 devices</p>
            <Button variant="outline" size="sm" className="border-slate-300/50 dark:border-white/10 text-slate-600 dark:text-slate-400">
              View All Sessions
            </Button>
          </div>
        </div>
      </SettingsCard>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function SettingsCard({ title, icon, children }: any) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: any) {
  return (
    <div className="flex items-start justify-between p-4 rounded-xl bg-slate-200/30 dark:bg-white/5">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-400 dark:bg-slate-700'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}
