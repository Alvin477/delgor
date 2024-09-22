import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Define the type for locales
type Locale = "en" | "de" | "id" | "ar" | "fr" | "hi" | "pt" | "ru" | "zh-CN" | "ja" | "ur";

// Define the type for locale, assuming it's a string
interface RequestConfigParams {
  locale: string;
}

export default getRequestConfig(async ({ locale }: RequestConfigParams) => {
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
