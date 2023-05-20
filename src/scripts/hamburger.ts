const hamburguerButton = document.getElementById('js-menu');
const menuItems = document.querySelectorAll('.js-nav-menu');

const toggleMenu = (event: Event): void => {
  event.preventDefault();
  document.body.classList.toggle('menu-open');
};

export const navigateToSection = (event: Event): void => {
  toggleMenu(event);
  if (event?.target) {
    const nameToGo = (event.target as HTMLAnchorElement).getAttribute(
      'data-section',
    );

    if (nameToGo) {
      const elementToGo = document.getElementById(nameToGo);
      if (elementToGo) {
        elementToGo.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  }
};

if (hamburguerButton) {
  hamburguerButton.addEventListener('click', toggleMenu);
}

menuItems.forEach((menuItem) => {
  menuItem.addEventListener('click', navigateToSection);
});
