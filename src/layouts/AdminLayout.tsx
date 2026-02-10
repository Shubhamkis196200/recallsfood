import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, FileText, FolderOpen, Image, LogOut, User, Users, Key, Book, Settings, UserCog, Mail, Tag, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  const { user, isEditor, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isEditor) {
      navigate('/');
    }
  }, [user, isEditor, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-body">Loading...</p>
      </div>
    );
  }

  if (!user || !isEditor) {
    return null;
  }

  const sharedNavItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Posts', path: '/admin/posts', icon: FileText },
    { label: 'Authors', path: '/admin/authors', icon: Users },
    { label: 'Media', path: '/admin/media', icon: Image },
    { label: 'Categories', path: '/admin/categories', icon: FolderOpen },
    { label: 'Tags', path: '/admin/tags', icon: Tag },
  ];

  const adminOnlyNavItems = [
    { label: 'AI Settings', path: '/admin/ai-settings', icon: Bot },
    { label: 'API Keys', path: '/admin/api-keys', icon: Key },
    { label: 'API Docs', path: '/admin/api-docs', icon: Book },
    { label: 'Users', path: '/admin/users', icon: UserCog },
    { label: 'Email Settings', path: '/admin/email-settings', icon: Mail },
  ];

  const navItems = isAdmin 
    ? [...sharedNavItems, ...adminOnlyNavItems]
    : sharedNavItems;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-background flex flex-col">
        <div className="p-6 border-b border-background/10">
          <Link to="/admin" className="block">
            <h1 className="font-bold text-xl">RecallsFood Admin</h1>
            <p className="text-xs text-background/60 mt-1">Content Management</p>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded transition-colors font-body ${
                      isActive 
                        ? 'bg-background/10 text-background' 
                        : 'text-background/60 hover:text-background hover:bg-background/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-background/10">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <User className="w-5 h-5 text-background/60" />
            <span className="text-sm text-background/80 font-body truncate">
              {user.email}
            </span>
          </div>
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 px-4 py-2 mb-2 text-background/60 hover:text-background hover:bg-background/5 rounded transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-body">Settings</span>
          </Link>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-background/60 hover:text-background hover:bg-background/5"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
