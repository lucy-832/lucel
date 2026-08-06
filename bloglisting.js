/* =========================================================
   LUCELLE DIGITAL — BLOG LISTING PAGE
   Everything here is driven by BlogAPI. There is no hardcoded
   post data in this file or in blog.html — new posts created
   in the future Admin Dashboard will appear automatically the
   next time this page loads BlogAPI.getPosts().
   ========================================================= */
(() => {
  'use strict';

  const state = {
    page: 1,
    perPage: 6,
    category: 'all',
    tag: null,
    search: '',
  };

  const els = {
    featured: document.getElementById('featuredPostSlot'),
    grid: document.getElementById('blogGrid'),
    filters: document.getElementById('categoryFilters'),
    tags: document.getElementById('tagsCloud'),
    pagination: document.getElementById('pagination'),
    searchForm: document.getElementById('blogSearchForm'),
    searchInput: document.getElementById('blogSearchInput'),
    resultsNote: document.getElementById('resultsNote'),
  };

  let searchDebounce;

  const syncUrl = () => {
    const params = new URLSearchParams();
    if (state.category !== 'all') params.set('category', state.category);
    if (state.tag) params.set('tag', state.tag);
    if (state.search) params.set('q', state.search);
    if (state.page > 1) params.set('page', state.page);
    const qs = params.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  };

  const readUrl = () => {
    const params = new URLSearchParams(location.search);
    state.category = params.get('category') || 'all';
    state.tag = params.get('tag') || null;
    state.search = params.get('q') || '';
    state.page = parseInt(params.get('page'), 10) || 1;
    if (els.searchInput) els.searchInput.value = state.search;
  };

  /* ---------- FEATURED POST (only shown on default view) ---------- */
  const renderFeatured = async () => {
    if (!els.featured) return;
    const showFeatured = state.page === 1 && state.category === 'all' && !state.tag && !state.search;
    if (!showFeatured) { els.featured.closest('.featured-post').style.display = 'none'; return; }
    const post = await window.BlogAPI.getFeaturedPost();
    if (!post) { els.featured.closest('.featured-post').style.display = 'none'; return; }
    els.featured.closest('.featured-post').style.display = '';
    els.featured.innerHTML = window.BlogRender.featuredCard(post);
    window.LucelleSite.observeReveal(els.featured.querySelector('[data-reveal]'));
  };

  /* ---------- CATEGORY FILTERS ---------- */
  const renderFilters = async () => {
    if (!els.filters) return;
    const categories = await window.BlogAPI.getCategories();
    const totalCount = categories.reduce((sum, c) => sum + c.count, 0);
    const buttons = [{ name: 'All', slug: 'all', count: totalCount }, ...categories.map(c => ({ name: c.name, slug: window.BlogRender.slugify(c.name), count: c.count }))];
    els.filters.innerHTML = buttons.map(b => `
      <button type="button" class="filter-btn${state.category === b.slug ? ' is-active' : ''}" data-category="${b.slug}">
        ${window.BlogRender.escapeHTML(b.name)} <span class="count">(${b.count})</span>
      </button>
    `).join('');
  };

  /* ---------- TAGS CLOUD ---------- */
  const renderTags = async () => {
    if (!els.tags) return;
    const tags = await window.BlogAPI.getTags();
    els.tags.innerHTML = tags.map(t => `
      <button type="button" class="tag-chip${state.tag === window.BlogRender.slugify(t.name) ? ' is-active' : ''}" data-tag="${window.BlogRender.slugify(t.name)}">
        #${window.BlogRender.escapeHTML(t.name)}
      </button>
    `).join('');
  };

  /* ---------- PAGINATION ---------- */
  const renderPagination = (page, totalPages) => {
    if (!els.pagination) return;
    if (totalPages <= 1) { els.pagination.innerHTML = ''; return; }
    let html = `<button type="button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''} aria-label="Previous page"><i class="fa-solid fa-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        html += `<button type="button" data-page="${i}" class="${i === page ? 'is-active' : ''}" aria-current="${i === page}">${i}</button>`;
      } else if (Math.abs(i - page) === 2) {
        html += `<span class="pagination__ellipsis">&hellip;</span>`;
      }
    }
    html += `<button type="button" data-page="${page + 1}" ${page === totalPages ? 'disabled' : ''} aria-label="Next page"><i class="fa-solid fa-chevron-right"></i></button>`;
    els.pagination.innerHTML = html;
  };

  /* ---------- GRID ---------- */
  const renderGrid = async () => {
    if (!els.grid) return;
    els.grid.classList.add('is-loading');
    const { posts, total, totalPages, page } = await window.BlogAPI.getPosts(state);
    state.page = page;

    els.grid.innerHTML = posts.length
      ? posts.map(window.BlogRender.blogCard).join('')
      : window.BlogRender.emptyState();

    els.grid.querySelectorAll('[data-reveal]').forEach(el => window.LucelleSite.observeReveal(el));
    els.grid.classList.remove('is-loading');

    if (els.resultsNote) {
      els.resultsNote.textContent = total
        ? `Showing ${posts.length} of ${total} article${total === 1 ? '' : 's'}`
        : '';
    }
    renderPagination(page, totalPages);
    syncUrl();
  };

  const refreshAll = () => {
    renderFeatured();
    renderGrid();
  };

  /* ---------- EVENTS ---------- */
  if (els.filters) {
    els.filters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      state.category = btn.dataset.category;
      state.page = 1;
      renderFilters();
      refreshAll();
    });
  }

  if (els.tags) {
    els.tags.addEventListener('click', (e) => {
      const chip = e.target.closest('.tag-chip');
      if (!chip) return;
      state.tag = state.tag === chip.dataset.tag ? null : chip.dataset.tag;
      state.page = 1;
      renderTags();
      refreshAll();
    });
  }

  if (els.pagination) {
    els.pagination.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-page]');
      if (!btn || btn.disabled) return;
      state.page = parseInt(btn.dataset.page, 10);
      renderGrid();
      document.getElementById('blogGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (els.searchForm) {
    els.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.search = els.searchInput.value.trim();
      state.page = 1;
      refreshAll();
    });
    els.searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.search = els.searchInput.value.trim();
        state.page = 1;
        refreshAll();
      }, 350);
    });
  }

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', async () => {
    if (!els.grid) return; // Not the listing page — nothing to do here.
    readUrl();
    await Promise.all([renderFilters(), renderTags()]);
    refreshAll();
  });
})();
