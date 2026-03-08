// Epsilon API - Public Account Data Access
// Base URL: https://epsilon-site-v1.vercel.app

const SUPABASE_URL = 'https://gfsqzkyviivhvyqadpeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmc3F6a3l2aWl2aHZ5cWFkcGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDI0NDQsImV4cCI6MjA4NjAxODQ0NH0.MwC6dMZKFZMyklCJKqr4DPek8dxR-EswBZSd1L_AkMA';

class EpsilonAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // Validate API key and update usage
    async validateKey() {
        const { data, error } = await this.supabase
            .from('api_keys')
            .select('*')
            .eq('api_key', this.apiKey)
            .eq('is_active', true)
            .single();

        if (error || !data) {
            throw new Error('Invalid or inactive API key');
        }

        if (data.calls_made >= data.calls_limit) {
            throw new Error('API key rate limit exceeded');
        }

        // Update call count and last used
        await this.supabase
            .from('api_keys')
            .update({
                calls_made: data.calls_made + 1,
                last_used_at: new Date().toISOString()
            })
            .eq('id', data.id);

        return data;
    }

    // Get user by username
    async getUserByUsername(username) {
        await this.validateKey();

        const { data, error } = await this.supabase
            .from('profiles')
            .select('id, username, display_name, bio, location, website, profile_pic, created_at, followers, following')
            .eq('username', username)
            .single();

        if (error) {
            throw new Error('User not found');
        }

        // Get post count
        const { count } = await this.supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', data.id);

        return {
            success: true,
            data: {
                username: data.username,
                display_name: data.display_name,
                bio: data.bio,
                location: data.location,
                website: data.website,
                profile_pic: data.profile_pic,
                followers_count: (data.followers || []).length,
                following_count: (data.following || []).length,
                posts_count: count || 0,
                joined_at: data.created_at
            }
        };
    }

    // Get user posts
    async getUserPosts(username, limit = 10) {
        await this.validateKey();

        // First get user ID
        const { data: user } = await this.supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single();

        if (!user) {
            throw new Error('User not found');
        }

        const { data, error } = await this.supabase
            .from('posts')
            .select('id, title, category, content, likes, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw new Error('Error fetching posts');
        }

        return {
            success: true,
            data: data
        };
    }

    // Get all users (paginated)
    async getAllUsers(page = 1, limit = 20) {
        await this.validateKey();

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await this.supabase
            .from('profiles')
            .select('username, display_name, bio, profile_pic, followers, following, created_at', { count: 'exact' })
            .range(from, to)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error('Error fetching users');
        }

        return {
            success: true,
            data: data.map(user => ({
                username: user.username,
                display_name: user.display_name,
                bio: user.bio,
                profile_pic: user.profile_pic,
                followers_count: (user.followers || []).length,
                following_count: (user.following || []).length,
                joined_at: user.created_at
            })),
            pagination: {
                page,
                limit,
                total: count
            }
        };
    }

    // Get user followers
    async getUserFollowers(username) {
        await this.validateKey();

        const { data: user } = await this.supabase
            .from('profiles')
            .select('id, followers')
            .eq('username', username)
            .single();

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.followers || user.followers.length === 0) {
            return { success: true, data: [] };
        }

        const { data: followers } = await this.supabase
            .from('profiles')
            .select('username, display_name, profile_pic')
            .in('id', user.followers);

        return {
            success: true,
            data: followers
        };
    }

    // Get user following
    async getUserFollowing(username) {
        await this.validateKey();

        const { data: user } = await this.supabase
            .from('profiles')
            .select('id, following')
            .eq('username', username)
            .single();

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.following || user.following.length === 0) {
            return { success: true, data: [] };
        }

        const { data: following } = await this.supabase
            .from('profiles')
            .select('username, display_name, profile_pic')
            .in('id', user.following);

        return {
            success: true,
            data: following
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EpsilonAPI;
}
// Auto-load Supabase CDN for Epsilon Ecosystem
if (typeof supabase === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = false; // Ensure it loads in order
    document.head.appendChild(script);
}
