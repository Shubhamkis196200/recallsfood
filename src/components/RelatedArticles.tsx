import { Link } from "react-router-dom";
import { PostWithRelations } from "@/hooks/usePosts";
import { Clock } from "lucide-react";

interface RelatedArticlesProps {
  articles: PostWithRelations[];
}

export const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="font-serif text-2xl mb-8">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/news/${article.slug}`}
            className="group block"
          >
            <div className="relative aspect-[4/3] overflow-hidden mb-3">
              <img
                src={article.featured_image || "/placeholder.svg"}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-2">
              <div className="text-xs tracking-widest text-gold font-body">
                {article.category?.name?.toUpperCase() || "UNCATEGORIZED"}
              </div>
              <h3 className="font-serif text-lg leading-tight group-hover:text-gold transition-colors line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                <Clock className="w-3 h-3" />
                {article.read_time_minutes || 5} min read
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
