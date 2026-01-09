
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import { AppLayout } from "@/components/app-layout";

async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("instruments").select();

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
}

export default function SettingsPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div>Loading instruments...</div>}>
         <InstrumentsData />
      </Suspense>
    </AppLayout>
  );
}
