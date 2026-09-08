import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
  errorInfo: any;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Folia caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleFactoryReset = () => {
    if (window.confirm("Attenzione: questa operazione azzera la memoria temporanea locale di Folia. I tuoi file di progetto (.folia salvati su disco) non verranno eliminati. Vuoi procedere?")) {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAF8] text-[#1D1D1B] p-8 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center mb-4 text-2xl font-bold shadow-xs">
            Folia
          </div>
          <h2 className="text-xl font-bold mb-2">Si è verificato un problema imprevisto</h2>
          <p className="text-xs text-stone-500 max-w-md mb-4 leading-relaxed">
            I tuoi progetti salvati sono al sicuro. Puoi ricaricare l'applicazione senza perdere i dati.
          </p>

          {/* Detailed Error Box */}
          <div className="text-left bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 font-mono text-[11px] max-w-xl w-full max-h-48 overflow-y-auto mb-6 whitespace-pre-wrap">
            <strong>Dettaglio:</strong> {this.state.error?.toString()}
            {this.state.error?.stack && (
              <>
                {'\n\n'}
                <strong>Stack:</strong>
                {'\n'}
                {this.state.error.stack}
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
            >
              Ricarica applicazione (Mantieni dati)
            </button>
            <button
              onClick={this.handleFactoryReset}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-medium cursor-pointer transition-all"
            >
              Ripristino di fabbrica (Cancella temporanei)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
