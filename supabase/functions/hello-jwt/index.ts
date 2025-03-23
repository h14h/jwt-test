import type { Database } from "../../../supabase.types.gen";

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");

  console.log("Token:", token);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(token);

  console.log("User Data:", user);
  if (error) console.error("User Error:", error);

  const { data: upsertResp, error: upsertError } = await supabaseClient
    .from("test")
    .upsert({
      id: 1,
      random_number: Math.ceil(Math.random() * 100),
      updated_at: new Date(),
    })
    .select()
    .single();

  console.log("Upsert Response:", JSON.stringify(upsertResp, null, 2));
  if (upsertError)
    console.error("Upsert Error:", JSON.stringify(upsertError, null, 2));

  if (user === null) {
    return new Response(JSON.stringify(error), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
