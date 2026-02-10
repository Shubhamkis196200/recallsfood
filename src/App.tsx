import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Code-split: public pages loaded on demand
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const RecallPage = lazy(() => import("./pages/RecallPage"));
const RecallsList = lazy(() => import("./pages/RecallsList"));
const StorePage = lazy(() => import("./pages/StorePage"));
const GuidesPage = lazy(() => import("./pages/GuidesPage"));
const GuidePage = lazy(() => import("./pages/GuidePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const PathogenPage = lazy(() => import("./pages/PathogenPage"));
const Archive = lazy(() => import("./pages/Archive"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const RecallsToday = lazy(() => import("./pages/RecallsToday"));
const RecallsThisWeek = lazy(() => import("./pages/RecallsThisWeek"));
const ToolsIndex = lazy(() => import("./pages/ToolsIndex"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
const Auth = lazy(() => import("./pages/Auth"));
const AcceptInvitation = lazy(() => import("./pages/AcceptInvitation"));

// Code-split: admin routes (heavy, rarely loaded by visitors)
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const PostsList = lazy(() => import("./pages/admin/PostsList"));
const PostEditor = lazy(() => import("./pages/admin/PostEditor"));
const CategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const AuthorsPage = lazy(() => import("./pages/admin/AuthorsPage"));
const ApiKeysPage = lazy(() => import("./pages/admin/ApiKeysPage"));
const ApiDocsPage = lazy(() => import("./pages/admin/ApiDocsPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const EmailSettingsPage = lazy(() => import("./pages/admin/EmailSettingsPage"));
const TagsPage = lazy(() => import("./pages/admin/TagsPage"));
const AISettingsPage = lazy(() => import("./pages/admin/AISettingsPage"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/recalls" element={<RecallsList />} />
              <Route path="/recalls/today" element={<RecallsToday />} />
              <Route path="/recalls/this-week" element={<RecallsThisWeek />} />
              <Route path="/recalls/:slug" element={<RecallPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/stores/:slug" element={<StorePage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/guides/:slug" element={<GuidePage />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/pathogens/:slug" element={<PathogenPage />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/tools" element={<ToolsIndex />} />
              <Route path="/tools/:slug" element={<ToolPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/accept-invite" element={<AcceptInvitation />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="posts" element={<PostsList />} />
                <Route path="posts/new" element={<PostEditor />} />
                <Route path="posts/:id" element={<PostEditor />} />
                <Route path="authors" element={<AuthorsPage />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="api-keys" element={<ApiKeysPage />} />
                <Route path="api-docs" element={<ApiDocsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="email-settings" element={<EmailSettingsPage />} />
                <Route path="tags" element={<TagsPage />} />
                <Route path="ai-settings" element={<AISettingsPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
