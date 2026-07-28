This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.














You are a Senior Full Stack Engineer.

We are building a production-ready application called LifeOS.

Goal:
Build a clean, modern, scalable application, but keep the architecture SIMPLE. This is an MVP that will grow over time.

Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- PostgreSQL
- Prisma
- Better Auth
- React Hook Form
- Zod
- Lucide React
- Vercel

Always use the latest stable versions.

----------------------------------------

Architecture Rules

Keep the project simple.

Do NOT over-engineer.

Do NOT create unnecessary folders.

Use this structure:

src/
│
├── app/
├── components/
├── lib/
├── hooks/
├── types/
├── prisma/
└── middleware.ts

Inside app:

app/
│
├── (dashboard)/
│
├── dashboard/
├── tasks/
├── goals/
├── notes/
├── journal/
├── settings/
│
├── api/
├── login/
└── layout.tsx

Inside components:

components/
│
├── ui/
├── layout/
├── tasks/
├── goals/
├── notes/
├── journal/
└── shared/

Keep shared utilities inside lib/.

Use Server Actions whenever appropriate.

Do not create repository or service folders unless they become necessary later.

----------------------------------------

Coding Rules

- Use TypeScript everywhere.
- Use strict typing.
- Keep components small.
- Reuse components.
- Avoid duplicated code.
- Follow Next.js best practices.
- Use Server Components by default.
- Use Client Components only when required.
- Explain every important decision.

----------------------------------------

Development Process

Build ONE sprint at a time.

Do NOT continue to the next sprint.

Wait for my approval.

----------------------------------------

Sprint 0

Create the project.

- Next.js 16
- TypeScript
- Tailwind
- ESLint
- Folder structure
- Environment variables
- Git setup

Do not install any extra libraries yet.

Stop.

----------------------------------------

Sprint 1

Install

- shadcn/ui
- Lucide React

Create

- App layout
- Sidebar
- Header
- Theme
- Global styles

Stop.

----------------------------------------

Sprint 2

Install

- Prisma
- PostgreSQL

Create models

- User
- Task
- Goal
- Note
- JournalEntry

Run migration.

Stop.

----------------------------------------

Sprint 3

Install Better Auth.

Implement

- Login
- Register
- Logout
- Protected routes

Stop.

----------------------------------------

Sprint 4

Build Tasks.

Features

- Create
- Edit
- Delete
- Complete
- Due date
- Priority

Stop.

----------------------------------------

Sprint 5

Build Goals.

Stop.

----------------------------------------

Sprint 6

Build Notes.

Stop.

----------------------------------------

Sprint 7

Build Journal.

Stop.

----------------------------------------

Sprint 8

Build Dashboard.

Show

- Today's Tasks
- Goals
- Notes
- Journal

Stop.

----------------------------------------

Sprint 9

Build Settings.

Stop.

----------------------------------------

Sprint 10

Deploy to Vercel.

Verify production build.

Stop.