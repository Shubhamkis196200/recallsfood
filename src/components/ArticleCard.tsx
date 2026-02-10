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
      <Link to={`/article/${article.slug}`} className="group block animate-fade-in">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-4 shadow-md hover:shadow-xl transition-shadow duration-300">
          <img
            src={article.featured_image || '/placeholder.svg'}
            alt={(article as any).featured_image_alt || article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded">
            {categoryName}
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-red-700 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-600 line-clamp-2">
            {article.subtitle}
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-500">
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
      <Link to={`/article/${article.slug}`} className="group flex gap-5 animate-fade-in hover:bg-gray-50 p-3 rounded-lg -m-3 transition-all duration-200">
        <div className="relative w-40 h-40 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={article.featured_image || '/placeholder.svg'}
            alt={(article as any).featured_image_alt || article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">
            {categoryName}
          </div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-700 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{authorName}</span>
            <span>•</span>
            <span>{new Date(publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.slug}`} className="group block animate-fade-in">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow duration-300">
        <img
          src={article.featured_image || '/placeholder.svg'}
          alt={(article as any).featured_image_alt || article.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">
          {categoryName}
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-700 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {article.subtitle}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{authorName}</span>
          <span>•</span>
          <span>{new Date(publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </Link>
  );
};
