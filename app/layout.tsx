import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Musiker Training App",
  description: "Deine persönliche Musiker-Trainings-App",
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MusikerApp",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Musiker Training App",
    title: "Musiker Training App",
    description: "Deine persönliche Musiker-Trainings-App",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="MusikerApp" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MusikerApp" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}

        {/* PWA Installation Prompt */}
        <div
          id="pwa-install-prompt"
          className="hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200 z-50"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div>
              <h3 className="font-bold text-gray-800">App installieren</h3>
              <p className="text-sm text-gray-600">Installiere diese App auf deinem Gerät für schnelleren Zugriff</p>
            </div>
            <div className="flex gap-2">
              <button
                id="pwa-install-button"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Installieren
              </button>
              <button
                id="pwa-dismiss-button"
                className="text-gray-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
              >
                Später
              </button>
            </div>
          </div>
        </div>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker Registration
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }

              // PWA Installation Prompt
              let deferredPrompt;
              const installPrompt = document.getElementById('pwa-install-prompt');
              const installButton = document.getElementById('pwa-install-button');
              const dismissButton = document.getElementById('pwa-dismiss-button');

              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                
                // Check if user already dismissed recently
                const dismissedTime = localStorage.getItem('pwa-install-dismissed');
                if (dismissedTime) {
                  const now = Date.now();
                  // Show again after 7 days
                  if (now - parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
                    return;
                  }
                }
                
                installPrompt.classList.remove('hidden');
              });

              if (installButton) {
                installButton.addEventListener('click', async () => {
                  if (!deferredPrompt) return;
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  deferredPrompt = null;
                  installPrompt.classList.add('hidden');
                });
              }

              if (dismissButton) {
                dismissButton.addEventListener('click', () => {
                  installPrompt.classList.add('hidden');
                  localStorage.setItem('pwa-install-dismissed', Date.now().toString());
                });
              }

              // Hide install prompt if app is already installed
              window.addEventListener('appinstalled', () => {
                installPrompt.classList.add('hidden');
                console.log('PWA was installed');
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
