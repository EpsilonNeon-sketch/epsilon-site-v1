const SITE_NAME = 'epsilon';
(async function () {
    const { createClient } = supabase;
    const client = createClient('https://gfsqzkyviivhvyqadpeg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmc3F6a3l2aWl2aHZ5cWFkcGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDI0NDQsImV4cCI6MjA4NjAxODQ0NH0.MwC6dMZKFZMyklCJKqr4DPek8dxR-EswBZSd1L_AkMA');
    const { data } = await client.from('blocked_sites').select('site_name').eq('site_name', SITE_NAME).single();
    if (data) {
        window.open("./blocked.html", "_self");
    }
})();
