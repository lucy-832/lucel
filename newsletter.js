/* =========================================================
   LUCELLE DIGITAL — NEWSLETTER SIGNUP
   Shared by blog.html and blog-post.html. Swap
   BlogAPI.subscribeNewsletter() to hit a real endpoint later —
   this file needs no changes.
   ========================================================= */
(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        window.LucelleSite.showToast('Enter a valid email address.', 'fa-triangle-exclamation');
        return;
      }
      await window.BlogAPI.subscribeNewsletter(email);
      window.LucelleSite.showToast('You\u2019re subscribed! Watch your inbox.');
      form.reset();
    });
  });
})();
