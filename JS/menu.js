const sidebar = document.querySelector(".sidebar");
sidebar.classList.add("collapsed");
document.querySelector(".menu-wrapper").classList.add("collapsed");
const sidebarToggleBtn = document.querySelectorAll(".sidebar-toggle");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");

// Updates the theme icon based on current theme and sidebar state
const updateThemeIcon = () => {
  const isDark = document.body.classList.contains("dark-theme");
  themeIcon.textContent = sidebar.classList.contains("collapsed")
    ? isDark
      ? "light_mode"
      : "dark_mode"
    : "dark_mode";
};
// Apply dark theme if saved or system prefers
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
const shouldUseDarkTheme =
  savedTheme === "dark" || (!savedTheme && systemPrefersDark);

/* Apply Dark theme */
document.body.classList.toggle("dark-theme", shouldUseDarkTheme);
updateThemeIcon();

// Toggle sidebar collapsed state on buttons click
sidebarToggleBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    document.querySelector(".menu-wrapper").classList.toggle("collapsed");
    updateThemeIcon();
  });
});

/* Pour déclencher des comportements conditionnels (ex : animations, transitions, etc.).
Pour gérer dynamiquement les classes avec .add(), .remove(), ou .toggle() */

// Toggle between themes on themes on theme button click
themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
});
