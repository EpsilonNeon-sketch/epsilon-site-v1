const SITE_NAME = 'epsilon';

async function checkEpsilonSecurity() {
    // Ensuring the global 'supabase' object exists
    if (typeof supabase === 'undefined') {
        console.error("Epsilon Error: Supabase object not found on window.");
        return;
    }

    const client = supabase.createClient(
        'https://gfsqzkyviivhvyqadpeg.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmc3F6a3l2aWl2aHZ5cWFkcGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDI0NDQsImV4cCI6MjA4NjAxODQ0NH0.MwC6dMZKFZMyklCJKqr4DPek8dxR-EswBZSd1L_AkMA'
    );

    try {
        // .maybeSingle() returns null instead of throwing an error if row is missing
        const { data, error } = await client
            .from('blocked_sites')
            .select('site_name')
            .eq('site_name', SITE_NAME)
            .maybeSingle();

        if (error) {
            console.error("Supabase Query Error:", error.message);
            return;
        }

        if (data) {
            console.warn(`[Epsilon Security] ${SITE_NAME} is blocked. Redirecting...`);
            // .replace is better than .href because it wipes the blocked page from history
            window.location.replace("./blocked.html");
        }
    } catch (err) {
        console.error("Epsilon Service Critical Failure:", err);
    }
}

// Run as soon as the DOM is ready to prevent race conditions
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkEpsilonSecurity);
} else {
    checkEpsilonSecurity();
}
