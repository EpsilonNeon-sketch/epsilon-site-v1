window.siteLink = "https://epsilonhub.vercel.app";

const SITE_NAME = 'epsilon';
const SUPABASE_URL = 'https://gfsqzkyviivhvyqadpeg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmc3F6a3l2aWl2aHZ5cWFkcGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDI0NDQsImV4cCI6MjA4NjAxODQ0NH0.MwC6dMZKFZMyklCJKqr4DPek8dxR-EswBZSd1L_AkMA';

async function checkEpsilonSecurity() {
    // Wait for Supabase CDN
    if (typeof supabase === 'undefined') {
        console.warn("Epsilon: Waiting for Supabase...");
        setTimeout(checkEpsilonSecurity, 500);
        return;
    }

    try {
        // Create a fresh client every check to avoid stale sessions
        const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        // Detect if we are on the blocked page
        const isOnBlockedPage = window.location.pathname.includes('blocked.html');

        // Simple query: Does the site exist in the blocked table?
        const { data, error } = await client
            .from('blocked_sites')
            .select('site_name')
            .eq('site_name', SITE_NAME);

        if (error) {
            console.error("Epsilon DB Error:", error.message);
        } else if (data && data.length > 0) {
            // --- STATUS: BLOCKED ---
            console.log("Epsilon Security: [LOCKED]");
            if (!isOnBlockedPage) {
                window.location.replace("./blocked.html");
            }
        } else {
            // --- STATUS: UNBLOCKED ---
            console.log("Epsilon Security: [ACTIVE]");
            if (isOnBlockedPage) {
                // Use window.siteLink specifically
                window.location.replace(window.siteLink);
            }
        }
    } catch (err) {
        console.error("Epsilon Critical Error:", err);
    }

    // Schedule next check in 5 seconds
    setTimeout(checkEpsilonSecurity, 5000);
}

// Start the security engine
checkEpsilonSecurity();
