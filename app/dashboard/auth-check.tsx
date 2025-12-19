import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function DashboardAuthCheck({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login?redirect=/dashboard");
    }

    return <>{children}</>;
}
