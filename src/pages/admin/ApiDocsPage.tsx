import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, FileText, Users, FolderOpen, Image, Tag } from 'lucide-react';
import { toast } from 'sonner';

const ApiDocsPage = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const baseUrl = 'https://qjzhkgqvfmbdccxpwxtz.supabase.co/functions/v1/cms-api';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const CodeBlock = ({ code, language = 'json' }: { code: string; language?: string }) => (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => copyToClipboard(code)}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );

  const MethodBadge = ({ method }: { method: string }) => {
    const colors: Record<string, string> = {
      GET: 'bg-green-500/10 text-green-600 border-green-500/20',
      POST: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      PUT: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      DELETE: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    return (
      <Badge variant="outline" className={colors[method]}>
        {method}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif mb-2">API Documentation</h1>
        <p className="text-muted-foreground font-body">
          Complete reference for the CMS REST API (V5)
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Getting started with the CMS API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Base URL</h4>
            <CodeBlock code={baseUrl} />
          </div>
          <div>
            <h4 className="font-medium mb-2">Authentication</h4>
            <p className="text-sm text-muted-foreground mb-2">
              All requests require an API key in the <code className="bg-muted px-1 rounded">x-api-key</code> header.
            </p>
            <CodeBlock code={`curl -H "x-api-key: your_api_key" ${baseUrl}/posts`} language="bash" />
          </div>
          <div>
            <h4 className="font-medium mb-2">Rate Limiting</h4>
            <p className="text-sm text-muted-foreground mb-2">
              All API keys have the same rate limits: 10 read requests/sec (GET), 2 write requests/sec (POST/PUT/DELETE).
              Limits are returned in response headers:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><code className="bg-muted px-1 rounded">X-RateLimit-Limit</code>: Maximum requests per second</li>
              <li><code className="bg-muted px-1 rounded">X-RateLimit-Remaining</code>: Remaining requests in window</li>
              <li><code className="bg-muted px-1 rounded">X-RateLimit-Reset</code>: Unix timestamp when limit resets</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Response Format</h4>
            <p className="text-sm text-muted-foreground">
              All responses are returned in JSON format. Successful responses include the requested data.
              Error responses include an <code className="bg-muted px-1 rounded">error</code> field with details.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="posts" className="gap-2">
            <FileText className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="tags" className="gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </TabsTrigger>
          <TabsTrigger value="authors" className="gap-2">
            <Users className="h-4 w-4" />
            Authors
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <Image className="h-4 w-4" />
            Media
          </TabsTrigger>
        </TabsList>

        {/* Posts API */}
        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-sm">/posts</code>
              </div>
              <CardDescription>Retrieve a list of posts with optional filtering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Query Parameters</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Parameter</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>status</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Filter by status: draft, published, scheduled, archived</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>category_id</code></td>
                      <td className="py-2">uuid</td>
                      <td className="py-2">Filter by category ID</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>author_name_id</code></td>
                      <td className="py-2">uuid</td>
                      <td className="py-2">Filter by author ID</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>search</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Search in title and content</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>limit</code></td>
                      <td className="py-2">number</td>
                      <td className="py-2">Limit results (default: 50)</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code>offset</code></td>
                      <td className="py-2">number</td>
                      <td className="py-2">Offset for pagination (default: 0)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="font-medium mb-2">Example Request</h4>
                <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/posts?status=published&limit=10"`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-sm">/posts/:id</code>
              </div>
              <CardDescription>Retrieve a single post by ID or slug</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/posts/post-uuid-or-slug"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="POST" />
                <code className="text-sm">/posts</code>
              </div>
              <CardDescription>Create a new post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Request Body</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Field</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Required</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>title</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Yes</td>
                      <td className="py-2">Post title</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>slug</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">URL slug (auto-generated if not provided)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>subtitle</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">Post subtitle</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>excerpt</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">Short description</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>content</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">HTML content with styles, links, quotes, embeds</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>featured_image</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">URL of featured image</td>
                    </tr>
                    <tr className="border-b bg-green-500/5">
                      <td className="py-2"><code>featured_image_alt</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">Alt text for featured image (SEO)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>category_id</code></td>
                      <td className="py-2">uuid</td>
                      <td className="py-2">No</td>
                      <td className="py-2">Category UUID</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>author_name_id</code></td>
                      <td className="py-2">uuid</td>
                      <td className="py-2">No</td>
                      <td className="py-2">Author UUID</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>status</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">draft, published, scheduled, archived</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>scheduled_at</code></td>
                      <td className="py-2">timestamp</td>
                      <td className="py-2">No</td>
                      <td className="py-2">ISO 8601 datetime for scheduled posts</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>is_featured</code></td>
                      <td className="py-2">boolean</td>
                      <td className="py-2">No</td>
                      <td className="py-2">Mark as featured</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>is_trending</code></td>
                      <td className="py-2">boolean</td>
                      <td className="py-2">No</td>
                      <td className="py-2">Mark as trending</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>meta_title</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">SEO meta title (50-58 chars)</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code>meta_description</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">SEO meta description (150-158 chars)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="font-medium mb-2">Example Request</h4>
                <CodeBlock code={`curl -X POST -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "New Article Title",
    "content": "<p>Article content with <strong>styles</strong>...</p>",
    "featured_image": "https://example.com/image.jpg",
    "featured_image_alt": "Description of the image for SEO",
    "status": "published",
    "is_featured": true,
    "meta_title": "SEO Title Under 58 Characters",
    "meta_description": "SEO description for search engines under 158 characters"
  }' \\
  "${baseUrl}/posts"`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="PUT" />
                <code className="text-sm">/posts/:id</code>
              </div>
              <CardDescription>Update an existing post (all fields from POST are supported)</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -X PUT -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Updated Title", "featured_image_alt": "Updated alt text", "status": "published"}' \\
  "${baseUrl}/posts/post-uuid-here"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="DELETE" />
                <code className="text-sm">/posts/:id</code>
              </div>
              <CardDescription>Delete a post (also removes tag associations)</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -X DELETE -H "x-api-key: your_api_key" "${baseUrl}/posts/post-uuid-here"`} />
            </CardContent>
          </Card>

          {/* Post-Tags endpoints */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Post-Tag Relationships</CardTitle>
              <CardDescription>Manage tags assigned to posts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MethodBadge method="GET" />
                  <code className="text-sm">/posts/:id/tags</code>
                </div>
                <p className="text-sm text-muted-foreground">Get all tags for a post</p>
                <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/posts/post-uuid/tags"`} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MethodBadge method="POST" />
                  <code className="text-sm">/posts/:id/tags</code>
                </div>
                <p className="text-sm text-muted-foreground">Set tags for a post (replaces existing)</p>
                <CodeBlock code={`curl -X POST -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"tag_ids": ["tag-uuid-1", "tag-uuid-2"]}' \\
  "${baseUrl}/posts/post-uuid/tags"`} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MethodBadge method="DELETE" />
                  <code className="text-sm">/posts/:id/tags/:tag_id</code>
                </div>
                <p className="text-sm text-muted-foreground">Remove a single tag from a post</p>
                <CodeBlock code={`curl -X DELETE -H "x-api-key: your_api_key" "${baseUrl}/posts/post-uuid/tags/tag-uuid"`} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tags API */}
        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-sm">/tags</code>
              </div>
              <CardDescription>Retrieve all tags</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/tags"`} />
              <div className="mt-4">
                <h4 className="font-medium mb-2">Response Example</h4>
                <CodeBlock code={`[
  {
    "id": "uuid-here",
    "name": "Luxury Fashion",
    "slug": "luxury-fashion",
    "created_at": "2024-01-01T00:00:00Z"
  }
]`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-sm">/tags/:id</code>
              </div>
              <CardDescription>Retrieve a single tag by ID or slug</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/tags/tag-uuid-or-slug"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="POST" />
                <code className="text-sm">/tags</code>
              </div>
              <CardDescription>Create a new tag</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Request Body</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Field</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>name</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Yes</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code>slug</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No (auto-generated)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CodeBlock code={`curl -X POST -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Sustainable Fashion", "slug": "sustainable-fashion"}' \\
  "${baseUrl}/tags"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="PUT" />
                <code className="text-sm">/tags/:id</code>
              </div>
              <CardDescription>Update a tag</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -X PUT -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Updated Tag Name"}' \\
  "${baseUrl}/tags/tag-uuid-here"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="DELETE" />
                <code className="text-sm">/tags/:id</code>
              </div>
              <CardDescription>Delete a tag (fails if assigned to posts)</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -X DELETE -H "x-api-key: your_api_key" "${baseUrl}/tags/tag-uuid-here"`} />
              <p className="text-sm text-muted-foreground mt-2">
                Note: Cannot delete tags that are assigned to posts. Remove from posts first.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authors API */}
        <TabsContent value="authors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-sm">/authors</code>
              </div>
              <CardDescription>Retrieve all authors (active only by default)</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/authors"
# Include inactive authors:
curl -H "x-api-key: your_api_key" "${baseUrl}/authors?include_inactive=true"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-sm">/authors/:id</code>
              </div>
              <CardDescription>Retrieve a single author by ID or slug</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/authors/author-uuid-or-slug"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="POST" />
                <code className="text-sm">/authors</code>
              </div>
              <CardDescription>Create a new author</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Request Body</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Field</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>name</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Yes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>slug</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No (auto-generated)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>bio</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>email</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>avatar_url</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>social_links</code></td>
                      <td className="py-2">object</td>
                      <td className="py-2">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>is_active</code></td>
                      <td className="py-2">boolean</td>
                      <td className="py-2">No (default: true)</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code>display_order</code></td>
                      <td className="py-2">number</td>
                      <td className="py-2">No (default: 0)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CodeBlock code={`curl -X POST -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Doe", "slug": "jane-doe", "bio": "Fashion writer", "social_links": {"twitter": "janedoe"}}' \\
  "${baseUrl}/authors"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="PUT" />
                <code className="text-sm">/authors/:id</code>
              </div>
              <CardDescription>Update an author</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -X PUT -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"bio": "Updated bio", "is_active": false}' \\
  "${baseUrl}/authors/author-uuid-here"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="DELETE" />
                <code className="text-sm">/authors/:id</code>
              </div>
              <CardDescription>Delete an author (fails if author has posts)</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -X DELETE -H "x-api-key: your_api_key" "${baseUrl}/authors/author-uuid-here"`} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories API */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-sm">/categories</code>
              </div>
              <CardDescription>Retrieve all categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/categories"`} />
              <div>
                <h4 className="font-medium mb-2">Response Example</h4>
                <CodeBlock code={`[
  {
    "id": "uuid-here",
    "name": "Luxury Fashion",
    "slug": "luxury-fashion",
    "description": "Latest in luxury fashion",
    "image_url": "https://example.com/category.jpg",
    "display_order": 1
  }
]`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-sm">/categories/:id</code>
              </div>
              <CardDescription>Retrieve a single category by ID or slug</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/categories/category-uuid-or-slug"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="POST" />
                <code className="text-sm">/categories</code>
              </div>
              <CardDescription>Create a new category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Request Body</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Field</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>name</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Yes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>slug</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No (auto-generated)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>description</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>image_url</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code>display_order</code></td>
                      <td className="py-2">number</td>
                      <td className="py-2">No (default: 0)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CodeBlock code={`curl -X POST -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Tech & Innovation", "description": "Technology in luxury"}' \\
  "${baseUrl}/categories"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="PUT" />
                <code className="text-sm">/categories/:id</code>
              </div>
              <CardDescription>Update a category</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -X PUT -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"description": "Updated description", "display_order": 5}' \\
  "${baseUrl}/categories/category-uuid-here"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="DELETE" />
                <code className="text-sm">/categories/:id</code>
              </div>
              <CardDescription>Delete a category (fails if category has posts)</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -X DELETE -H "x-api-key: your_api_key" "${baseUrl}/categories/category-uuid-here"`} />
              <p className="text-sm text-muted-foreground mt-2">
                Note: Cannot delete categories that have posts. Reassign posts first.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media API */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-sm">/media</code>
              </div>
              <CardDescription>Retrieve all media files with pagination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Query Parameters</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Parameter</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>limit</code></td>
                      <td className="py-2">number</td>
                      <td className="py-2">Limit results (default: 50)</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code>offset</code></td>
                      <td className="py-2">number</td>
                      <td className="py-2">Offset for pagination (default: 0)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/media?limit=20&offset=0"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-sm">/media/:id</code>
              </div>
              <CardDescription>Retrieve a single media item by ID</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -H "x-api-key: your_api_key" "${baseUrl}/media/media-uuid-here"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="POST" />
                <code className="text-sm">/media</code>
              </div>
              <CardDescription>Upload a new media file (base64 encoded)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Request Body</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Field</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>file_name</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Yes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>file_data</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Yes (base64)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>file_type</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Yes (mime type)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>alt_text</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>caption</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>width</code></td>
                      <td className="py-2">number</td>
                      <td className="py-2">No</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code>height</code></td>
                      <td className="py-2">number</td>
                      <td className="py-2">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CodeBlock code={`curl -X POST -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "file_name": "image.jpg",
    "file_data": "data:image/jpeg;base64,/9j/4AAQSkZ...",
    "file_type": "image/jpeg",
    "alt_text": "Description of image for SEO",
    "caption": "Image caption"
  }' \\
  "${baseUrl}/media"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="PUT" />
                <code className="text-sm">/media/:id</code>
              </div>
              <CardDescription>Update media metadata (alt_text, caption)</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -X PUT -H "x-api-key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"alt_text": "Updated alt text", "caption": "Updated caption"}' \\
  "${baseUrl}/media/media-uuid-here"`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MethodBadge method="DELETE" />
                <code className="text-sm">/media/:id</code>
              </div>
              <CardDescription>Delete a media file (removes from storage and database)</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`curl -X DELETE -H "x-api-key: your_api_key" "${baseUrl}/media/media-uuid-here"`} />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Error Handling */}
      <Card>
        <CardHeader>
          <CardTitle>Error Handling</CardTitle>
          <CardDescription>Common error responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">401 Unauthorized</h4>
              <CodeBlock code={`{"error": "Unauthorized", "message": "Invalid or expired API key"}`} />
            </div>
            <div>
              <h4 className="font-medium mb-2">404 Not Found</h4>
              <CodeBlock code={`{"error": "Not found", "message": "Post not found"}`} />
            </div>
            <div>
              <h4 className="font-medium mb-2">400 Bad Request</h4>
              <CodeBlock code={`{"error": "Cannot delete", "message": "Author has 5 posts assigned"}`} />
            </div>
            <div>
              <h4 className="font-medium mb-2">429 Too Many Requests</h4>
              <CodeBlock code={`{"error": "Too Many Requests", "message": "Rate limit exceeded", "retry_after_ms": 500}`} />
            </div>
            <div>
              <h4 className="font-medium mb-2">500 Internal Error</h4>
              <CodeBlock code={`{"error": "Internal error", "message": "Database connection failed"}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocsPage;
