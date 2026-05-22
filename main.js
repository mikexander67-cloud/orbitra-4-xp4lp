(function() {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function() {
    // Reveal on scroll
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function(el) { io.observe(el); });
    } else {
      revealEls.forEach(function(el) { el.classList.add('in-view'); });
    }

    // Stagger children of [data-stagger]
    document.querySelectorAll('[data-stagger]').forEach(function(parent) {
      Array.prototype.forEach.call(parent.children, function(child, i) {
        child.classList.add('reveal');
        child.style.transitionDelay = (i * 80) + 'ms';
      });
    });

    // Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var id = link.getAttribute('href');
        if (id.length > 1) {
          var target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: top, behavior: 'smooth' });
            var menu = document.querySelector('.nav-menu.open');
            if (menu) closeMenu();
          }
        }
      });
    });

    // Header scroll state
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function() {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Mobile nav toggle
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.nav-menu');

    function openMenu() {
      if (!menu) return;
      menu.classList.add('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      if (!menu) return;
      menu.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
    function toggleMenu() {
      if (!menu) return;
      if (menu.classList.contains('open')) closeMenu();
      else openMenu();
    }

    if (toggle && menu) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Toggle navigation menu');
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
      });
      toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMenu();
        }
      });
      menu.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() { closeMenu(); });
      });
      document.addEventListener('click', function(e) {
        if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
          closeMenu();
        }
      });
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768) closeMenu();
      });
    }
  });
})();
