'use client';

import { useEffect } from 'react';

export function HideNavbar() {
    useEffect(() => {
        // Hide the root navbar when dashboard is mounted
        const navbar = document.querySelector('body > div > nav');
        if (navbar) {
            (navbar as HTMLElement).style.display = 'none';
        }

        // Show it again when unmounted
        return () => {
            const navbar = document.querySelector('body > div > nav');
            if (navbar) {
                (navbar as HTMLElement).style.display = '';
            }
        };
    }, []);

    return null;
}
