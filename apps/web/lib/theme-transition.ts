export function withThemeTransition(callback: () => void) {
  const el = document.documentElement;
  el.classList.add('theme-transitioning');
  callback();
  requestAnimationFrame(() => {
    setTimeout(() => el.classList.remove('theme-transitioning'), 350);
  });
}
