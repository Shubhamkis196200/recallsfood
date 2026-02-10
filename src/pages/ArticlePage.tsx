import { useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { usePostBySlug, useRelatedPosts, useIncrementViewCount } from "@/hooks/usePosts";
import { usePostTags } from "@/hooks/useTags";
import { useParams } from "react-router-dom";
import { Clock, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DOMPurify from "dompurify";
import SEO from "@/components/SEO";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { SocialShare } from "@/components/SocialShare";
import { RelatedArticles } from "@/components/RelatedArticles";
import { TagList } from "@/components/TagList";
import { ReadingProgress } from "@/components/ReadingProgress";

// Configure DOMPurify to allow safe HTML elements
const sanitizeHtml = (html: string): string => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'sub', 'sup',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'iframe'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
      'class', 'style', 'data-youtube-video', 'allowfullscreen', 'frameborder', 'loading'
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'loading'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover']
  });
  
  // Bug #6 Fix: Wrap tables in responsive scroll container
  const wrappedTables = sanitized.replace(
    /<table/g, 
    '<div class="table-wrapper"><table'
  ).replace(
    /<\/table>/g, 
    '</table></div>'
  );
  
  // Bug #7 Fix: Clean up empty paragraphs
  const cleaned = wrappedTables
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, '');
  
  return cleaned;
};

// Calculate word count from HTML content
const calculateWordCount = (html: string): number => {
  if (!html) return 0;
  // Strip HTML tags and count words
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return textContent.split(' ').filter(word => word.length > 0).length;
};

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = usePostBySlug(slug || "");
  const { data: tags } = usePostTags(article?.id || "");
  const { data: relatedPosts } = useRelatedPosts(article?.id || "", article?.category_id || null);
  const incrementView = useIncrementViewCount();

  // Track view count on page load
  useEffect(() => {
    if (slug && article) {
      incrementView.mutate(slug);
    }
  }, [slug, article?.id]);

  // Calculate word count from article content
  const wordCount = useMemo(() => {
    if (!article?.content) return 0;
    return calculateWordCount(article.content);
  }, [article?.content]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <Skeleton className="h-4 w-48 mb-8" />
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-16 w-full mb-4" />
            <Skeleton className="h-8 w-3/4 mb-8" />
            <Skeleton className="aspect-[16/9] w-full mb-12" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-bold text-4xl mb-4">Article Not Found</h1>
            <p className="text-muted-foreground ">The article you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryName = article.category?.name || 'Uncategorized';
  const categorySlug = article.category?.slug || '';
  const authorName = article.author?.name || 'Editorial Team';
  const authorAvatar = article.author?.avatar_url;
  const publishedDate = article.published_at || article.created_at;
  const readTime = article.read_time_minutes || 5;
  const viewCount = article.view_count || 0;

  const metaDescription = article.meta_description || article.excerpt || article.subtitle || `Read ${article.title} on RecallsFood.com`;

  // Breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: categoryName, url: `/${categorySlug}` },
    { name: article.title, url: `/news/${article.slug}` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgress />
      <SEO
        title={article.meta_title || article.title}
        description={metaDescription}
        image={article.featured_image || undefined}
        url={`/news/${article.slug}`}
        type="article"
        publishedTime={publishedDate}
        modifiedTime={article.updated_at}
        author={authorName}
        section={categoryName}
      />
      <ArticleJsonLd 
        title={article.title}
        description={metaDescription}
        url={`/news/${article.slug}`}
        image={article.featured_image || undefined}
        publishedTime={publishedDate}
        modifiedTime={article.updated_at}
        authorName={authorName}
        section={categoryName}
        wordCount={wordCount}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Header />

      <article className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: categoryName, href: `/${categorySlug}` },
              { label: article.title },
            ]}
          />

          {/* Article Header */}
          <div className="mb-12">
            <div className="text-xs tracking-widest text-red-600 mb-4 ">
              {categoryName.toUpperCase()}
            </div>
            <h1 className="font-bold text-4xl md:text-6xl mb-6 leading-tight">{article.title}</h1>
            {article.subtitle && (
              <p className="article-excerpt text-2xl text-muted-foreground  mb-8 leading-relaxed">
                {article.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground  mb-4">
              <span className="font-medium text-foreground">By {authorName}</span>
              <span>•</span>
              <span>{new Date(publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime} min read
              </span>
              {viewCount > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {viewCount.toLocaleString()} views
                  </span>
                </>
              )}
            </div>

            {/* Social Share */}
            <div className="flex items-center justify-between mb-8">
              <SocialShare 
                url={`/news/${article.slug}`} 
                title={article.title}
                description={article.excerpt || article.subtitle}
              />
            </div>

            <div className="border-t border-gray-200"></div>
          </div>

          {/* Featured Image */}
          {article.featured_image && (
            <div className="aspect-[16/9] overflow-hidden mb-12">
              <img
                src={article.featured_image}
                alt={(article as any).featured_image_alt || article.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {article.excerpt && (
              <p className="article-excerpt text-xl  leading-relaxed mb-6 first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                {article.excerpt}
              </p>
            )}

            {article.content && (
              <div 
                className="space-y-6  text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
              />
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-sm  text-muted-foreground mb-3">Tags</h3>
              <TagList tags={tags} />
            </div>
          )}

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {authorAvatar ? (
                  <img 
                    src={authorAvatar} 
                    alt={authorName}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                    <span className="font-bold text-xl text-red-600">
                      {authorName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium ">{authorName}</div>
                  <div className="text-sm text-muted-foreground ">Contributing Editor</div>
                </div>
              </div>
              <SocialShare 
                url={`/news/${article.slug}`} 
                title={article.title}
                description={article.excerpt || article.subtitle}
              />
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts && relatedPosts.length > 0 && (
            <RelatedArticles articles={relatedPosts} />
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticlePage;
