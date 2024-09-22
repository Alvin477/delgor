"use client";

import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return <>{children}</>;
}
