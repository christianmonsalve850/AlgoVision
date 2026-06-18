export function ThemeScript() {
  const script = `
    (() => {
      try {
        const storedTheme = localStorage.getItem('algoVisionTheme');
        const theme = storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
          ? storedTheme
          : 'system';
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const resolvedTheme = theme === 'system' ? systemTheme : theme;
        const root = document.documentElement;
        root.classList.toggle('dark', resolvedTheme === 'dark');
        root.style.colorScheme = resolvedTheme;
      } catch {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
