import { getMessages } from 'next-intl/server';
import { fetchCompanyDetails } from '@/app/lib/fetchCompanyDetails';
import CompanyPage from '@/app/components/CompanyPage';

export async function generateMetadata({ params }: { params: { locale: string; id: string } }) {
  const messages = await getMessages({ locale: params.locale });
  const companyId = params.id;

  const companyData = await fetchCompanyDetails(companyId);

  const companyPageMessages = (messages?.CompanyPage || {}) as Record<string, string>;
  const title = companyPageMessages.pageTitle?.replace('{companyName}', companyData.name) || `${companyData.name} - Company Details | Delgor`;
  const description = companyPageMessages.metaDescription?.replace('{companyName}', companyData.name) || `Explore TV shows produced by ${companyData.name}.`;

  return {
    title,
    description,
    keywords: `${companyData.name}, TV shows, streaming, Delgor, production companies`,
    openGraph: {
      title,
      description,
      url: `https://www.delgor.com/${params.locale}/company/${companyId}`,
      images: [
        {
          url: companyData.logo_path ? `https://image.tmdb.org/t/p/w500${companyData.logo_path}` : '/images/fallback-company.png',
          width: 1200,
          height: 630,
          alt: `${companyData.name} Logo`,
        },
      ],
      type: 'website',
    },
  };
}

export default async function CompanyServerPage({ params }: { params: { locale: string; id: string } }) {
  const companyId = params.id;  // Extract company ID from params
  const locale = params.locale || 'en';  // Extract locale from params

  const companyData = await fetchCompanyDetails(companyId);

  return (
    <div>
      {/* Removed CompanySlider */}
      <CompanyPage locale={locale} companyData={companyData} />
    </div>
  );
}
