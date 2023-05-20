const arrows = document.querySelectorAll('.js-down-button');

const navigateToSection = (event: Event): void => {
  if (event?.target) {
    event.preventDefault();
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

arrows.forEach((arrow) => arrow.addEventListener('click', navigateToSection));
