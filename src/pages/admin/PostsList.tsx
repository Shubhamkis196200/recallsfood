import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDeletePost } from '@/hooks/usePosts';
import { useFilteredPosts } from '@/hooks/useFilteredPosts';
import { useCategories } from '@/hooks/useCategories';
import { useAuthors } from '@/hooks/useAuthors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, Search, X, Filter, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import DOMPurify from 'dompurify';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

const PostsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(searchParams.get('status'));
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [authorFilter, setAuthorFilter] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [viewsFilter, setViewsFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Data hooks
  const { data: categories } = useCategories();
  const { data: authors } = useAuthors();
  const deletePost = useDeletePost();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewPost, setPreviewPost] = useState<typeof posts[0] | null>(null);

  // Compute view range
  const getViewRange = () => {
    switch (viewsFilter) {
      case '0-100': return { min: 0, max: 100 };
      case '100-500': return { min: 100, max: 500 };
      case '500-1000': return { min: 500, max: 1000 };
      case '1000+': return { min: 1000, max: null };
      default: return { min: null, max: null };
    }
  };

  const viewRange = getViewRange();

  const { data, isLoading } = useFilteredPosts({
    status: statusFilter,
    categoryId: categoryFilter,
    authorId: authorFilter,
    dateFrom: dateFrom,
    dateTo: dateTo,
    minViews: viewRange.min,
    maxViews: viewRange.max,
    searchQuery: debouncedQuery,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
  });

  const posts = data?.posts || [];
  const totalPosts = data?.totalCount || 0;
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage > 1) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', '1');
      setSearchParams(newParams);
    }
  }, [statusFilter, categoryFilter, authorFilter, dateFrom, dateTo, viewsFilter, debouncedQuery]);

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', page.toString());
    }
    setSearchParams(newParams);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deletePost.mutateAsync(id);
      toast({
        title: 'Post Deleted',
        description: 'The post has been successfully deleted.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the post. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setCategoryFilter(null);
    setAuthorFilter(null);
    setDateFrom(undefined);
    setDateTo(undefined);
    setViewsFilter('all');
    setSearchParams({});
  };

  const hasActiveFilters = statusFilter || categoryFilter || authorFilter || dateFrom || dateTo || viewsFilter !== 'all' || debouncedQuery;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalPosts);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl mb-2">Posts</h1>
          <p className="text-muted-foreground font-body">
            Manage your articles and blog posts
          </p>
        </div>
        <Link to="/admin/posts/new">
          <Button className="bg-foreground text-background hover:bg-foreground/90">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Filter Toggle Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(hasActiveFilters && "border-primary text-primary")}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && <span className="ml-2 w-2 h-2 bg-primary rounded-full" />}
            {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="border border-border rounded-lg p-4 space-y-4 bg-secondary/10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <Select value={categoryFilter || 'all'} onValueChange={(v) => setCategoryFilter(v === 'all' ? null : v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Author Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Author</Label>
                <Select value={authorFilter || 'all'} onValueChange={(v) => setAuthorFilter(v === 'all' ? null : v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    {authors?.map((author) => (
                      <SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-9 w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                      {dateFrom ? format(dateFrom, "PP") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-9 w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                      {dateTo ? format(dateTo, "PP") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Views Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Views</Label>
                <Select value={viewsFilter} onValueChange={setViewsFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Views</SelectItem>
                    <SelectItem value="0-100">0 - 100</SelectItem>
                    <SelectItem value="100-500">100 - 500</SelectItem>
                    <SelectItem value="500-1000">500 - 1,000</SelectItem>
                    <SelectItem value="1000+">1,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Posts Table */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body">
          Loading posts...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 border border-border">
          <p className="text-muted-foreground font-body mb-4">
            {hasActiveFilters ? 'No posts match your filters' : 'No posts found'}
          </p>
          {!hasActiveFilters && (
            <Link to="/admin/posts/new">
              <Button variant="outline">Create your first post</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="border border-border">
            <table className="w-full">
              <thead className="bg-secondary/30">
                <tr className="text-left">
                  <th className="p-4 font-body text-sm font-medium text-muted-foreground">Title</th>
                  <th className="p-4 font-body text-sm font-medium text-muted-foreground">Category</th>
                  <th className="p-4 font-body text-sm font-medium text-muted-foreground">Author</th>
                  <th className="p-4 font-body text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 font-body text-sm font-medium text-muted-foreground">Views</th>
                  <th className="p-4 font-body text-sm font-medium text-muted-foreground">Date</th>
                  <th className="p-4 font-body text-sm font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div>
                        <Link 
                          to={`/admin/posts/${post.id}`}
                          className="font-bold text-lg hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                        {post.subtitle && (
                          <p className="text-sm text-muted-foreground font-body mt-1 line-clamp-1">
                            {post.subtitle}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-body text-muted-foreground">
                        {post.category?.name || '—'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-body text-muted-foreground">
                        {post.author?.name || '—'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs uppercase tracking-wider ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : post.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : post.status === 'archived'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {post.status}
                      </span>
                      {post.is_featured && (
                        <span className="ml-2 px-2 py-1 text-xs uppercase tracking-wider bg-primary/20 text-primary-dark">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-body">
                      {(post.view_count || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-body">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'published' ? (
                          <Link 
                            to={`/news/${post.slug}`} 
                            target="_blank"
                            className="p-2 hover:bg-secondary rounded transition-colors"
                            title="View published"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        ) : (
                          <button
                            onClick={() => setPreviewPost(post)}
                            className="p-2 hover:bg-secondary rounded transition-colors"
                            title="Preview draft"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        <Link 
                          to={`/admin/posts/${post.id}`}
                          className="p-2 hover:bg-secondary rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{post.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deletingId === post.id ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-body">
                Showing {startIndex + 1}-{endIndex} of {totalPosts} posts
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Draft Preview Dialog */}
      <Dialog open={!!previewPost} onOpenChange={() => setPreviewPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              Draft Preview: {previewPost?.title}
            </DialogTitle>
          </DialogHeader>
          {previewPost && (
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {previewPost.featured_image && (
                  <img 
                    src={previewPost.featured_image} 
                    alt={previewPost.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                
                <div className="space-y-2">
                  <h1 className="font-bold text-3xl font-bold">{previewPost.title}</h1>
                  {previewPost.subtitle && (
                    <p className="text-lg text-muted-foreground">{previewPost.subtitle}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{previewPost.category?.name || 'Uncategorized'}</span>
                    <span>•</span>
                    <span>{previewPost.author?.name || 'No author'}</span>
                    <span>•</span>
                    <span>{new Date(previewPost.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {previewPost.excerpt && (
                  <p className="text-muted-foreground italic border-l-4 border-primary pl-4">
                    {previewPost.excerpt}
                  </p>
                )}

                <div 
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewPost.content || '') }}
                />
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostsList;
