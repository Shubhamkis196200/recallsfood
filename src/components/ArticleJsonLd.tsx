import { Helmet } from 'react-helmet-async';

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName: string;
  section?: string;
  wordCount?: number;
}

const SITE_NAME = 'RecallsFood.com';
const BASE_URL = 'https://recallsfood.com';
const LOGO_URL = `${BASE_URL}/favicon.ico`;

export const ArticleJsonLd = ({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  authorName,
  section,
  wordCount,
}: ArticleJsonLdProps) => {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const imageUrl = image?.startsWith('http') ? image : image ? `${BASE_URL}${image}` : `${BASE_URL}/og-image.jpg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: imageUrl,
    url: fullUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['article h1', '.article-excerpt'],
    },
    ...(section && { articleSection: section }),
    ...(wordCount && wordCount > 0 && { wordCount: wordCount }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};

export default ArticleJsonLd;
