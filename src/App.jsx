import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import SketchyLanding from './components/SketchyLanding';
import useStore from './store/useStore';
import { useAuthBootstrap } from './hooks/useAuth';
import { useRoomsListener } from './hooks/useRooms';

function AppShell() {
  useAuthBootstrap();
  useRoomsListener();
  return null;
}

export default function App() {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <>
      <AppShell />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            border: `1px solid ${isDark ? '#2a3651' : '#d8e1ec'}`,
            background: isDark ? '#131b2d' : '#ffffff',
            color: isDark ? '#e2e8f0' : '#0f172a',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <SketchyLanding />
    </>
  );
}
