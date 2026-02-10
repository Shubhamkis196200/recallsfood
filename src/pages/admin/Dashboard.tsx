import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { FileText, FolderOpen, Eye, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { data: allPosts } = usePosts();
  const { data: categories } = useCategories();

  const publishedCount = allPosts?.filter(p => p.status === 'published').length || 0;
  const draftCount = allPosts?.filter(p => p.status === 'draft').length || 0;
  const featuredCount = allPosts?.filter(p => p.is_featured).length || 0;

  const stats = [
    { 
      label: 'Published Posts', 
      value: publishedCount, 
      icon: FileText,
      link: '/admin/posts?status=published'
    },
    { 
      label: 'Draft Posts', 
      value: draftCount, 
      icon: Eye,
      link: '/admin/posts?status=draft'
    },
    { 
      label: 'Categories', 
      value: categories?.length || 0, 
      icon: FolderOpen,
      link: '/admin/categories'
    },
    { 
      label: 'Featured Posts', 
      value: featuredCount, 
      icon: TrendingUp,
      link: '/admin/posts?featured=true'
    },
  ];

  const recentPosts = allPosts?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground font-body">Overview of your content management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="border border-border p-6 hover:border-gold transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="font-bold text-4xl mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground font-body">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-xl">Recent Posts</h2>
          <Link 
            to="/admin/posts" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentPosts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground font-body">
              No posts yet. <Link to="/admin/posts/new" className="text-primary hover:underline">Create your first post</Link>
            </div>
          ) : (
            recentPosts.map((post) => (
              <Link
                key={post.id}
                to={`/admin/posts/${post.id}`}
                className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-lg mb-1">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-body">
                    <span className={`px-2 py-0.5 text-xs uppercase tracking-wider ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {post.status}
                    </span>
                    {post.category && <span>{post.category.name}</span>}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground font-body">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/posts/new"
          className="border border-border p-6 text-center hover:border-gold hover:bg-secondary/30 transition-all"
        >
          <FileText className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <span className="font-bold text-lg">Create New Post</span>
        </Link>
        <Link
          to="/admin/categories"
          className="border border-border p-6 text-center hover:border-gold hover:bg-secondary/30 transition-all"
        >
          <FolderOpen className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <span className="font-bold text-lg">Manage Categories</span>
        </Link>
        <Link
          to="/"
          target="_blank"
          className="border border-border p-6 text-center hover:border-gold hover:bg-secondary/30 transition-all"
        >
          <Eye className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <span className="font-bold text-lg">View Live Site</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
