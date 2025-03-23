import { useEffect, useState } from "react";
import "./App.css";

import { createClient, type Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import type { Database } from "../supabase.types.gen";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
);

// TODO: Listen to realtime writes from test table
function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    const testChannel = supabase
      .channel("table-test-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        (payload) =>
          console.log("Table test payload:", JSON.stringify(payload, null, 2)),
      )
      .subscribe();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      supabase.removeChannel(testChannel);
      subscription.unsubscribe();
    };
  }, []);

  async function triggerJwtTest() {
    setTestResult("Triggering JWT Test Function...");
    const { data, error } = await supabase.functions.invoke("hello-jwt");

    if (error) {
      setTestResult(JSON.stringify(error, null, 2));
    } else {
      setTestResult(JSON.stringify(data, null, 2));
    }
  }

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  }

  return (
    <>
      <h1>JWT Test</h1>
      <div className="card">
        <button type="button" onClick={triggerJwtTest}>
          Trigger JWT Test Function
        </button>
        <div style={{ textAlign: "left", marginTop: "4rem" }}>
          <b>JWT Test Result:</b>
          <div
            style={{
              border: "1px solid gray",
              backgroundColor: "#eee",
              padding: "1rem",
              marginTop: "0.5rem",
              minWidth: "640px",
              borderRadius: "0.25rem",
            }}
          >
            <code style={{ whiteSpace: "pre-wrap" }}>
              {testResult || "Trigger JWT Test Function to See Result"}
            </code>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
