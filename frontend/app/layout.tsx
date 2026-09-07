import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "@/components/ClientShell";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "TransformAI | Intelligent Content Transformation Platform",
  description: "One Source. Multiple Intelligent Outputs. Autonomous GenAI transformation platform delivering 10 verified formats from any single master document.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Prevent flash of dark/light theme by applying class immediately before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('transformai_theme');
                  var theme = (saved === 'dark' || saved === 'light' || saved === 'system') ? saved : 'light';
                  var effective = 'light';
                  if (theme === 'system') {
                    effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  } else {
                    effective = theme;
                  }
                  if (effective === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090E11] dark:text-slate-100 selection:bg-emerald-500 selection:text-white dark:selection:text-slate-950 antialiased transition-colors duration-200">
        {/* Skip to Main Content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-emerald-700 focus:text-white focus:font-medium focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <ClientShell>
            {children}
          </ClientShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
