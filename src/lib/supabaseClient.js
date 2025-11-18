import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://vegoifnbsuuwackfcxfw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ29pZm5ic3V1d2Fja2ZjeGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjQ1ODEsImV4cCI6MjA3OTA0MDU4MX0.FPTxDfPfRrcvjcLNECs8TcwLEWAhlPBf-Z-5MLDmn-k"
);
