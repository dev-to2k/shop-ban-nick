const TRANSITION_MS = 200;

export function withThemeTransition(callback: () => void) {
  const el = document.documentElement;
  el.classList.add('theme-transitioning');
  callback();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => el.classList.remove('theme-transitioning'), TRANSITION_MS);
    });
  });
}
