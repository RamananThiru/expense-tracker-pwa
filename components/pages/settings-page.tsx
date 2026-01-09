"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function SettingsPage() {
  const [categories, setCategories] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  if (!categories) {
    return <div>Loading categories...</div>;
  }

  return <pre>{JSON.stringify(categories, null, 2)}</pre>;
}