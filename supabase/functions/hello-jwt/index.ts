// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  console.log("Supabase URL exists?", supabaseUrl !== "");
  console.log("Supabase Anon Key exists?", supabaseAnonKey !== "");

  // Get the session or user object
  const authHeader = req.headers.get("Authorization")!;

  console.log("Auth Header:", authHeader);

  const token = authHeader.replace("Bearer ", "");

  console.log("Token:", token);

  const { data, error } = await supabaseClient.auth.getUser(token);

  console.log("User Data:", data);
  console.log("User Error:", error);

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke remotely:

  1. Deploy the function with `bun supabase functions deploy hello-jwt --project-ref <supabase_project_ref>`
  2. Make an HTTP request:

  curl -i --location --request POST 'https://<supabase_project_ref>.supabase.co/functions/v1/hello-jwt' \
      --header 'Authorization: Bearer <supabase_anon_key> \
      --header 'Content-Type: application/json' \
      --data '{"name":"Functions"}'

*/
