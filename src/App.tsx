import { useState } from "react";
import "./App.css";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
);

interface Instrument {
  id: number;
  name: string;
}

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  async function getInstruments() {
    console.log("Getting instruments...");

    const { data } = await supabase.from("instruments").select("*");
    const instruments = data as Instrument[];

    setInstruments(instruments);
  }

  return (
    <>
      <h1>Supabase Demo</h1>
      <div className="card">
        <button type="button" onClick={getInstruments}>
          Get Instruments
        </button>
        <h3>Instrument List</h3>
        <div>
          {instruments.map((instrument) => (
            <p key={instrument.id}>{instrument.name}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
