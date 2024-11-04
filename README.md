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


## About this project

I'm creating a social media application (modeled after instagram) with authenticated (password protected) users, image posts, post comments, post likes, comment likes, followers and following behaviors, and user profiles with pfp and basic personal info.

I'll use NextJS to do the front-end, and then connect to a remote-hosted Supabase backend (which I'll use for my database and user authentication). 

Pages are protected by user (only a user can access their own resources), and API requests to the DB are also protected by RLS (Row Level Security) Policies.

The end result will be containerized using Docker and deployed via Fly.io.


## Goals

The Primary goal of this project is to gain experience with full-stack development, which emphasis on leveraging modern tech stacks for fast-paced development. Supabase (along with similar services, such as Google's Firebase or Pocketbase) does a lot of the backend configuration behind the scenes, allowing me as a developoer to integrate a backend into my project relatively quickly. This has allowed me to spend more time improving security practices and making the project more robust as a whole.
