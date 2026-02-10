import { Link } from "react-router-dom";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagListProps {
  tags: Tag[];
  variant?: "default" | "compact";
}

export const TagList = ({ tags, variant = "default" }: TagListProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          to={`/tag/${tag.slug}`}
          className={`inline-flex items-center font-body transition-colors ${
            variant === "compact"
              ? "text-xs px-2 py-0.5 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
              : "text-sm px-3 py-1 border border-border hover:border-gold hover:text-gold"
          }`}
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
};
