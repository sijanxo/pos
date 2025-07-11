'use client';

export default function Settings() {
  return (
    <div className="settings-page min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="page-header mb-8">
          <h1 className="page-title text-3xl font-bold text-text">Settings</h1>
          <p className="page-description text-muted mt-2">
            Configure your POS system settings and preferences
          </p>
        </div>

        <div className="content-area">
          <div className="placeholder-content bg-card border border-muted rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-text mb-4">Settings Page</h2>
            <p className="text-muted">
              This is the settings configuration page. Add your settings components here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}