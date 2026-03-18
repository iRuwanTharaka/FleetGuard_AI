import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import logoFull from 'figma:asset/55aa009e656ec7bb3a1624f42ee7391769762ee0.png';

export function DesignSystem() {
  const navigate = useNavigate();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
              <img 
                src={logoFull} 
                alt="FleetGuard AI" 
                className="h-10 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Design System</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="space-y-16">
          {/* Introduction */}
          <section>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              FleetGuard AI Design System
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
              A comprehensive guide to the visual language, components, and design tokens used throughout the FleetGuard AI application. This document serves as a reference for developers and designers to maintain consistency across all interfaces.
            </p>
          </section>

          {/* Color Palette */}
          <section>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Color Palette</h3>
            
            {/* Primary Blues */}
            <div className="mb-10">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Primary Blues</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Used for primary actions, links, and key UI elements. Represents trust, professionalism, and technology.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ColorSwatch
                  name="Blue 900"
                  hex="#0d47a1"
                  usage="Primary dark, headers, emphasis"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Blue 900'}
                />
                <ColorSwatch
                  name="Blue 700"
                  hex="#1976d2"
                  usage="Primary, buttons, interactive elements"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Blue 700'}
                />
                <ColorSwatch
                  name="Blue 500"
                  hex="#2196f3"
                  usage="Hover states, accents, highlights"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Blue 500'}
                />
              </div>
            </div>

            {/* Success Greens */}
            <div className="mb-10">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Success Greens</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Used for success states, positive indicators, and health metrics. Represents safety, approval, and optimal performance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ColorSwatch
                  name="Green 900"
                  hex="#1b5e20"
                  usage="Dark success, critical approvals"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Green 900'}
                />
                <ColorSwatch
                  name="Green 700"
                  hex="#2e7d32"
                  usage="Success states, confirmations"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Green 700'}
                />
                <ColorSwatch
                  name="Green 600"
                  hex="#388e3c"
                  usage="Positive indicators"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Green 600'}
                />
                <ColorSwatch
                  name="Green 500"
                  hex="#4caf50"
                  usage="Light success, badges"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Green 500'}
                />
              </div>
            </div>

            {/* Neutral Grays */}
            <div className="mb-10">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Neutral Grays (Slate)</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Used for backgrounds, text, borders, and neutral UI elements. Provides hierarchy and structure.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ColorSwatch
                  name="Slate 950"
                  hex="#020617"
                  usage="Dark mode background"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Slate 950'}
                />
                <ColorSwatch
                  name="Slate 900"
                  hex="#0f172a"
                  usage="Dark mode surfaces"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Slate 900'}
                />
                <ColorSwatch
                  name="Slate 500"
                  hex="#64748b"
                  usage="Secondary text"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Slate 500'}
                />
                <ColorSwatch
                  name="Slate 200"
                  hex="#e2e8f0"
                  usage="Light mode borders"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Slate 200'}
                />
                <ColorSwatch
                  name="Slate 50"
                  hex="#f8fafc"
                  usage="Light mode background"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Slate 50'}
                />
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Semantic Colors</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Used for feedback, alerts, and status indicators.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ColorSwatch
                  name="Success"
                  hex="#4caf50"
                  usage="Success messages, approvals"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Success'}
                />
                <ColorSwatch
                  name="Warning"
                  hex="#ff9800"
                  usage="Warnings, cautions"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Warning'}
                />
                <ColorSwatch
                  name="Error"
                  hex="#f44336"
                  usage="Errors, critical issues"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Error'}
                />
                <ColorSwatch
                  name="Info"
                  hex="#2196f3"
                  usage="Information, tips"
                  onCopy={copyToClipboard}
                  isCopied={copiedColor === 'Info'}
                />
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Typography</h3>
            
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Font Family</h4>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <p className="font-['Inter'] text-4xl mb-2 text-slate-900 dark:text-white">Inter</p>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Primary typeface for all text content
                </p>
                <code className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-900 dark:text-slate-100">
                  font-family: 'Inter', system-ui, -apple-system, sans-serif
                </code>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Type Scale</h4>
              <div className="space-y-4">
                <TypeExample size="text-6xl" label="6XL - 60px" usage="Hero headlines" />
                <TypeExample size="text-5xl" label="5XL - 48px" usage="Page headlines" />
                <TypeExample size="text-4xl" label="4XL - 36px" usage="Section headers" />
                <TypeExample size="text-3xl" label="3XL - 30px" usage="Card headers" />
                <TypeExample size="text-2xl" label="2XL - 24px" usage="Subheadings" />
                <TypeExample size="text-xl" label="XL - 20px" usage="Large text" />
                <TypeExample size="text-lg" label="LG - 18px" usage="Body large" />
                <TypeExample size="text-base" label="Base - 16px" usage="Body text (default)" />
                <TypeExample size="text-sm" label="SM - 14px" usage="Small text, captions" />
                <TypeExample size="text-xs" label="XS - 12px" usage="Labels, metadata" />
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Font Weights</h4>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
                <div className="flex items-center gap-4">
                  <code className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-900 dark:text-slate-100 w-32">
                    font-light
                  </code>
                  <p className="font-light text-slate-900 dark:text-white">300 - Light weight (minimal use)</p>
                </div>
                <div className="flex items-center gap-4">
                  <code className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-900 dark:text-slate-100 w-32">
                    font-normal
                  </code>
                  <p className="font-normal text-slate-900 dark:text-white">400 - Normal weight (body text)</p>
                </div>
                <div className="flex items-center gap-4">
                  <code className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-900 dark:text-slate-100 w-32">
                    font-medium
                  </code>
                  <p className="font-medium text-slate-900 dark:text-white">500 - Medium weight (labels, buttons)</p>
                </div>
                <div className="flex items-center gap-4">
                  <code className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-900 dark:text-slate-100 w-32">
                    font-semibold
                  </code>
                  <p className="font-semibold text-slate-900 dark:text-white">600 - Semibold (headings)</p>
                </div>
                <div className="flex items-center gap-4">
                  <code className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-900 dark:text-slate-100 w-32">
                    font-bold
                  </code>
                  <p className="font-bold text-slate-900 dark:text-white">700 - Bold (emphasis, titles)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Spacing */}
          <section>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Spacing System</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Based on 4px base unit. All spacing follows this scale for consistency.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SpacingExample size="1" pixels="4px" />
              <SpacingExample size="2" pixels="8px" />
              <SpacingExample size="3" pixels="12px" />
              <SpacingExample size="4" pixels="16px" />
              <SpacingExample size="6" pixels="24px" />
              <SpacingExample size="8" pixels="32px" />
              <SpacingExample size="12" pixels="48px" />
              <SpacingExample size="16" pixels="64px" />
            </div>
          </section>

          {/* Border Radius */}
          <section>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Border Radius</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <RadiusExample size="rounded-sm" label="SM" pixels="2px" />
              <RadiusExample size="rounded" label="Default" pixels="4px" />
              <RadiusExample size="rounded-md" label="MD" pixels="6px" />
              <RadiusExample size="rounded-lg" label="LG" pixels="8px" />
              <RadiusExample size="rounded-xl" label="XL" pixels="12px" />
              <RadiusExample size="rounded-2xl" label="2XL" pixels="16px" />
              <RadiusExample size="rounded-3xl" label="3XL" pixels="24px" />
              <RadiusExample size="rounded-full" label="Full" pixels="9999px" />
            </div>
          </section>

          {/* Shadows */}
          <section>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shadows</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ShadowExample level="shadow-sm" label="Small" usage="Subtle elevation" />
              <ShadowExample level="shadow" label="Default" usage="Cards, dropdowns" />
              <ShadowExample level="shadow-md" label="Medium" usage="Raised elements" />
              <ShadowExample level="shadow-lg" label="Large" usage="Modals, overlays" />
              <ShadowExample level="shadow-xl" label="Extra Large" usage="Important dialogs" />
              <ShadowExample level="shadow-2xl" label="2XL" usage="Maximum elevation" />
            </div>
          </section>

          {/* Component Examples */}
          <section>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Component Patterns</h3>
            
            {/* Buttons */}
            <div className="mb-10">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Buttons</h4>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-[#1976d2] hover:bg-[#0d47a1]">Primary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button className="bg-[#4caf50] hover:bg-[#2e7d32]">Success Button</Button>
                  <Button variant="destructive">Destructive Button</Button>
                </div>
              </div>
            </div>

            {/* Glassmorphism */}
            <div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Glassmorphism Effect</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Extensively used throughout the application for modern, layered UI elements.
              </p>
              <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-br from-[#0d47a1] to-[#2e7d32] p-8">
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{ 
                    backgroundImage: 'url(https://images.unsplash.com/photo-1621962225583-94d5bf016eb8?w=800)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                </div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md">
                  <h5 className="text-xl font-bold text-white mb-2">Glassmorphism Card</h5>
                  <p className="text-white/80 mb-4">
                    Semi-transparent background with blur effect creates depth and modern aesthetic.
                  </p>
                  <code className="text-xs bg-black/20 px-3 py-1.5 rounded text-white block">
                    bg-white/10 backdrop-blur-xl border border-white/20
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Design Principles */}
          <section>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Design Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PrincipleCard
                title="Professional & Enterprise-Grade"
                description="FleetGuard AI maintains a serious, professional appearance suitable for business use. No childish elements or emojis unless explicitly requested."
              />
              <PrincipleCard
                title="Dark Mode First"
                description="The application defaults to dark mode with full light mode support. Dark backgrounds (#020617, #0f172a) with light text create a modern, professional look."
              />
              <PrincipleCard
                title="Mobile-First Responsive"
                description="All interfaces are designed mobile-first and scale up to desktop. Touch targets are minimum 44x44px for accessibility."
              />
              <PrincipleCard
                title="Glassmorphism & Depth"
                description="Extensive use of glassmorphism effects (bg-white/10 backdrop-blur-xl) creates visual hierarchy and modern aesthetics throughout the interface."
              />
              <PrincipleCard
                title="Animations & Interactions"
                description="Subtle animations using Motion (Framer Motion) enhance user experience. Hover states, transitions, and micro-interactions provide feedback."
              />
              <PrincipleCard
                title="Sri Lankan Cultural Context"
                description="While maintaining professional standards, the application incorporates Sri Lankan context through imagery, examples, and localization where appropriate."
              />
            </div>
          </section>

          {/* Usage Guidelines */}
          <section className="pb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Usage Guidelines</h3>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
              <div>
                <h5 className="font-semibold text-slate-900 dark:text-white mb-2">✅ Do's</h5>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Use the primary blue palette (#0d47a1, #1976d2, #2196f3) for interactive elements</li>
                  <li>Apply green colors (#1b5e20 - #4caf50) for success states and positive indicators</li>
                  <li>Maintain consistent spacing using the 4px base unit scale</li>
                  <li>Use glassmorphism effects for overlays, modals, and layered elements</li>
                  <li>Follow the Inter font family throughout the application</li>
                  <li>Ensure sufficient contrast ratios for accessibility (WCAG AA minimum)</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 dark:text-white mb-2">❌ Don'ts</h5>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Don't use emojis or childish visual elements unless explicitly requested</li>
                  <li>Don't deviate from the established color palette without design approval</li>
                  <li>Don't use arbitrary spacing values outside the defined scale</li>
                  <li>Don't override font sizes defined in theme.css without consideration</li>
                  <li>Don't create heavy shadows that detract from the clean, modern aesthetic</li>
                  <li>Don't ignore dark mode styling - all components must support both themes</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ColorSwatch({ name, hex, usage, onCopy, isCopied }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="h-32 cursor-pointer relative group"
        style={{ backgroundColor: hex }}
        onClick={() => onCopy(hex, name)}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          {isCopied ? (
            <Check className="h-6 w-6 text-white" />
          ) : (
            <Copy className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h5 className="font-semibold text-slate-900 dark:text-white">{name}</h5>
          <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-slate-100">
            {hex}
          </code>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{usage}</p>
      </div>
    </div>
  );
}

function TypeExample({ size, label, usage }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-baseline justify-between mb-2">
        <code className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-900 dark:text-slate-100">
          {label}
        </code>
        <span className="text-sm text-slate-600 dark:text-slate-400">{usage}</span>
      </div>
      <p className={`${size} text-slate-900 dark:text-white`}>
        The quick brown fox jumps over the lazy dog
      </p>
    </div>
  );
}

function SpacingExample({ size, pixels }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-slate-100">
          {size}
        </code>
        <span className="text-sm text-slate-600 dark:text-slate-400">{pixels}</span>
      </div>
      <div className={`h-${size} bg-[#1976d2] rounded`} style={{ width: pixels }}></div>
    </div>
  );
}

function RadiusExample({ size, label, pixels }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-slate-100">
          {label}
        </code>
        <span className="text-sm text-slate-600 dark:text-slate-400">{pixels}</span>
      </div>
      <div className={`w-full h-16 bg-[#1976d2] ${size}`}></div>
    </div>
  );
}

function ShadowExample({ level, label, usage }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <code className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-900 dark:text-slate-100">
          {level}
        </code>
        <span className="text-sm text-slate-600 dark:text-slate-400">{usage}</span>
      </div>
      <div className={`w-full h-20 bg-[#1976d2] rounded-xl ${level}`}></div>
    </div>
  );
}

function PrincipleCard({ title, description }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-[#1976d2] dark:hover:border-[#1976d2] transition-colors">
      <h5 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h5>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}
