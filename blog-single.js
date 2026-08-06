/* =========================================================
   LUCELLE DIGITAL — SINGLE BLOG POST PAGE
   Reads ?slug=... from the URL and loads everything from
   BlogAPI. No article content is hardcoded in blog-post.html.
   ========================================================= */
(() => {
  'use strict';

  const R = window.BlogRender;

  const els = {
    main: document.getElementById('articleMain'),
    breadcrumb: document.getElementById('breadcrumbList'),
    category: document.getElementById('articleCategory'),
    title: document.getElementById('articleTitle'),
    authorImg: document.getElementById('articleAuthorImg'),
    authorName: document.getElementById('articleAuthorName'),
    authorRole: document.getElementById('articleAuthorRole'),
    date: document.getElementById('articleDate'),
    readingTime: document.getElementById('articleReadingTime'),
    heroImg: document.getElementById('articleHeroImg'),
    heroImgWrap: document.getElementById('articleHeroImgWrap'),
    body: document.getElementById('articleBody'),
    tags: document.getElementById('articleTags'),
    authorBox: document.getElementById('articleAuthorBox'),
    navPrev: document.getElementById('articleNavPrev'),
    navNext: document.getElementById('articleNavNext'),
    related: document.getElementById('relatedPostsGrid'),
    relatedSection: document.getElementById('relatedPostsSection'),
    shareLinks: document.getElementById('articleShare'),
    notFound: document.getElementById('articleNotFound'),
  };

  const getSlug = () => new URLSearchParams(location.search).get('slug');

  const buildShareLinks = (post) => {
    const url = encodeURIComponent(location.href);
    const text = encodeURIComponent(post.title);
    return [
      { icon: 'fa-brands fa-facebook-f', href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, label: 'Share on Facebook' },
      { icon: 'fa-brands fa-x-twitter', href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`, label: 'Share on X' },
      { icon: 'fa-brands fa-linkedin-in', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, label: 'Share on LinkedIn' },
      { icon: 'fa-brands fa-whatsapp', href: `https://wa.me/?text=${text}%20${url}`, label: 'Share on WhatsApp' },
    ];
  };

  const renderShare = (post) => {
    if (!els.shareLinks) return;
    const links = buildShareLinks(post);
    els.shareLinks.innerHTML = `
      <span>Share</span>
      ${links.map(l => `<a href="${l.href}" target="_blank" rel="noopener" aria-label="${l.label}"><i class="${l.icon}"></i></a>`).join('')}
      <button type="button" id="copyLinkBtn" aria-label="Copy link"><i class="fa-solid fa-link"></i></button>
    `;
    document.getElementById('copyLinkBtn').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        window.LucelleSite.showToast('Link copied to clipboard!');
      } catch {
        window.LucelleSite.showToast('Could not copy link.', 'fa-triangle-exclamation');
      }
    });
  };

  const renderBreadcrumb = (post) => {
    if (!els.breadcrumb) return;
    els.breadcrumb.innerHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="blog.html">Blog</a></li>
      <li><a href="blog.html?category=${encodeURIComponent(R.slugify(post.category))}">${R.escapeHTML(post.category)}</a></li>
      <li aria-current="page">${R.escapeHTML(post.title)}</li>
    `;
  };

  const renderArticle = (post) => {
    document.title = `${post.seo?.title || post.title} — Lucelle Digital Blog`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.seo?.metaDescription || post.excerpt);

    els.category.textContent = post.category;
    els.category.href = `blog.html?category=${encodeURIComponent(R.slugify(post.category))}`;
    els.title.textContent = post.title;
    els.authorImg.src = post.author.avatar;
    els.authorImg.alt = post.author.name;
    els.authorName.textContent = post.author.name;
    els.authorRole.textContent = post.author.role || '';
    els.date.textContent = R.formatDate(post.publishDate);
    els.readingTime.textContent = `${post.readingTime} min read`;

    els.heroImg.src = post.featuredImage.src;
    els.heroImg.alt = post.featuredImage.alt || post.title;

    // Article body content is produced by the Admin Dashboard's rich-text
    // editor and stored as sanitized HTML server-side before it ever
    // reaches this page.
    els.body.innerHTML = post.content;
    els.body.querySelectorAll('img').forEach(img => img.setAttribute('loading', 'lazy'));

    els.tags.innerHTML = `<span style="font-size:12.5px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.06em;margin-right:6px;">Tagged</span>` +
      post.tags.map(t => `<a href="blog.html?tag=${encodeURIComponent(R.slugify(t))}" class="tag-chip">#${R.escapeHTML(t)}</a>`).join('');

    els.authorBox.innerHTML = `
      <img src="${post.author.avatar}" alt="${R.escapeHTML(post.author.name)}" loading="lazy">
      <div>
        <h4>${R.escapeHTML(post.author.name)}</h4>
        <p>${R.escapeHTML(post.author.role || '')} at Lucelle Digital. Helping businesses work smarter and grow faster.</p>
      </div>
    `;

    renderBreadcrumb(post);
    renderShare(post);
  };

  const renderAdjacent = async (post) => {
    const { prev, next } = await window.BlogAPI.getAdjacentPosts(post);
    if (prev) {
      els.navPrev.href = `blog-post.html?slug=${encodeURIComponent(prev.slug)}`;
      els.navPrev.querySelector('.article-nav__title').textContent = prev.title;
      els.navPrev.style.visibility = 'visible';
    } else {
      els.navPrev.style.visibility = 'hidden';
    }
    if (next) {
      els.navNext.href = `blog-post.html?slug=${encodeURIComponent(next.slug)}`;
      els.navNext.querySelector('.article-nav__title').textContent = next.title;
      els.navNext.style.visibility = 'visible';
    } else {
      els.navNext.style.visibility = 'hidden';
    }
  };

  const renderRelated = async (post) => {
    const related = await window.BlogAPI.getRelatedPosts(post, 3);
    if (!related.length) { els.relatedSection.style.display = 'none'; return; }
    els.related.innerHTML = related.map(R.blogCard).join('');
    els.related.querySelectorAll('[data-reveal]').forEach(el => window.LucelleSite.observeReveal(el));
  };

  const showNotFound = () => {
    els.main.style.display = 'none';
    els.notFound.hidden = false;
  };

  document.addEventListener('DOMContentLoaded', async () => {
    const slug = getSlug();
    if (!slug) return showNotFound();

    const post = await window.BlogAPI.getPostBySlug(slug);
    if (!post) return showNotFound();

    renderArticle(post);
    renderAdjacent(post);
    renderRelated(post);
  });
})();
