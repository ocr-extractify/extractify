// Available themes based on files in public/themes folder
export const AVAILABLE_THEMES = [
  { name: 'default', label: 'Default' },
  { name: 'caffeine', label: 'Caffeine' },
  { name: 'pastel-dreams', label: 'Pastel Dreams' },
  { name: 'nature', label: 'Nature' },
  { name: 'ghibli', label: 'Ghibli' },
  { name: 'perpetuity', label: 'Perpetuity' },
] as const;

export type CustomTheme = typeof AVAILABLE_THEMES[number]['name'];

// Storage keys
export const THEME_STORAGE_KEY = 'vite-ui-theme';
export const CUSTOM_THEME_STORAGE_KEY = 'vite-ui-custom-theme';

// Load a theme CSS file dynamically
export function loadThemeCSS(themeName: CustomTheme) {
  // Remove existing theme CSS if any
  const existingThemeLink = document.querySelector('link[data-theme-css]');
  if (existingThemeLink) {
    existingThemeLink.remove();
  }

  // Don't load CSS for default theme as it's handled by main.css
  if (themeName === 'default') {
    return;
  }

  // Create and append new theme CSS link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `/themes/${themeName}.css`;
  link.setAttribute('data-theme-css', 'true');
  document.head.appendChild(link);
}

// Get the current custom theme from localStorage
export function getCurrentCustomTheme(): CustomTheme {
  return (localStorage.getItem(CUSTOM_THEME_STORAGE_KEY) as CustomTheme) || 'default';
}

// Set the current custom theme in localStorage
export function setCurrentCustomTheme(theme: CustomTheme) {
  localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, theme);
  loadThemeCSS(theme);
}

// Initialize theme on app start
export function initializeTheme() {
  const customTheme = getCurrentCustomTheme();
  loadThemeCSS(customTheme);
} 