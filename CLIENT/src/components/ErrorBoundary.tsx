import { Component, ErrorInfo, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faRotate, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("X3 Registry Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-8 font-Outfit italic">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-12 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500"></div>
            
            <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 text-3xl mb-8 mx-auto shadow-inner border border-rose-100">
               <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>

            <h2 className="text-2xl font-black uppercase italic text-slate-800 tracking-tighter mb-4 leading-none">Circuit_Breaker_Active</h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-10 leading-relaxed font-sans">
              "A localized module exception occurred. The platform has successfully isolated the error to maintain system integrity."
            </p>

            <div className="space-y-4">
               <button 
                 onClick={() => window.location.reload()} 
                 className="w-full py-4 bg-[#048372] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#048372]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 italic"
               >
                  <FontAwesomeIcon icon={faRotate} /> Re-authorize Module
               </button>
               <button 
                 onClick={() => window.location.href = '/'} 
                 className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-200 transition-all flex items-center justify-center gap-3 italic font-sans"
               >
                  <FontAwesomeIcon icon={faShieldHalved} /> Return to Safety Hub
               </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
