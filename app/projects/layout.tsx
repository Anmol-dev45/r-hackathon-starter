'use client';

import { useEffect } from 'react';

function HideNavbar() {
    useEffect(() => {
        // Hide the root navbar when project page is mounted
        const navbar = document.getElementById('main-navbar');
        if (navbar) {
            (navbar as HTMLElement).style.display = 'none';
        }

        // Show it again when unmounted
        return () => {
            const navbar = document.getElementById('main-navbar');
            if (navbar) {
                (navbar as HTMLElement).style.display = '';
            }
        };
    }, []);

    return null;
}

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <HideNavbar />
            {children}
        </>
    );
}