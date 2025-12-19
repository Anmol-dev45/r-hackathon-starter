"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "lucide-react";

interface UserData {
  email: string;
  name?: string;
  created_at?: string;
}

export function ProfileDropdown() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          email: authUser.email || "",
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0],
          created_at: authUser.created_at,
        });
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const getMemberSince = () => {
    if (!user?.created_at) return "";
    const date = new Date(user.created_at);
    return date.getFullYear();
  };

  if (loading) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full p-0 w-10 h-10">
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
      </Button>
    );
  }

  const userInitial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0 w-10 h-10">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {userInitial}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 text-sm truncate">
              {user?.name || "User"}
            </div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
            {getMemberSince() && (
              <div className="text-xs text-gray-400">Member since {getMemberSince()}</div>
            )}
          </div>
        </div>
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          My Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
