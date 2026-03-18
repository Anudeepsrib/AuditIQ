import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen diagonal-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-heading font-semibold">
            <span className="text-[--text-primary]">Audit</span>
            <span className="text-[--accent] font-mono">IQ</span>
          </h1>
          <p className="text-[--text-secondary] font-body">
            Fine-Tuned for Financial Truth.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[--surface] border border-[--border] rounded-lg p-8 shadow-xl">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[--text-tertiary]">
          AuditIQ Financial Document Extraction Platform
        </p>
      </div>
    </div>
  );
}
