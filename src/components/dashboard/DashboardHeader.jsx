import useStore from '../../store/useStore';

export default function DashboardHeader() {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  
  return (
    <div className={`mb-6 rounded-xl border-2 ${isDark ? 'border-slate-700 bg-[#242424]' : 'border-slate-900 bg-white'} p-6 shadow-[4px_4px_0px_0px_#0f172a]`}>
      <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        Room Availability
      </h1>
      <p className={`mt-1 font-mono text-sm uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
        Live campus room status · updates instantly
      </p>
    </div>
  );
}