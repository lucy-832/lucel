/* =========================================================
   LUCELLE DIGITAL — BLOG DATA LAYER (BlogAPI)
   =========================================================
   THIS FILE IS THE ONLY PLACE THE FRONTEND TALKS TO "THE
   BACKEND". Every blog page (listing + single article) calls
   the functions below and never touches raw data directly.

   Right now every function reads from the in-memory SEED_POSTS
   array below, standing in for posts that will eventually be
   created/edited/published/deleted from the Admin Dashboard.

   TO CONNECT A REAL BACKEND LATER:
   Replace the body of each exported function with a `fetch()`
   call to your API (e.g. GET /api/posts, GET /api/posts/:slug,
   POST /api/newsletter). Keep the function names, parameters,
   and the shape of the resolved data IDENTICAL — blog.js and
   blog-post.js only care about that contract, so the rest of
   the frontend needs zero changes.

   POST SCHEMA (what the Admin Dashboard should produce):
   {
     id: string,
     slug: string,               // used in the URL, editable "SEO slug"
     title: string,
     excerpt: string,            // short summary for cards
     content: string,            // rich HTML from the dashboard's editor
     featuredImage: { src, alt },
     images: [{ src, alt, caption }],   // extra in-article images
     category: string,
     tags: string[],
     author: { name, role, avatar },
     publishDate: string (ISO),
     updatedDate: string (ISO)|null,
     readingTime: number (minutes),
     status: 'draft' | 'scheduled' | 'published',
     scheduledDate: string (ISO)|null,
     featured: boolean,
     seo: { title, metaDescription }
   }
   ========================================================= */

(() => {
  'use strict';

  /* ---------------------------------------------------------
     SEED DATA — stand-in for the database.
     Replace/remove once a real API is connected.
     --------------------------------------------------------- */
  const SEED_POSTS = [
    {
      id: 'p1',
      slug: 'signs-you-need-a-virtual-assistant',
      title: '7 Signs Your Business Is Ready for a Virtual Assistant',
      excerpt: 'If your to-do list keeps growing faster than your hours in the day, here are the clearest signals that it\u2019s time to bring in support.',
      featuredImage: { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop', alt: 'Entrepreneur working at a desk with a laptop and planner' },
      images: [
        { src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1400&auto=format&fit=crop', alt: 'Calendar and notebook on a desk', caption: 'A clear calendar is one of the first wins clients notice.' }
      ],
      category: 'Virtual Assistance',
      tags: ['productivity', 'delegation', 'small business'],
      author: { name: 'Lucelle Digital', role: 'Founder', avatar: 'images/luce.jpg' },
      publishDate: '2026-06-02T09:00:00Z',
      updatedDate: null,
      readingTime: 5,
      status: 'published',
      scheduledDate: null,
      featured: true,
      seo: { title: '7 Signs Your Business Needs a Virtual Assistant', metaDescription: 'Learn the clearest signs it\u2019s time to delegate to a virtual assistant and get hours of your week back.' },
      content: `
        <p>Most business owners don't wake up one day and decide to hire support \u2014 it happens gradually, one missed follow-up and one too-late invoice at a time. If any of the signs below feel familiar, it's worth taking seriously.</p>
        <h2>1. You're answering emails at 11pm</h2>
        <p>Late-night inbox sessions are usually the first symptom of a workload that has outgrown your calendar. A virtual assistant can triage, draft, and clear routine messages so your inbox is manageable by the time you log off.</p>
        <h2>2. Admin work is eating into client-facing time</h2>
        <p>Scheduling, data entry, and file organization are essential \u2014 but they rarely require you specifically. Handing them off frees up your best hours for the work only you can do.</p>
        <blockquote>"The moment I stopped doing my own scheduling, I got back almost six hours a week \u2014 and my calendar stopped double-booking itself."</blockquote>
        <h2>3. You're saying no to growth opportunities</h2>
        <p>If a new client or project sounds exciting but exhausting to even think about, that's a capacity problem, not a desire problem.</p>
        <h2>4. Your systems live only in your head</h2>
        <p>When only you know how something works, the business can't scale past you. Delegation forces documentation, which makes everything more resilient.</p>
        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1400&auto=format&fit=crop" alt="Person organizing sticky notes into a workflow" loading="lazy">
        <h2>5. Follow-ups are slipping through the cracks</h2>
        <p>Every missed follow-up is a small leak in your pipeline. A dedicated assistant catches these before they become lost revenue.</p>
        <h2>6. You dread your own calendar</h2>
        <p>If opening your calendar app causes a small wave of dread, that's worth listening to.</p>
        <h2>7. You've thought about it more than once</h2>
        <p>If you're reading this because the idea has crossed your mind before, that repetition is usually a signal on its own.</p>
        <h2>Starting small works</h2>
        <p>You don't need to hand over your whole business on day one. Most clients start with a handful of hours a week on the tasks that drain them most, then expand once the rhythm feels right.</p>
      `
    },
    {
      id: 'p2',
      slug: 'social-media-content-calendar-that-works',
      title: 'How to Build a Social Media Content Calendar That Actually Works',
      excerpt: 'A content calendar only helps if you\u2019ll actually use it. Here\u2019s a simple framework that keeps posting consistent without feeling like a second job.',
      featuredImage: { src: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1600&auto=format&fit=crop', alt: 'Phone showing a social media feed next to a planning notebook' },
      images: [
        { src: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1400&auto=format&fit=crop', alt: 'Content calendar spread on a desk' }
      ],
      category: 'Social Media Management',
      tags: ['content strategy', 'social media', 'planning'],
      author: { name: 'Lucelle Digital', role: 'Founder', avatar: 'images/luce.jpg' },
      publishDate: '2026-06-15T09:00:00Z',
      updatedDate: null,
      readingTime: 6,
      status: 'published',
      scheduledDate: null,
      featured: false,
      seo: { title: 'Build a Social Media Content Calendar That Works', metaDescription: 'A simple, repeatable framework for planning social content without burning out.' },
      content: `
        <p>Most content calendars fail for the same reason diets do: they're too ambitious on day one. Here's a version built to survive week four.</p>
        <h2>Start with pillars, not a posting schedule</h2>
        <p>Before you decide how often to post, decide what you'll talk about. Three to five content pillars \u2014 recurring themes tied to your business \u2014 make every future post easier to plan.</p>
        <h2>Batch, don't improvise</h2>
        <p>Set aside one block of time to write captions and select images for the whole week or month. Batching removes the daily decision fatigue that quietly kills consistency.</p>
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop" alt="Person batching content on a laptop" loading="lazy">
        <h2>Leave room for real-time posts</h2>
        <p>A calendar that's 100% planned in advance leaves no space for timely, in-the-moment content \u2014 which often performs best. Plan roughly 80% and leave the rest open.</p>
        <h2>Review performance monthly, not daily</h2>
        <p>Checking analytics every day leads to overreacting to noise. A monthly review shows real patterns worth acting on.</p>
        <p>The best content calendar is the one you'll still be using in three months \u2014 simple, realistic, and built around how your business actually runs.</p>
      `
    },
    {
      id: 'p3',
      slug: 'email-inbox-zero-system',
      title: 'The Inbox Zero System That Actually Sticks',
      excerpt: 'Inbox zero isn\u2019t about deleting everything \u2014 it\u2019s about having a system so your inbox never controls your day again.',
      featuredImage: { src: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1600&auto=format&fit=crop', alt: 'Laptop showing an organized email inbox' },
      images: [],
      category: 'Administrative Support',
      tags: ['email management', 'productivity', 'organization'],
      author: { name: 'Lucelle Digital', role: 'Founder', avatar: 'images/luce.jpg' },
      publishDate: '2026-06-24T09:00:00Z',
      updatedDate: '2026-06-26T10:00:00Z',
      readingTime: 4,
      status: 'published',
      scheduledDate: null,
      featured: false,
      seo: { title: 'The Inbox Zero System That Actually Sticks', metaDescription: 'A practical, repeatable system for keeping your email inbox under control long-term.' },
      content: `
        <p>Inbox zero has a reputation for being extreme \u2014 in reality, it's just a sorting system, not a personality trait.</p>
        <h2>Four folders, not forty</h2>
        <p>Action Needed, Waiting On, Reference, and Archive cover almost everything. Anything that isn't trash or spam goes into one of these within seconds of being read.</p>
        <h2>Touch it once</h2>
        <p>Every time you open an email without deciding what to do with it, you pay the "reading tax" again later. Decide on first read: reply, delegate, file, or delete.</p>
        <h2>Two dedicated inbox blocks a day</h2>
        <p>Checking email continuously feels productive but fragments focus. Two or three set windows a day is usually enough for anyone outside of live customer support.</p>
        <p>None of this requires new software \u2014 just a decision rule you apply consistently, which is exactly the kind of task that hands off well to a virtual assistant.</p>
      `
    },
    {
      id: 'p4',
      slug: 'branding-basics-for-service-businesses',
      title: 'Branding Basics Every Service-Based Business Should Get Right',
      excerpt: 'You don\u2019t need a full rebrand to look more professional online \u2014 these five fundamentals go a long way.',
      featuredImage: { src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1600&auto=format&fit=crop', alt: 'Brand moodboard with color swatches and typography samples' },
      images: [
        { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1400&auto=format&fit=crop', alt: 'Logo and color palette design sheet' }
      ],
      category: 'Branding',
      tags: ['branding', 'design', 'small business'],
      author: { name: 'Lucelle Digital', role: 'Founder', avatar: 'images/luce.jpg' },
      publishDate: '2026-07-05T09:00:00Z',
      updatedDate: null,
      readingTime: 5,
      status: 'published',
      scheduledDate: null,
      featured: false,
      seo: { title: 'Branding Basics for Service-Based Businesses', metaDescription: 'Five branding fundamentals that make a service business look more established online.' },
      content: `
        <p>Branding is often treated as a luxury for later \u2014 but for service businesses, it's usually the first thing a prospective client evaluates, consciously or not.</p>
        <h2>1. One consistent color palette</h2>
        <p>Two to four colors, used the same way everywhere \u2014 website, social, invoices \u2014 read as intentional, even on a small budget.</p>
        <h2>2. A logo that works small</h2>
        <p>If your logo is unreadable as a tiny profile picture, it's working against you on every platform that matters.</p>
        <h2>3. A consistent voice</h2>
        <p>Formal in emails and casual on social media sends mixed signals. Pick a tone and hold it across channels.</p>
        <h2>4. Real photos over stock</h2>
        <p>Even simple, well-lit photos of you or your team build more trust than generic stock imagery.</p>
        <h2>5. Templates for repeat materials</h2>
        <p>Proposals, invoices, and social posts should come from a template, not be rebuilt from scratch every time.</p>
        <p>None of this requires a rebrand \u2014 just consistency applied to what you already have.</p>
      `
    },
    {
      id: 'p5',
      slug: 'time-blocking-for-founders',
      title: 'Time Blocking for Founders Who Hate Rigid Schedules',
      excerpt: 'A flexible take on time blocking that protects your focus without turning your calendar into a prison.',
      featuredImage: { src: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1600&auto=format&fit=crop', alt: 'Weekly planner with time blocks written in' },
      images: [],
      category: 'Virtual Assistance',
      tags: ['productivity', 'time management', 'founders'],
      author: { name: 'Lucelle Digital', role: 'Founder', avatar: 'images/luce.jpg' },
      publishDate: '2026-07-18T09:00:00Z',
      updatedDate: null,
      readingTime: 4,
      status: 'published',
      scheduledDate: null,
      featured: false,
      seo: { title: 'Time Blocking for Founders Who Hate Rigid Schedules', metaDescription: 'A flexible time-blocking method built for founders whose days rarely go as planned.' },
      content: `
        <p>Classic time blocking assumes your day is predictable. For most founders, it isn't \u2014 which is why rigid systems usually fall apart by Tuesday.</p>
        <h2>Block themes, not minutes</h2>
        <p>Instead of "9:14\u20139:52am: reply to emails," try "Morning: deep work" and "Afternoon: calls and admin." Fewer, larger blocks survive real-world interruptions.</p>
        <h2>Protect one non-negotiable block</h2>
        <p>Pick a single daily block \u2014 often the first two hours \u2014 that nothing is allowed to touch. Everything else can flex around it.</p>
        <h2>Build in a buffer</h2>
        <p>Leaving 20% of your day unscheduled isn't wasted time; it's what keeps the rest of the schedule from collapsing when something runs long.</p>
        <p>The goal isn't a perfect calendar \u2014 it's a calendar that still works after the first surprise of the day.</p>
      `
    },
    {
      id: 'p6',
      slug: 'growing-engagement-without-going-viral',
      title: 'Growing Real Engagement Without Chasing Virality',
      excerpt: 'You don\u2019t need a viral post to grow \u2014 you need consistent, relevant content that the right people actually want to see.',
      featuredImage: { src: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1600&auto=format&fit=crop', alt: 'Person checking social media analytics on a phone' },
      images: [
        { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop', alt: 'Analytics dashboard showing engagement growth' }
      ],
      category: 'Social Media Management',
      tags: ['social media', 'engagement', 'growth'],
      author: { name: 'Lucelle Digital', role: 'Founder', avatar: 'images/luce.jpg' },
      publishDate: '2026-07-28T09:00:00Z',
      updatedDate: null,
      readingTime: 5,
      status: 'published',
      scheduledDate: null,
      featured: false,
      seo: { title: 'Growing Real Engagement Without Chasing Virality', metaDescription: 'Why consistent, relevant content outperforms chasing viral moments for long-term growth.' },
      content: `
        <p>Viral posts feel like the goal, but they rarely build a business \u2014 most viral traffic doesn't convert, and it doesn't repeat.</p>
        <h2>Relevance beats reach</h2>
        <p>A post seen by 500 of the right people usually outperforms one seen by 50,000 of the wrong ones. Engagement quality matters more than raw numbers.</p>
        <h2>Reply like you mean it</h2>
        <p>Every genuine reply to a comment tells the algorithm \u2014 and the person \u2014 that there's someone real behind the account. It's one of the highest-leverage five minutes in social media.</p>
        <h2>Repurpose your best-performing content</h2>
        <p>If a post worked once, it will likely work again in a new format three months later. Track what performs and reuse it deliberately.</p>
        <h2>Consistency compounds</h2>
        <p>Growth from steady, relevant posting looks unremarkable week to week and undeniable over six months.</p>
      `
    },
    {
      id: 'p7',
      slug: 'preparing-a-launch-checklist',
      title: 'The Pre-Launch Checklist We Use With Every New Client',
      excerpt: 'A behind-the-scenes look at the checklist that keeps product and service launches from falling apart in the last 48 hours.',
      featuredImage: { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop', alt: 'Team reviewing a launch checklist on a whiteboard' },
      images: [],
      category: 'Digital Marketing',
      tags: ['launches', 'planning', 'marketing'],
      author: { name: 'Lucelle Digital', role: 'Founder', avatar: 'images/luce.jpg' },
      publishDate: '2026-08-12T09:00:00Z',
      updatedDate: null,
      readingTime: 6,
      status: 'scheduled',
      scheduledDate: '2026-08-12T09:00:00Z',
      featured: false,
      seo: { title: 'The Pre-Launch Checklist for Product and Service Launches', metaDescription: 'The exact checklist used to keep client launches on track in the final 48 hours.' },
      content: `
        <p>This post is scheduled and will publish automatically \u2014 demonstrating how the Admin Dashboard's "Schedule" feature controls visibility without any code changes.</p>
      `
    }
  ];

  const NEWSLETTER_STORAGE_KEY = 'lucelle-newsletter-subscribers';

  /* ---------------------------------------------------------
     Internal helpers
     --------------------------------------------------------- */
  const clone = (data) => JSON.parse(JSON.stringify(data));

  // Simulates real network latency so loading states can be tested/shown.
  const resolveLater = (value, ms = 250) => new Promise((resolve) => setTimeout(() => resolve(clone(value)), ms));

  const isVisible = (post) => {
    if (post.status !== 'published') {
      // A 'scheduled' post becomes visible automatically once its
      // scheduledDate has passed — no code change needed at publish time.
      if (post.status === 'scheduled' && post.scheduledDate && new Date(post.scheduledDate) <= new Date()) {
        return true;
      }
      return false;
    }
    return true;
  };

  const getPublishedPosts = () => SEED_POSTS
    .filter(isVisible)
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

  const slugify = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');

  /* ---------------------------------------------------------
     Public API
     --------------------------------------------------------- */
  const BlogAPI = {
    /**
     * Paginated, filterable list of posts for the blog listing page.
     * @param {{page?:number, perPage?:number, category?:string, tag?:string, search?:string}} opts
     */
    async getPosts({ page = 1, perPage = 6, category = 'all', tag = null, search = '' } = {}) {
      let posts = getPublishedPosts();

      if (category && category !== 'all') {
        posts = posts.filter(p => slugify(p.category) === slugify(category));
      }
      if (tag) {
        posts = posts.filter(p => p.tags.some(t => slugify(t) === slugify(tag)));
      }
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        posts = posts.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        );
      }

      const total = posts.length;
      const totalPages = Math.max(1, Math.ceil(total / perPage));
      const safePage = Math.min(Math.max(1, page), totalPages);
      const start = (safePage - 1) * perPage;
      const paged = posts.slice(start, start + perPage);

      return resolveLater({ posts: paged, total, totalPages, page: safePage });
    },

    /** The post to headline the listing page (flagged `featured`, else most recent). */
    async getFeaturedPost() {
      const posts = getPublishedPosts();
      const featured = posts.find(p => p.featured) || posts[0] || null;
      return resolveLater(featured);
    },

    /** Full article by its SEO slug. */
    async getPostBySlug(slug) {
      const post = getPublishedPosts().find(p => p.slug === slug) || null;
      return resolveLater(post);
    },

    /** Distinct categories with post counts, derived from live data (never hardcoded). */
    async getCategories() {
      const posts = getPublishedPosts();
      const counts = {};
      posts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
      const categories = Object.keys(counts).map(name => ({ name, count: counts[name] }));
      return resolveLater(categories);
    },

    /** Distinct tags with post counts, derived from live data. */
    async getTags() {
      const posts = getPublishedPosts();
      const counts = {};
      posts.forEach(p => p.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
      const tags = Object.keys(counts).map(name => ({ name, count: counts[name] }));
      return resolveLater(tags);
    },

    /** Posts related to the given post by shared category/tags. */
    async getRelatedPosts(post, limit = 3) {
      if (!post) return resolveLater([]);
      const posts = getPublishedPosts().filter(p => p.slug !== post.slug);
      const scored = posts.map(p => {
        let score = 0;
        if (p.category === post.category) score += 2;
        score += p.tags.filter(t => post.tags.includes(t)).length;
        return { p, score };
      });
      scored.sort((a, b) => b.score - a.score);
      const related = scored.filter(s => s.score > 0).slice(0, limit).map(s => s.p);
      // Backfill with recent posts if not enough overlap
      if (related.length < limit) {
        posts.forEach(p => {
          if (related.length < limit && !related.find(r => r.slug === p.slug)) related.push(p);
        });
      }
      return resolveLater(related.slice(0, limit));
    },

    /** Chronological previous/next article relative to the given post. */
    async getAdjacentPosts(post) {
      const posts = getPublishedPosts();
      const idx = posts.findIndex(p => p.slug === post.slug);
      const prev = idx > 0 ? posts[idx - 1] : null;
      const next = idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;
      return resolveLater({ prev, next });
    },

    /** Newsletter signup — swap for a real endpoint (Mailchimp, ConvertKit, custom API, etc). */
    async subscribeNewsletter(email) {
      const list = JSON.parse(localStorage.getItem(NEWSLETTER_STORAGE_KEY) || '[]');
      if (!list.includes(email)) list.push(email);
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(list));
      return resolveLater({ success: true }, 400);
    }
  };

  window.BlogAPI = BlogAPI;
})();
