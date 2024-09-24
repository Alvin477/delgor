import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import Header from '@/app/components/header'; // PC Header
import MobileHeader from '@/app/components/MobileHeader'; // Mobile Header
import BottomNavbar from '@/app/components/BottomNavbar'; // Mobile Bottom Navbar
import './globals.css'; // Import the global CSS here

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
              {/* PC Header - only visible on large screens */}
              <div className="hidden lg:block">
                <Header />
              </div>

              {/* Mobile Header - only visible on mobile screens */}
              <div className="lg:hidden">
                <MobileHeader />
              </div>

              {/* Main content */}
              <main className="flex-grow">{children}</main>

              {/* Mobile Bottom Navbar - only visible on mobile screens */}
              <div className="lg:hidden">
                <BottomNavbar locale={locale} />
              </div>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
