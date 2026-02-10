import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import RecallPage from "./pages/RecallPage";
import RecallsList from "./pages/RecallsList";
import StorePage from "./pages/StorePage";
import GuidesPage from "./pages/GuidesPage";
import GuidePage from "./pages/GuidePage";
import SearchPage from "./pages/SearchPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PostsList from "./pages/admin/PostsList";
import PostEditor from "./pages/admin/PostEditor";
import CategoriesPage from "./pages/admin/CategoriesPage";
import MediaLibrary from "./pages/admin/MediaLibrary";
import AuthorsPage from "./pages/admin/AuthorsPage";
import ApiKeysPage from "./pages/admin/ApiKeysPage";
import ApiDocsPage from "./pages/admin/ApiDocsPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import EmailSettingsPage from "./pages/admin/EmailSettingsPage";
import TagsPage from "./pages/admin/TagsPage";
import AcceptInvitation from "./pages/AcceptInvitation";
import AISettingsPage from "./pages/admin/AISettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recalls" element={<RecallsList />} />
            <Route path="/recalls/:slug" element={<RecallPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/stores/:slug" element={<StorePage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/guides/:slug" element={<GuidePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
