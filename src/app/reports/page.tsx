'use client';

export default function Reports() {
  return (
    <div className="reports-page min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="page-header mb-8">
          <h1 className="page-title text-3xl font-bold text-text">Reports & Analytics</h1>
          <p className="page-description text-muted mt-2">
            View sales reports, analytics, and business insights
          </p>
        </div>

        <div className="content-area">
          <div className="placeholder-content bg-card border border-muted rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-text mb-4">Reports Page</h2>
            <p className="text-muted">
              This is the reports and analytics page. Add your reporting components here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}