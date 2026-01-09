
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import { AppLayout } from "@/components/app-layout";

async function CategoriesData() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase.from("categories").select();

  if (error) {
    return <pre className="text-red-500">Error: {JSON.stringify(error, null, 2)}</pre>;
  }

  return <pre>{JSON.stringify(categories, null, 2)}</pre>;
}

export default function SettingsPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div>Loading categories...</div>}>
         <CategoriesData />
      </Suspense>
    </AppLayout>
  );
}
