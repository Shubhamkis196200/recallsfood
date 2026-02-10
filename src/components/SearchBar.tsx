import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useSearchPosts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchBarProps {
  variant?: "header" | "inline";
  placeholder?: string;
  onClose?: () => void;
}

export const SearchBar = ({ 
  variant = "header", 
  placeholder = "Search articles...",
  onClose 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: results, isLoading } = useSearchPosts(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setQuery("");
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-16 h-16 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.slice(0, 5).map((post) => (
                <Link
                  key={post.id}
                  to={`/news/${post.slug}`}
                  onClick={handleResultClick}
                  className="flex gap-3 p-4 hover:bg-secondary/50 transition-colors"
                >
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt=""
                      className="w-16 h-16 object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gold font-body mb-1">
                      {post.category?.name?.toUpperCase() || "ARTICLE"}
                    </div>
                    <h4 className="font-serif text-sm line-clamp-2">{post.title}</h4>
                  </div>
                </Link>
              ))}
              {results.length > 5 && (
                <div className="p-3 text-center text-sm text-muted-foreground font-body">
                  +{results.length - 5} more results
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground font-body">
              No articles found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
