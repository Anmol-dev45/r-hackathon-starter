import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <Suspense fallback={<div>Loading instruments...</div>}>
        <Reports />
      </Suspense>
    </main>
  );
}


async function Reports() {
  const supabase = createClient()
  const { data: reports, error } = await supabase.from("reports").select()
  if (error) {
    return (
      <p>
        Error
      </p>
    )
  }
  return (
    <div>
      {reports && reports?.map((report) => (<p key={report.id}>{report.title}</p>))}
    </div>
  )
}