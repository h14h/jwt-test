import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");

  console.log("Token:", token);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(token);

  console.log("User Data:", user);
  console.log("User Error:", error);

  if (user === null) {
    return new Response(JSON.stringify(error), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
