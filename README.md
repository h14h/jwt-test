# Supabase Auth in an Edge Function Example

This repo contains an example of using Supabase Auth in an Edge Function.

> [!NOTE]
> I used bun when setting up this project, so that's what I'll be using in the
> below examples. Feel free to open up a PR to add other package managers 🙂

## Setup

1. Go to [database.new](https://database.new) and create a new Supabase project

2. Clone the project somewhere:

```bash
cd /path/to/somewhere
git clone https://github.com/h14h/jwt-test.git
```

3. Copy `.env.example` to `.env` and replace the values with your [Project URL and
public API (anon) key](https://supabase.com/dashboard/project/_/settings/api)

4. Navigate to the project directory and install dependencies:

```bash
cd jwt-test
bun install
```

5. Deploy the hello-jwt function:

```bash
bun supabase functions deploy hello-jwt --project-ref <your_supabase_project_id>
```

You should now be ready to start the project and test out the edge function!

## Usage

1. Start the project:

```bash
bun run dev
```

2. Navigate to the running project on localhost in your browser

3. Sign up for an account and verify your email address

4. Click the "Trigger JWT Test Function" button

From here, you should see the hello-jwt function's response in the browser!

You can now navigate to the logs for the edge function in you Supabase
dashboard, where you should see logs that look something like this:

```
LOG: Token: <your_supabase_project_anon_key>
LOG: User Data: {
       id: "<your_user_id>",
       aud: "authenticated",
       role: "authenticated",
       email: "your_email@example.com",
       email_confirmed_at: "2025-03-13T19:34:07.356485Z",
       phone: "",
       confirmation_sent_at: "2025-03-13T19:33:51.295158Z",
       confirmed_at: "2025-03-13T19:34:07.356485Z",
       last_sign_in_at: "2025-03-13T19:37:42.204178Z",
       app_metadata: { provider: "email", providers: [ "email" ] },
       user_metadata: {...},
       identities: [...],
       created_at: "2025-03-13T19:33:51.257154Z",
       updated_at: "2025-03-13T19:37:42.208412Z",
       is_anonymous: false
     }
LOG: User Error: null
```
