import { getMessages } from 'next-intl/server';
import { fetchNetworkDetails } from '@/app/lib/fetchNetworkDetails';
import NetworkPage from '@/app/components/NetworkPage';

export async function generateMetadata({ params }: { params: { locale: string; id: string } }) {
  const messages = await getMessages({ locale: params.locale });
  const networkId = params.id;

  const networkData = await fetchNetworkDetails(networkId);

  const networkPageMessages = (messages?.NetworkPage || {}) as Record<string, string>;
  const title = networkPageMessages.pageTitle?.replace('{networkName}', networkData.name) || `${networkData.name} - Network Details | Delgor`;
  const description = networkPageMessages.metaDescription?.replace('{networkName}', networkData.name) || `Explore TV shows produced by ${networkData.name}.`;

  return {
    title,
    description,
    keywords: `${networkData.name}, TV shows, streaming, Delgor, networks`,
    openGraph: {
      title,
      description,
      url: `https://www.delgor.com/${params.locale}/network/${networkId}`,
      images: [
        {
          url: networkData.logo_path ? `https://image.tmdb.org/t/p/w500${networkData.logo_path}` : '/images/fallback-network.png',
          width: 1200,
          height: 630,
          alt: `${networkData.name} Logo`,
        },
      ],
      type: 'website',
    },
  };
}

export default async function NetworkServerPage({ params }: { params: { locale: string; id: string } }) {
  const networkId = params.id;
  const locale = params.locale || 'en';

  const networkData = await fetchNetworkDetails(networkId);

  return (
    <div>
      <NetworkPage locale={locale} networkData={networkData} />
    </div>
  );
}
