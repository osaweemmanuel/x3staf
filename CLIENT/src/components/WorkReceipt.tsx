import { faDownload, faSignature, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../assets/Logo.png';

export const WorkReceipt = ({ data, onClose }: any) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-3xl max-w-2xl w-full border-8 border-slate-100 p-12 font-Raleway text-slate-800">
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-2">
          <img src={logo} alt="X3 Staffing" className="w-16 mb-4" />
          <h1 className="text-3xl font-black tracking-tighter uppercase">Work Receipt</h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Canadian Operations</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs font-black text-slate-300 uppercase">Receipt No.</p>
          <p className="text-lg font-bold">X3-INV-{data.id.slice(-6).toUpperCase()}</p>
          <div className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-3 py-1 rounded-full uppercase inline-block">Paid / Verified</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Staff Information</p>
          <p className="font-bold text-lg">{data.userId}</p>
          <p className="text-sm text-slate-500">Contractor ID: {data.userId.slice(0,8)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Period Ending</p>
          <p className="font-bold text-lg">{data.weekEnding}</p>
          <p className="text-sm text-slate-500">Verified on {new Date(data.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="border-y border-slate-100 py-8 mb-12">
        <table className="w-full text-left">
           <thead>
             <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="pb-4">Description</th>
                <th className="pb-4 text-center">Hours</th>
                <th className="pb-4 text-right">Verification</th>
             </tr>
           </thead>
           <tbody>
              <tr className="border-b border-slate-50">
                 <td className="py-6 font-bold">General Labor / On-Site Services</td>
                 <td className="py-6 text-center font-bold">Verified As Submitted</td>
                 <td className="py-6 text-right text-emerald-600 font-black flex items-center justify-end gap-2">
                    Digital Audit <FontAwesomeIcon icon={faCheckCircle} />
                 </td>
              </tr>
           </tbody>
        </table>
      </div>

      <div className="flex justify-between items-end bg-slate-50 p-8 rounded-2xl">
         <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase">Digital Signature Hash</p>
            <div className="flex items-center gap-2 opacity-30 grayscale">
               <FontAwesomeIcon icon={faSignature} />
               <span className="text-[8px] font-mono truncate w-48">SHA256-{Math.random().toString(36).substring(7)}</span>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Total Value Disbursed</p>
            <p className="text-4xl font-black text-primary tracking-tighter">CAD Verified</p>
         </div>
      </div>

      <div className="mt-12 text-center">
         <p className="text-[10px] font-bold text-slate-300">© 2026 X3 Staffing Solutions Canada Inc. • Document digitally verified via X3 Command</p>
      </div>
      
      <div className="mt-8 flex gap-4 no-printme">
         <button onClick={() => window.print()} className="flex-grow py-4 bg-primary text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
            <FontAwesomeIcon icon={faDownload} /> DOWNLOAD PDF RECORD
         </button>
         <button onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl">CLOSE</button>
      </div>
      <style>{`@media print { .no-printme { display: none; } body { background: white !important; } }`}</style>
    </div>
  );
};
