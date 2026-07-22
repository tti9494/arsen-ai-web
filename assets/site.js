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
    window.setTimeout(() => {
      document.querySelectorAll("[data-animate]:not(.is-visible)").forEach((el) => {
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
      });
    }, 2500);
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

  const showFormMessage = (form, selector, message) => {
    const target = form.querySelector(selector);
    if (!target) return;
    if (message) target.textContent = message;
    target.classList.remove("hidden");
  };

  const hideFormMessage = (form, selector) => {
    const target = form.querySelector(selector);
    if (target) target.classList.add("hidden");
  };

  const formPayload = (form) => {
    const payload = Object.fromEntries(new FormData(form).entries());
    if (form.dataset.source) payload.source = form.dataset.source;
    if (form.dataset.topic) payload.topic = form.dataset.topic;
    if (form.dataset.productInterest) payload.product_interest = form.dataset.productInterest;
    const contact = String(payload.contact || "").trim();
    if (contact) {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
      const digits = contact.replace(/[^\d]/g, "");
      if (payload.source === "home_newsletter") {
        payload.phone = contact;
        payload.contact_type = "phone";
        payload.topic = `${payload.topic || "소식 받기"} · 번호`;
        payload.product_interest = "메인 소식 받기 · 번호";
      } else if (isEmail) {
        payload.email = contact;
        payload.contact_type = "email";
      } else if (digits.length >= 7) {
        payload.phone = contact;
        payload.contact_type = "phone";
      }
    }
    payload.page_url = window.location.href;
    payload.referrer = document.referrer || "";
    payload.consent_privacy = String(payload.consent_privacy || "").toLowerCase() === "true";
    return payload;
  };

  document.querySelectorAll("[data-consultation-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type='submit']");
      const original = button ? button.textContent : "";
      hideFormMessage(form, "[data-success]");
      hideFormMessage(form, "[data-error]");
      if (button) {
        button.disabled = true;
        button.textContent = "접수 중...";
      }
      try {
        const endpoint = form.dataset.endpoint || "https://apply.arsen-ai.com/api/consultations";
        const payload = formPayload(form);
        if (!payload.consent_privacy) throw new Error("개인정보 수집·이용 동의가 필요합니다.");
        if (form.dataset.source === "home_newsletter") {
          if (String(payload.consent_marketing || "").toLowerCase() !== "true") {
            throw new Error("광고성 소식 수신 동의가 필요합니다.");
          }
          const name = String(payload.name || "").trim();
          const digits = String(payload.phone || payload.contact || "").replace(/[^\d]/g, "");
          if (!name) throw new Error("이름을 입력해주세요.");
          if (digits.length < 7) throw new Error("전화번호를 입력해주세요.");
        }
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.ok === false) {
          throw new Error(data.detail || data.message || "상담 접수에 실패했습니다.");
        }
        showFormMessage(form, "[data-success]", data.message || "상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.");
        form.reset();
      } catch (error) {
        showFormMessage(form, "[data-error]", error.message || "상담 접수 중 오류가 발생했습니다.");
      } finally {
        if (button) {
          button.textContent = original;
          button.disabled = false;
        }
      }
    });
  });

})();
