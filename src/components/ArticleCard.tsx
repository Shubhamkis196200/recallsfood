import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { PostWithRelations } from "@/hooks/usePosts";

interface ArticleCardProps {
  article: PostWithRelations;
  variant?: "default" | "featured" | "horizontal";
}

export const ArticleCard = ({ article, variant = "default" }: ArticleCardProps) => {
  const categoryName = article.category?.name || 'Uncategorized';
  const authorName = article.author?.name || 'Editorial Team';
  const publishedDate = article.published_at || article.created_at;
  const readTime = article.read_time_minutes || 5;

  if (variant === "featured") {
    return (
      <Link
        to={`/news/${article.slug}`}
        className="group block"
      >
        <div className="relative aspect-[16/10] overflow-hidden mb-6">
          <img
            src={article.featured_image || '/placeholder.svg'}
            alt={(article as any).featured_image_alt || article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-gold text-background px-4 py-1 text-xs tracking-widest font-body">
            {categoryName.toUpperCase()}
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="font-serif text-4xl leading-tight group-hover:text-gold transition-colors">
            {article.title}
          </h2>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            {article.subtitle}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-body">
            <span>{authorName}</span>
            <span>•</span>
            <span>{new Date(publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime} min read
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        to={`/news/${article.slug}`}
        className="group flex gap-6"
      >
        <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden">
          <img
            src={article.featured_image || '/placeholder.svg'}
            alt={(article as any).featured_image_alt || article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-xs tracking-widest text-gold font-body">
            {categoryName.toUpperCase()}
          </div>
          <h3 className="font-serif text-2xl leading-tight group-hover:text-gold transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground font-body line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
            <span>{authorName}</span>
            <span>•</span>
            <span>{new Date(publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/news/${article.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden mb-4">
        <img
          src={article.featured_image || '/placeholder.svg'}
          alt={(article as any).featured_image_alt || article.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <div className="text-xs tracking-widest text-gold font-body">
          {categoryName.toUpperCase()}
        </div>
        <h3 className="font-serif text-xl leading-tight group-hover:text-gold transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground font-body line-clamp-2">
          {article.subtitle}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
          <span>{authorName}</span>
          <span>•</span>
          <span>{new Date(publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </Link>
  );
};
