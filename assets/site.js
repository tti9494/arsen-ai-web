(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      document.body.classList.toggle("menu-open", !isOpen);
      menuBtn.setAttribute("aria-expanded", String(!isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "메뉴 열기" : "메뉴 닫기");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        document.body.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "메뉴 열기");
      });
    });
  }

  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === current || (current === "" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });

  if (!prefersReduced && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll("[data-animate]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  if (!prefersReduced && "IntersectionObserver" in window) {
    const startCount = (el) => {
      const target = parseInt(el.getAttribute("data-count") || "0", 10);
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1200;
      const started = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setTimeout(() => startCount(entry.target), 420);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));
  }

  document.querySelectorAll("[data-faq-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const open = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    });
  });

  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  });

  document.querySelectorAll("[data-mock-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type='submit']");
      const success = form.querySelector("[data-success]");
      const original = button ? button.textContent : "";
      if (button) {
        button.disabled = true;
        button.textContent = "접수 중...";
      }
      setTimeout(() => {
        if (success) success.classList.remove("hidden");
        if (button) {
          button.textContent = original;
          button.disabled = false;
        }
        form.reset();
      }, 650);
    });
  });
})();
