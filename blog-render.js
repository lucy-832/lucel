/* =========================================================
   LUCELLE DIGITAL — BLOG RENDER HELPERS
   Pure functions that turn a post object (from BlogAPI) into
   HTML. Shared by the listing page and the single-post page's
   "related posts" grid so a blog card only has one template.
   ========================================================= */
window.BlogRender = (() => {
  'use strict';

  const escapeHTML = (str = '') => String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const slugify = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');

  /** Standard blog card — used in the grid and in "related posts". */
  const blogCard = (post) => `
    <article class="blog-card" data-reveal>
      <a href="blog-post.html?slug=${encodeURIComponent(post.slug)}" class="blog-card__media" aria-label="Read ${escapeHTML(post.title)}">
        <span class="blog-card__category">${escapeHTML(post.category)}</span>
        <img src="${post.featuredImage.src}" alt="${escapeHTML(post.featuredImage.alt || post.title)}" loading="lazy" width="480" height="300">
      </a>
      <div class="blog-card__body">
        <h3 class="blog-card__title"><a href="blog-post.html?slug=${encodeURIComponent(post.slug)}">${escapeHTML(post.title)}</a></h3>
        <p class="blog-card__excerpt">${escapeHTML(post.excerpt)}</p>
        <div class="blog-card__meta">
          <span class="blog-card__author">
            <img src="${post.author.avatar}" alt="${escapeHTML(post.author.name)}" loading="lazy" width="26" height="26">
            ${escapeHTML(post.author.name)}
          </span>
          <span class="blog-card__stats">
            <span><i class="fa-regular fa-clock"></i> ${post.readingTime} min</span>
          </span>
        </div>
        <a href="blog-post.html?slug=${encodeURIComponent(post.slug)}" class="blog-card__readmore">Read More <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </article>
  `;

  const featuredCard = (post) => `
    <article class="featured-post__card" data-reveal>
      <a href="blog-post.html?slug=${encodeURIComponent(post.slug)}" class="featured-post__media" aria-label="Read ${escapeHTML(post.title)}">
        <span class="featured-post__badge">Featured</span>
        <img src="${post.featuredImage.src}" alt="${escapeHTML(post.featuredImage.alt || post.title)}" loading="lazy" width="600" height="400">
      </a>
      <div class="featured-post__body">
        <div class="featured-post__meta">
          <span class="category-pill">${escapeHTML(post.category)}</span>
          <span class="dot">&bull;</span>
          <span>${formatDate(post.publishDate)}</span>
          <span class="dot">&bull;</span>
          <span><i class="fa-regular fa-clock"></i> ${post.readingTime} min read</span>
        </div>
        <h2 class="featured-post__title"><a href="blog-post.html?slug=${encodeURIComponent(post.slug)}">${escapeHTML(post.title)}</a></h2>
        <p class="featured-post__excerpt">${escapeHTML(post.excerpt)}</p>
        <div class="featured-post__author">
          <img src="${post.author.avatar}" alt="${escapeHTML(post.author.name)}" loading="lazy" width="38" height="38">
          <div><strong>${escapeHTML(post.author.name)}</strong><span>${escapeHTML(post.author.role || '')}</span></div>
        </div>
        <a href="blog-post.html?slug=${encodeURIComponent(post.slug)}" class="btn btn--primary btn--ripple btn--sm">Read Full Article <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </article>
  `;

  const skeletonCards = (count = 6) => Array.from({ length: count }).map(() => `
    <div class="blog-card" aria-hidden="true" style="min-height:360px;background:var(--surface);border:1px solid var(--line);"></div>
  `).join('');

  const emptyState = (message = 'No articles found. Try a different search or category.') => `
    <div class="blog-empty">
      <i class="fa-regular fa-face-frown"></i>
      <p>${escapeHTML(message)}</p>
    </div>
  `;

  return { escapeHTML, formatDate, slugify, blogCard, featuredCard, skeletonCards, emptyState };
})();
