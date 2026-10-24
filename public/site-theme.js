// Runs in the head, before the page paints. Shared across Works and View all.
(() => {
  const key = 'jomul-theme';
  const root = document.documentElement;
  const valid = value => ['light', 'dark'].includes(value);
  let preference = 'light';
  try { const stored = localStorage.getItem(key); if (valid(stored)) preference = stored; } catch { /* Private/storage-disabled browsing starts in light mode. */ }
  const choices = ['light', 'dark'];
  const labels = {light: 'Light', dark: 'Dark'};
  const names = {light: '밝게', dark: '어둡게'};
  function apply() {
    const theme = preference;
    root.dataset.theme = theme;
    root.dataset.themePreference = preference;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171716' : '#ffffff');
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      const next = choices[(choices.indexOf(preference) + 1) % choices.length];
      button.textContent = labels[preference];
      button.setAttribute('aria-label', `화면 모드: ${names[preference]}. ${names[next]}로 변경`);
      button.title = `화면 모드: ${names[preference]}`;
    }
  }
  function setPreference(value) {
    if (!valid(value)) return;
    preference = value;
    try { localStorage.setItem(key, preference); } catch { /* The current tab can still switch. */ }
    apply();
  }
  apply();
  addEventListener('storage', event => { if (event.key === key || event.key === null) { preference = valid(event.newValue) ? event.newValue : 'light'; apply(); } });
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      button.hidden = false;
      button.addEventListener('click', () => setPreference(choices[(choices.indexOf(preference) + 1) % choices.length]));
    }
  });
})();
