(() => {
  const THEME_QUERY = "theme";
  const DEFAULT_THEME_ID = "arsen-modern";
  const THEME_ASSET_VERSION = "20260618-newsletter-theme";
  const THEMES = [
    {
      id: "legacy",
      name: "구버전 기본",
      css_path: "assets/themes/legacy.css",
    },
    {
      id: "arsen-modern",
      name: "ARSEN 모던",
      css_path: "assets/themes/arsen-modern.css",
    },
  ];

  function themeLink() {
    return (
      document.querySelector('link[data-arsen-theme="active"]') ||
      Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find((link) => {
        const href = link.getAttribute("href") || "";
        return href.includes("assets/styles.css") || href.includes("assets/themes/");
      })
    );
  }

  function requestedTheme() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get(THEME_QUERY) || DEFAULT_THEME_ID;
    return THEMES.find((theme) => theme.id === id) || THEMES.find((theme) => theme.id === DEFAULT_THEME_ID);
  }

  function applyTheme(theme) {
    const link = themeLink();
    if (!link || !theme) return;
    link.dataset.arsenTheme = "active";
    link.dataset.arsenThemeId = theme.id;
    link.href = `${theme.css_path}?v=${encodeURIComponent(`${theme.id}-${THEME_ASSET_VERSION}`)}`;
    window.dispatchEvent(new CustomEvent("arsen-theme-loaded", { detail: { theme } }));
  }

  window.ArsenTheme = {
    themes: THEMES,
    applyTheme,
  };

  applyTheme(requestedTheme());
})();
