# Vorkspace

Vorkspace is a modern workspace management platform built with Next.js, featuring real-time capabilities, AI-powered assistance, a robust PostgreSQL database with Drizzle ORM, and high-performance caching using Redis.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Caching**: Redis (via `ioredis`)
- **Styling**: Tailwind CSS v4, shadcn/ui
- **AI**: Vercel AI SDK with Google Gemini (`gemini-3.1-flash-lite-preview`)

## Project Architecture

### Database Schema

The database is managed using Drizzle ORM and organized into feature-based schemas located in `src/db/schema/`:

- **Auth**: Accounts, sessions, users, and verifications (handled via Better Auth).
- **Organizations**: Core workspace entities managing members, roles, and settings.
- **Tickets**: Issue tracking and task management within an organization.
- **Notifications**: System and user notifications.
- **Chat**: Persistent chat sessions and messages for the AI assistant.

### Caching Strategy

To ensure high performance and reduce database load, Vorkspace implements aggressive caching using Redis. The caching layer is primarily managed in `src/lib/redis.ts`.

**Cached Entities:**
- Organization Memberships
- User's Organizations list
- Notifications
- Tickets by Organization

**Cache Management:**
- Each cached entity has an associated TTL (Time-To-Live).
- Cache keys are prefixed by entity type (e.g., `org:`, `notifications:`).
- Dedicated cache invalidation functions (e.g., `invalidateOrgMembershipCache`, `invalidateNotificationsCache`) are called during mutations to keep data fresh.

### AI Integration

Vorkspace features a built-in AI assistant to help users manage their workspaces more effectively. The AI features are currently in active development.

- **Powered By**: Google Gemini (via `@ai-sdk/google`) and Vercel AI SDK.
- **Chat Persistence**: Conversations are saved to the database, allowing users to maintain multiple chat sessions.
- **Context-Aware**: The AI is aware of the currently authenticated user and the active organization context.
- **Tool Calling capabilities**: The assistant can execute backend actions on the user's behalf.
  - **Current Tools**: `inviteMember` - The AI can invite new users to the organization directly from the chat interface.

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL database
- Redis server
- Google Gemini API Key

### Environment Variables

Create a `.env` file based on `.env.example` (if provided) or add the following required variables:

```bash
DATABASE_URL="postgres://user:password@localhost:5432/vorkspace"
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
# Add any required Better Auth environment variables
```

### Installation

1. Install dependencies (Bun is recommended based on project lockfile):

```bash
bun install
```

2. Generate and push the database schema:

```bash
bun run db:generate
bun run db:push
```

3. Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Development Scripts

- `bun run dev`: Starts the Next.js development server.
- `bun run build`: Builds the application for production.
- `bun run start`: Starts the production server.
- `bun run lint`: Runs ESLint to catch issues.
- `bun run db:generate`: Generates Drizzle migration files based on schema changes.
- `bun run db:migrate`: Runs pending migrations against the database.
- `bun run db:push`: Pushes schema changes directly to the database (useful for rapid local development).