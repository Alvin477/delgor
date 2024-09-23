// src/app/mylist/page.tsx

import { getMessages } from 'next-intl/server';
import MyListPage from '@/app/components/MyListPage';

// Server-side metadata generation for SEO
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const messages = await getMessages({ locale: params.locale });

  // Get translated messages for the "MyList" page from the locale-specific message file
  const myListPageMessages = (messages?.MyList || {}) as Record<string, string>;
  const title = myListPageMessages.pageTitle || "My List - Delgor";
  const description = myListPageMessages.metaDescription || "Manage your favorite movies, TV shows, and videos on Delgor.";

  return {
    title, // The page title dynamically changes based on the locale
    description,
    keywords: "my list, favorites, streaming, Delgor, saved shows",
    openGraph: {
      title, // Dynamic title
      description, // Dynamic description
      url: "https://www.delgor.com/mylist",
      images: [
        {
          url: "https://www.delgor.com/images/ogdelgor.png",
          width: 1200,
          height: 630,
          alt: "My List on Delgor",
        },
      ],
      type: "website",
    },
  };
}

export default function MyListServerPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale || 'en';

  // Render the MyListPage component, passing down the locale
  return <MyListPage locale={locale} />;
}
