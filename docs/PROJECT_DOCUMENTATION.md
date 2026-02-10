# Global Luxe Times - Technical Documentation

> A production-grade luxury magazine CMS built with React, TypeScript, and Supabase

**Version:** 1.0.0  
**Last Updated:** December 2024

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Database Schema](#4-database-schema)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Frontend Public Website](#6-frontend-public-website)
7. [Admin CMS Dashboard](#7-admin-cms-dashboard)
8. [REST API](#8-rest-api)
9. [Edge Functions](#9-edge-functions)
10. [AI Features](#10-ai-features)
11. [Email & CRM Integration](#11-email--crm-integration)
12. [Security](#12-security)
13. [SEO Implementation](#13-seo-implementation)
14. [Configuration](#14-configuration)
15. [Deployment](#15-deployment)

---

## 1. Project Overview

Global Luxe Times is a full-featured luxury magazine content management system designed for high-quality editorial content. The platform supports:

- **Multi-author publishing** with role-based access control
- **AI-powered content generation** for blog articles and images
- **Scheduled publishing** with automatic post promotion
- **Newsletter subscription** with CRM integration
- **REST API** for external automation (n8n, Zapier, etc.)
- **SEO optimization** with structured data and meta management

### Key Features

| Feature | Description |
|---------|-------------|
| Rich Text Editor | TipTap-based WYSIWYG with tables, videos, images |
| AI Blog Writer | Multi-provider AI article generation with tone presets |
| AI Image Generation | AWS Bedrock, Ideogram, Stability AI support |
| Media Library | Centralized image management with cropping |
| API Access | RESTful API with key-based authentication |
| Analytics | View counts, API usage tracking, activity logs |

---

## 2. Technology Stack

### Frontend
```
React 18.3.1          - UI Framework
TypeScript            - Type Safety
Vite                  - Build Tool
Tailwind CSS          - Styling
shadcn/ui             - Component Library
TanStack React Query  - Data Fetching & Caching
React Router DOM      - Routing
TipTap                - Rich Text Editor
```

### Backend (Lovable Cloud / Supabase)
```
PostgreSQL            - Database
Supabase Auth         - Authentication
Supabase Storage      - File Storage (media bucket)
Deno Edge Functions   - Serverless Backend Logic
Row Level Security    - Data Access Control
```

### Third-Party Integrations
```
AWS Bedrock           - AI Models (Claude, Titan, Llama, Mistral)
Lovable AI Gateway    - Gemini, GPT-5 access
Brevo/Mailchimp       - Email & CRM
Instantly/ConvertKit  - CRM Sync
```

---

## 3. Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  Public Website          │           Admin CMS Dashboard        │
│  - Homepage              │  - Post Editor (TipTap)              │
│  - Category Pages        │  - Media Library                     │
│  - Article Pages         │  - AI Writer Panel                   │
│  - Search                │  - User Management                   │
│  - Newsletter Signup     │  - API Key Management                │
└──────────────┬───────────┴──────────────┬───────────────────────┘
               │                          │
               ▼                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase (Backend)                            │
├─────────────────────────────────────────────────────────────────┤
│  Auth Service    │  PostgreSQL DB    │  Storage    │  Edge Fns  │
│  - Email/Pass    │  - posts          │  - media    │  - cms-api │
│  - Roles (RLS)   │  - categories     │    bucket   │  - ai-gen  │
│                  │  - authors        │             │  - email   │
│                  │  - media          │             │  - sitemap │
└─────────────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
├─────────────────────────────────────────────────────────────────┤
│  AWS Bedrock     │  Lovable AI      │  Email/CRM Providers      │
│  - Claude        │  - Gemini        │  - Brevo                  │
│  - Titan Image   │  - GPT-5         │  - Mailchimp              │
│  - Llama         │                  │  - Instantly              │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── components/
│   ├── admin/              # Admin-specific components
│   │   ├── AIWriterPanel.tsx
│   │   ├── ImageGeneratorPanel.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── MediaPicker.tsx
│   │   └── TagSelector.tsx
│   ├── ui/                 # shadcn/ui components
│   └── [shared components]
├── contexts/
│   └── AuthContext.tsx     # Authentication state
├── hooks/
│   ├── usePosts.ts
│   ├── useAIGenerate.ts
│   ├── useAIImageGenerate.ts
│   ├── useBedrockModels.ts
│   └── [other hooks]
├── integrations/
│   └── supabase/
│       ├── client.ts       # Supabase client (auto-generated)
│       └── types.ts        # Database types (auto-generated)
├── layouts/
│   └── AdminLayout.tsx     # Admin dashboard layout
├── pages/
│   ├── admin/              # Admin pages
│   └── [public pages]
└── data/
    └── articles.ts         # Legacy static data (deprecated)

supabase/
└── functions/
    ├── admin-users/        # User management
    ├── ai-generate-blog/   # AI article generation
    ├── ai-generate-image/  # AI image generation
    ├── cms-api/            # REST API
    ├── list-bedrock-models/# AWS Bedrock model listing
    ├── publish-scheduled-posts/
    ├── send-email/
    ├── sitemap/
    └── sync-crm/
```

---

## 4. Database Schema

### Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    posts     │────▶│  categories  │     │    tags      │
│              │     └──────────────┘     └──────┬───────┘
│  - title     │                                 │
│  - slug      │     ┌──────────────┐     ┌──────┴───────┐
│  - content   │────▶│   authors    │     │  post_tags   │
│  - status    │     └──────────────┘     └──────────────┘
│  - view_count│
└──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   profiles   │     │  user_roles  │     │   api_keys   │
│              │     │              │     │              │
│  - user_id   │     │  - user_id   │     │  - key_hash  │
│  - full_name │     │  - role      │     │  - is_active │
│  - avatar_url│     │    (admin/   │     │  - expires_at│
└──────────────┘     │     editor)  │     └──────────────┘
                     └──────────────┘
```

### Core Tables

#### `posts`
Primary content table for articles.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Article title |
| `slug` | TEXT | URL-friendly identifier (auto-generated) |
| `subtitle` | TEXT | Optional subtitle |
| `content` | TEXT | HTML content from TipTap editor |
| `excerpt` | TEXT | Short summary for cards |
| `featured_image` | TEXT | URL to featured image |
| `status` | ENUM | `draft`, `published`, `scheduled`, `archived` |
| `category_id` | UUID | Foreign key to categories |
| `author_name_id` | UUID | Foreign key to authors |
| `author_id` | UUID | Foreign key to auth.users (creator) |
| `is_featured` | BOOLEAN | Show in featured section |
| `is_trending` | BOOLEAN | Show in trending section |
| `view_count` | INTEGER | Page view counter |
| `read_time_minutes` | INTEGER | Auto-calculated reading time |
| `meta_title` | TEXT | SEO title (50-60 chars) |
| `meta_description` | TEXT | SEO description (150-160 chars) |
| `scheduled_at` | TIMESTAMP | Future publish date |
| `published_at` | TIMESTAMP | Actual publish date |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### `categories`
Content categories for organization.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Category name |
| `slug` | TEXT | URL identifier |
| `description` | TEXT | Category description |
| `image_url` | TEXT | Category header image |
| `display_order` | INTEGER | Sort order |

#### `authors`
Author profiles (separate from auth users).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Display name |
| `slug` | TEXT | URL identifier |
| `bio` | TEXT | Author biography |
| `email` | TEXT | Contact email (admin-only visible) |
| `avatar_url` | TEXT | Profile image |
| `social_links` | JSONB | Social media URLs |
| `is_active` | BOOLEAN | Active status |
| `display_order` | INTEGER | Sort order |

#### `tags` and `post_tags`
Many-to-many tagging system.

```sql
-- tags table
id UUID PRIMARY KEY
name TEXT NOT NULL
slug TEXT NOT NULL UNIQUE

-- post_tags junction table
id UUID PRIMARY KEY
post_id UUID REFERENCES posts(id)
tag_id UUID REFERENCES tags(id)
```

#### `media`
Media library entries.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `file_name` | TEXT | Original filename |
| `file_path` | TEXT | Storage path/URL |
| `file_type` | TEXT | MIME type |
| `file_size` | INTEGER | Size in bytes |
| `alt_text` | TEXT | Accessibility text |
| `caption` | TEXT | Image caption |
| `width` | INTEGER | Image width |
| `height` | INTEGER | Image height |
| `uploaded_by` | UUID | Uploader user ID |

#### `user_roles`
Role assignments for access control.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Reference to auth.users |
| `role` | ENUM | `admin` or `editor` |

#### `api_keys`
API key management for REST API access.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Key name/description |
| `key_hash` | TEXT | SHA-256 hash of key |
| `key_prefix` | TEXT | First 8 chars for display |
| `is_active` | BOOLEAN | Active status |
| `expires_at` | TIMESTAMP | Optional expiration |
| `last_used_at` | TIMESTAMP | Last API call |
| `created_by` | UUID | Creator user ID |

### AI-Related Tables

#### `ai_models`
Text generation model configurations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Display name |
| `provider` | TEXT | `openai`, `google`, `anthropic`, `lovable`, `bedrock` |
| `model_id` | TEXT | Provider's model identifier |
| `api_key_encrypted` | TEXT | API key (⚠️ currently plain text) |
| `bedrock_account_id` | UUID | Reference to Bedrock account |
| `is_active` | BOOLEAN | Available for use |

#### `ai_image_models`
Image generation model configurations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Display name |
| `provider` | TEXT | `bedrock`, `ideogram`, `stability` |
| `model_id` | TEXT | Provider's model identifier |
| `api_key_encrypted` | TEXT | API key |
| `bedrock_account_id` | UUID | Reference to Bedrock account |
| `is_active` | BOOLEAN | Available for use |

#### `bedrock_accounts`
AWS Bedrock account configurations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Account nickname |
| `aws_access_key_encrypted` | TEXT | AWS access key |
| `aws_secret_key_encrypted` | TEXT | AWS secret key |
| `aws_region` | TEXT | AWS region (default: us-east-1) |
| `is_active` | BOOLEAN | Active status |

#### `ai_tone_presets`
Writing style presets for AI generation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Preset name |
| `description` | TEXT | Preset description |
| `tone` | TEXT | Tone type (formal, casual, etc.) |
| `custom_prompt` | TEXT | Full custom instructions |
| `style_guidelines` | TEXT | Writing style rules |
| `word_count_min` | INTEGER | Minimum word count |
| `word_count_max` | INTEGER | Maximum word count |
| `article_structure` | JSONB | Structure settings |
| `is_default` | BOOLEAN | Default preset flag |

#### `image_style_presets`
Visual style presets for AI image generation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Preset name |
| `description` | TEXT | Style description |
| `prompt_prefix` | TEXT | Prepended to prompts |
| `prompt_suffix` | TEXT | Appended to prompts |
| `negative_prompt` | TEXT | Things to avoid |
| `is_active` | BOOLEAN | Available for use |
| `is_default` | BOOLEAN | Default preset flag |

---

## 5. Authentication & Authorization

### Authentication Flow

1. **Login Only** - No public signup; users are invited by admins
2. **Email/Password** - Supabase Auth with auto-confirm enabled
3. **Invitation System** - Admins invite users with pre-assigned roles

### User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: users, API keys, settings, all content |
| **Editor** | Create/edit posts, manage media, view authors |

### Role-Based Access Control

```typescript
// AuthContext provides role checking
const { isAdmin, isEditor, user } = useAuth();

// Database functions for RLS
has_role(_user_id UUID, _role app_role) → BOOLEAN
is_admin_or_editor(_user_id UUID) → BOOLEAN
```

### RLS Policy Examples

```sql
-- Posts: Anyone reads published, admins/editors read all
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (
    status = 'published' OR is_admin_or_editor(auth.uid())
  );

-- Posts: Only admin can delete
CREATE POLICY "Admin can delete posts" ON posts
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Media: Only authenticated users can view
CREATE POLICY "Authenticated users can view media" ON media
  FOR SELECT USING (auth.uid() IS NOT NULL);
```

### User Invitation Flow

```
1. Admin creates invitation (email, name, role)
2. System generates secure token, stores hash
3. Email sent with invitation link
4. User clicks link → /accept-invite?token=xxx
5. User sets password, account activated
6. Role automatically assigned
```

---

## 6. Frontend Public Website

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Index.tsx` | Homepage with featured/trending articles |
| `/category/:slug` | `CategoryPage.tsx` | Category archive with pagination |
| `/article/:slug` | `ArticlePage.tsx` | Full article view |
| `/about` | `About.tsx` | About page |
| `/contact` | `Contact.tsx` | Contact form |
| `/privacy` | `Privacy.tsx` | Privacy policy |
| `/terms` | `Terms.tsx` | Terms of service |

### Key Components

#### `Header.tsx`
- Logo and navigation
- Search bar (`SearchBar.tsx`)
- Mobile-responsive menu

#### `ArticleCard.tsx`
- Displays article preview
- Featured image with lazy loading
- Category badge, author, read time
- View count display

#### `NewsletterSignup.tsx`
- Email subscription form
- Stores to `newsletter_subscribers` table
- CRM sync trigger

#### `RelatedArticles.tsx`
- Shows 3-4 articles from same category
- Excludes current article

### Data Fetching Hooks

```typescript
// Featured posts for homepage
useFeaturedPosts()

// Trending posts sidebar
useTrendingPosts()

// Category posts with pagination
usePaginatedPostsByCategory(categorySlug, page, limit)

// Single article
usePostBySlug(slug)
```

---

## 7. Admin CMS Dashboard

### Admin Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/admin` | `Dashboard.tsx` | Admin, Editor | Statistics overview |
| `/admin/posts` | `PostsList.tsx` | Admin, Editor | Post management |
| `/admin/posts/new` | `PostEditor.tsx` | Admin, Editor | Create post |
| `/admin/posts/:id` | `PostEditor.tsx` | Admin, Editor | Edit post |
| `/admin/authors` | `AuthorsPage.tsx` | Admin, Editor | Author management |
| `/admin/media` | `MediaLibrary.tsx` | Admin, Editor | Media management |
| `/admin/categories` | `CategoriesPage.tsx` | Admin, Editor | Category management |
| `/admin/tags` | `TagsPage.tsx` | Admin, Editor | Tag management |
| `/admin/subscribers` | `SubscribersPage.tsx` | Admin | Newsletter subscribers |
| `/admin/settings` | `SettingsPage.tsx` | Admin, Editor | Profile & password |
| `/admin/ai-settings` | `AISettingsPage.tsx` | Admin | AI model configuration |
| `/admin/api-keys` | `ApiKeysPage.tsx` | Admin | API key management |
| `/admin/api-docs` | `ApiDocsPage.tsx` | Admin | API documentation |
| `/admin/users` | `UsersPage.tsx` | Admin | User management |
| `/admin/email-settings` | `EmailSettingsPage.tsx` | Admin | Email configuration |
| `/admin/activity` | `ActivityLogPage.tsx` | Admin | Audit logs |

### Post Editor Features

#### Rich Text Editor (`RichTextEditor.tsx`)
- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1, H2, H3
- **Text Alignment**: Left, center, right, justify
- **Colors**: Text color and highlight picker
- **Lists**: Ordered and unordered
- **Quotes**: Blockquote styling
- **Links**: Insert/edit with modal dialog
- **Images**: Insert from media library or URL with cropping
- **Videos**: YouTube embed and generic iframe
- **Tables**: Full table support with cell operations
- **Subscript/Superscript**: Scientific notation
- **Word Count**: Real-time counter in status bar

#### AI Writer Panel (`AIWriterPanel.tsx`)
- Model selection (Bedrock, Lovable AI, direct APIs)
- Tone preset selection
- Topic and keyword input
- Word count slider
- Generated content preview
- Internal link suggestions (clickable)
- Tag suggestions (clickable)
- Keyword validation display
- Pull to editor functionality

#### Image Generator Panel (`ImageGeneratorPanel.tsx`)
- Featured image generation
- Section-by-section image generation
- Style preset selection
- Auto alt-text and captions
- Direct insert to media library

### Media Library (`MediaLibrary.tsx`)
- Grid view of all uploads
- Upload new images
- Edit alt text and captions
- Delete functionality (admin only)
- Search and filter

### Post List Features (`PostsList.tsx`)
- **Pagination**: 10 posts per page
- **Search**: Title and content search
- **Filters**:
  - Status (draft, published, scheduled, archived)
  - Category
  - Author
  - Date range
  - View count range
- **Draft Preview**: Modal preview for unpublished posts
- **Quick Actions**: Edit, delete, change status

---

## 8. REST API

### Base URL
```
https://qjzhkgqvfmbdccxpwxtz.supabase.co/functions/v1/cms-api
```

### Authentication
All endpoints require the `x-api-key` header:
```
x-api-key: your_api_key_here
```

### Rate Limits
| Operation | Limit |
|-----------|-------|
| Read (GET) | 10 requests/second |
| Write (POST, PUT, DELETE, PATCH) | 2 requests/second |

Response headers:
- `X-RateLimit-Limit`: Max requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

### Endpoints

#### Posts

```http
GET /posts
GET /posts?status=published&category_id=xxx&limit=10&offset=0
GET /posts/:id
POST /posts
PUT /posts/:id
PATCH /posts/:id
DELETE /posts/:id
```

**Create Post Body:**
```json
{
  "title": "Article Title",
  "slug": "article-title",
  "content": "<p>HTML content...</p>",
  "excerpt": "Short summary",
  "featured_image": "https://...",
  "category_id": "uuid",
  "author_name_id": "uuid",
  "status": "draft|published|scheduled",
  "scheduled_at": "2024-12-25T10:00:00Z",
  "is_featured": false,
  "is_trending": false,
  "meta_title": "SEO Title",
  "meta_description": "SEO Description"
}
```

#### Authors

```http
GET /authors
GET /authors/:id
POST /authors
PUT /authors/:id
DELETE /authors/:id
```

#### Categories

```http
GET /categories
GET /categories/:id
POST /categories
PUT /categories/:id
DELETE /categories/:id
```

#### Media

```http
GET /media
GET /media/:id
DELETE /media/:id
```

### Response Format

**Success:**
```json
{
  "data": { ... },
  "count": 100
}
```

**Error:**
```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

---

## 9. Edge Functions

### `cms-api/index.ts`
RESTful API for external integrations.

- API key validation via SHA-256 hash comparison
- Rate limiting with sliding window
- CRUD operations for posts, authors, categories, media
- Usage logging to `api_key_usage` table

### `ai-generate-blog/index.ts`
AI article generation.

**Providers:**
- AWS Bedrock (Claude, Llama, Mistral)
- Lovable AI Gateway (Gemini, GPT-5)
- Direct APIs (OpenAI, Google, Anthropic)

**Process:**
1. Fetch model configuration from database
2. Build prompt with tone preset instructions
3. Call AI provider
4. Parse structured response (title, content, tags, etc.)
5. Return generated content

### `ai-generate-image/index.ts`
AI image generation.

**Providers:**
- AWS Bedrock (Titan Image Generator)
- Ideogram
- Stability AI

**Process:**
1. Build prompt with style preset modifiers
2. Generate image (base64)
3. Compress to JPEG at 80% quality (1152×768px)
4. Upload to Supabase Storage
5. Create media library entry
6. Return image URL with alt text/caption

### `list-bedrock-models/index.ts`
Lists available AWS Bedrock models.

- Filters to on-demand inference models only
- Separates text and image generation models
- Returns model IDs and display names

### `send-email/index.ts`
Email delivery with multiple providers.

**Supported Providers:**
- Resend
- SMTP
- SendGrid
- Brevo
- Instantly

### `sync-crm/index.ts`
Syncs newsletter subscribers to CRM platforms.

**Supported CRMs:**
- Brevo
- Mailchimp
- Instantly
- ConvertKit
- HubSpot
- ActiveCampaign

### `crm-webhook/index.ts`
Receives webhook events from CRMs.

- Handles unsubscribe events
- Updates `newsletter_subscribers` status
- Tracks unsubscribe source

### `admin-users/index.ts`
User management operations.

- Create users with roles
- Update user roles
- Delete users
- Reset passwords
- Send invitation emails

### `publish-scheduled-posts/index.ts`
Automatic scheduled post publishing.

- Queries posts where `status = 'scheduled'` and `scheduled_at <= now()`
- Updates status to `published`
- Sets `published_at` timestamp

### `sitemap/index.ts`
Dynamic XML sitemap generation.

- Includes homepage, static pages
- All published posts with lastmod
- All categories
- Proper priority and changefreq values

---

## 10. AI Features

### AI Blog Writer

#### Model Configuration
```
┌─────────────────────────────────────────────────┐
│               AI Model Sources                   │
├─────────────────────────────────────────────────┤
│  1. Lovable AI Gateway (No API key needed)      │
│     - google/gemini-2.5-flash (default)         │
│     - google/gemini-2.5-pro                     │
│     - openai/gpt-5                              │
│                                                 │
│  2. AWS Bedrock (Multiple accounts)             │
│     - Claude 3.5 Sonnet                         │
│     - Llama 3.1                                 │
│     - Mistral Large                             │
│                                                 │
│  3. Direct API Integration                      │
│     - OpenAI                                    │
│     - Google AI                                 │
│     - Anthropic                                 │
└─────────────────────────────────────────────────┘
```

#### Tone Presets
19 standard tones available:
- Formal, Informal, Professional
- Optimistic, Humorous, Sarcastic
- Inspirational, Authoritative, Conversational
- And 10 more...

Custom presets support:
- Custom prompt instructions
- Article structure (intro, sections, conclusion, CTA)
- Word count range
- Style guidelines

#### Generation Process
1. Select model and tone preset
2. Enter topic and target keywords (comma-separated)
3. Set word count target
4. Generate → AI produces:
   - Title and slug
   - Excerpt
   - Full HTML content
   - Meta title and description
   - Suggested tags
   - Internal link suggestions
   - Keyword validation results

### AI Image Generation

#### Image Models
```
AWS Bedrock:
- Amazon Titan Image Generator v2

Other Providers:
- Ideogram
- Stability AI
```

#### Image Specifications
- **Resolution**: 1152×768px (3:2 aspect ratio)
- **Format**: JPEG
- **Quality**: 80% compression
- **Prompt Limit**: 500 characters (Bedrock)

#### Style Presets
- Photorealistic
- Editorial
- Artistic
- Minimalist
- Luxury
- Vintage

#### Generation Options
1. **Featured Image**: Context-aware based on full article
2. **Section Images**: Generate for specific H2 sections
3. **Style Application**: Apply preset to all generations

---

## 11. Email & CRM Integration

### Email Providers

| Provider | Configuration |
|----------|---------------|
| Resend | API Key |
| SendGrid | API Key |
| Brevo | API Key |
| SMTP | Host, Port, User, Password |
| Instantly | API Key |

### CRM Sync

**Outbound Sync (to CRM):**
- New subscriber → Create contact in CRM
- Tracks sync status in `crm_synced_at`
- Stores CRM contact ID for reference

**Inbound Webhooks (from CRM):**
- Unsubscribe events
- Bounce events
- Complaint events
- Updates `newsletter_subscribers.is_active`
- Tracks `unsubscribe_source`

### Webhook Endpoints
```
POST /functions/v1/crm-webhook?provider=brevo
POST /functions/v1/crm-webhook?provider=mailchimp
POST /functions/v1/crm-webhook?provider=instantly
```

---

## 12. Security

### Current Security Measures

✅ **Implemented:**
- Row Level Security (RLS) on all tables
- Role-based access control (admin/editor)
- API key hashing (SHA-256)
- Rate limiting on API endpoints
- XSS prevention via DOMPurify
- Input validation on activity logs
- Restricted email visibility

⚠️ **Known Vulnerabilities:**
- AWS credentials stored in plain text (labeled as "encrypted")
- Email API keys in plain text
- AI model API keys in plain text
- Leaked password protection disabled

### Recommended Fixes

1. **Migrate credentials to Lovable Cloud Secrets:**
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `BREVO_API_KEY`
   - `INSTANTLY_API_KEY`

2. **Enable leaked password protection** in auth settings

3. **Remove credential columns** from database tables

### RLS Policy Summary

| Table | Public Read | Auth Read | Admin/Editor Write | Admin Only |
|-------|-------------|-----------|--------------------| -----------|
| posts | Published only | All | ✓ | Delete |
| categories | ✓ | ✓ | ✓ | - |
| authors | Active only | ✓ | ✓ | - |
| media | - | ✓ | ✓ | Delete |
| tags | ✓ | ✓ | ✓ | - |
| api_keys | - | - | - | Full |
| user_roles | - | - | - | Full |
| newsletter_subscribers | - | - | - | Full |

---

## 13. SEO Implementation

### Meta Tags (`SEO.tsx`)
- Dynamic title with template
- Meta description
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags
- Canonical URL

### Structured Data

#### Website Schema (`WebsiteJsonLd.tsx`)
```json
{
  "@type": "WebSite",
  "name": "Global Luxe Times",
  "url": "https://...",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://.../search?q={search_term}"
  }
}
```

#### Article Schema (`ArticleJsonLd.tsx`)
```json
{
  "@type": "Article",
  "headline": "...",
  "image": "...",
  "author": { "@type": "Person", "name": "..." },
  "datePublished": "...",
  "dateModified": "..."
}
```

### Sitemap
- Dynamic XML at `/sitemap.xml`
- Auto-updated with new posts
- Includes all categories
- Proper lastmod, changefreq, priority

### Performance
- Lazy loading images
- Semantic HTML structure
- Single H1 per page
- Descriptive alt texts

---

## 14. Configuration

### Environment Variables

```bash
# Auto-generated by Lovable Cloud
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=xxx
VITE_SUPABASE_PROJECT_ID=xxx
```

### Supabase Secrets

| Secret | Purpose |
|--------|---------|
| `SUPABASE_URL` | Database connection |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin database access |
| `LOVABLE_API_KEY` | Lovable AI Gateway access |

### Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `media` | Yes | All uploaded images |

---

## 15. Deployment

### Frontend Deployment
1. Click "Publish" in Lovable editor
2. Click "Update" to deploy changes
3. Wait for build completion

### Backend (Edge Functions)
- **Automatic deployment** on code save
- No manual deployment needed
- Changes are live immediately

### Custom Domain
1. Go to Project Settings → Domains
2. Add custom domain
3. Configure DNS records
4. Wait for SSL provisioning

### Database Migrations
1. Use migration tool in Lovable
2. Review SQL changes
3. Approve migration
4. Types auto-regenerate

---

## Appendix A: Database Functions

```sql
-- Generate URL-friendly slug from title
generate_slug(title TEXT) → TEXT

-- Calculate reading time from content
calculate_read_time(content TEXT) → INTEGER

-- Check if user has specific role
has_role(_user_id UUID, _role app_role) → BOOLEAN

-- Check if user is admin or editor
is_admin_or_editor(_user_id UUID) → BOOLEAN

-- Increment post view counter
increment_view_count(post_slug TEXT) → VOID

-- Auto-update timestamps
update_updated_at_column() → TRIGGER
```

---

## Appendix B: Hooks Reference

### Data Fetching Hooks

| Hook | Purpose |
|------|---------|
| `usePosts` | Fetch all posts with filters |
| `usePost` | Fetch single post by ID |
| `usePostBySlug` | Fetch single post by slug |
| `useFeaturedPosts` | Fetch featured posts |
| `useTrendingPosts` | Fetch trending posts |
| `useCategories` | Fetch all categories |
| `useAuthors` | Fetch all authors |
| `useTags` | Fetch all tags |
| `useMedia` | Fetch media library |
| `useSubscribers` | Fetch newsletter subscribers |

### AI Hooks

| Hook | Purpose |
|------|---------|
| `useAIModels` | Manage AI text models |
| `useAIImageModels` | Manage AI image models |
| `useBedrockAccounts` | Manage AWS Bedrock accounts |
| `useBedrockModels` | List available Bedrock models |
| `useBedrockImageModels` | List Bedrock image models |
| `useAIGenerate` | Generate AI blog content |
| `useAIImageGenerate` | Generate AI images |
| `useAITonePresets` | Manage writing tone presets |
| `useImageStylePresets` | Manage image style presets |

### Mutation Hooks

| Hook | Purpose |
|------|---------|
| `useCreatePost` | Create new post |
| `useUpdatePost` | Update existing post |
| `useDeletePost` | Delete post |
| `useCreateAuthor` | Create new author |
| `useUpdateAuthor` | Update author |
| `useDeleteAuthor` | Delete author |

---

## Appendix C: Component Library

### UI Components (shadcn/ui)
All components in `src/components/ui/` follow shadcn/ui patterns:
- Button, Input, Textarea
- Dialog, Sheet, Drawer
- Select, Checkbox, Switch
- Table, Card, Badge
- Toast, Tooltip
- And 40+ more...

### Custom Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ArticleCard` | `src/components/` | Article preview card |
| `Header` | `src/components/` | Site header with nav |
| `Footer` | `src/components/` | Site footer |
| `SearchBar` | `src/components/` | Search input |
| `NewsletterSignup` | `src/components/` | Email subscription |
| `RichTextEditor` | `src/components/admin/` | TipTap editor |
| `AIWriterPanel` | `src/components/admin/` | AI generation UI |
| `ImageGeneratorPanel` | `src/components/admin/` | AI image UI |
| `MediaPicker` | `src/components/admin/` | Image selection |
| `TagSelector` | `src/components/admin/` | Tag management |

---

## Appendix D: Troubleshooting

### Common Issues

**Issue: Posts not showing on frontend**
- Check post status is `published`
- Verify `published_at` is set
- Check RLS policies

**Issue: Images not loading**
- Verify media bucket is public
- Check file path in database
- Confirm upload completed

**Issue: AI generation fails**
- Check model configuration
- Verify API keys are correct
- Check rate limits

**Issue: API returns 401**
- Verify API key is active
- Check key hasn't expired
- Confirm x-api-key header

**Issue: CRM sync fails**
- Check CRM API credentials
- Verify webhook URLs
- Review provider documentation

---

*Document maintained by the Global Luxe Times development team.*
