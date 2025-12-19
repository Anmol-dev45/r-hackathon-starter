import { Suspense } from "react";
import { DashboardAuthCheck } from "./auth-check";
import { HideNavbar } from "./hide-navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <HideNavbar />
            <div className="fixed inset-0 bg-white overflow-auto">
                <Suspense fallback={<DashboardLoadingFallback />}>
                    <DashboardAuthCheck>{children}</DashboardAuthCheck>
                </Suspense>
            </div>
        </>
    );
}

function DashboardLoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
            <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#4366d0] mx-auto"></div>
                <p className="text-gray-600">Loading dashboard...</p>
            </div>
        </div>
    );
}
