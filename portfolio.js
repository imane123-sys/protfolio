const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");
const contactForm = document.querySelector(".contact form");
const projectsSection = document.querySelector(".projects");
const projectsContainer = document.querySelector(".projects__container");
const projectCards = Array.from(document.querySelectorAll(".projects__card"));

if (menuIcon && navbar) {
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
    menuIcon.classList.toggle("bx-menu");
    menuIcon.classList.toggle("bx-x");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      navbar.classList.remove("active");
      menuIcon.classList.add("bx-menu");
      menuIcon.classList.remove("bx-x");

      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const header = document.querySelector(".header");
          const offset = (header ? header.offsetHeight : 0) + 12;
          const top =
            target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
          history.pushState(null, "", href);
        }
      }
    });
  });
}

if (contactForm) {
  const recipientEmail = "ramadaneimane8@gmail.com";
  const nameInput = contactForm.querySelector(
    'input[placeholder="Nom Complet"]',
  );
  const emailInput = contactForm.querySelector('input[type="email"]');
  const phoneInput = contactForm.querySelector(
    'input[placeholder="Numéro de téléphone"]',
  );
  const subjectInput = contactForm.querySelector('input[placeholder="Sujet"]');
  const messageInput = contactForm.querySelector("textarea");

  if (nameInput && !nameInput.name) nameInput.name = "name";
  if (emailInput && !emailInput.name) emailInput.name = "email";
  if (phoneInput && !phoneInput.name) phoneInput.name = "phone";
  if (subjectInput && !subjectInput.name) subjectInput.name = "subject";
  if (messageInput && !messageInput.name) messageInput.name = "message";

  contactForm.method = "POST";
  contactForm.action = `https://formsubmit.co/${recipientEmail}`;

  const hiddenFields = {
    _template: "table",
    _subject: "Nouveau message depuis le portfolio",
    _autoresponse:
      "Merci de m'avoir contactée. J'ai bien reçu votre message et je vous répondrai dès que possible.",
  };

  Object.entries(hiddenFields).forEach(([name, value]) => {
    let hiddenInput = contactForm.querySelector(`input[name="${name}"]`);

    if (!hiddenInput) {
      hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = name;
      contactForm.appendChild(hiddenInput);
    }

    hiddenInput.value = value;
  });
}

if (projectsSection && projectsContainer && projectCards.length) {
  const projectsTitle = projectsSection.querySelector(".section__title");
  const projectsHeader = document.createElement("div");
  projectsHeader.className = "projects-header";
  projectsHeader.style.display = "flex";
  projectsHeader.style.alignItems = "center";
  projectsHeader.style.justifyContent = "flex-start";
  projectsHeader.style.gap = "1.2rem";
  projectsHeader.style.flexWrap = "wrap";
  projectsHeader.style.width = "100%";
  projectsHeader.style.maxWidth = "900px";
  projectsHeader.style.margin = "0 auto 2rem";
  projectsHeader.style.padding = "0 1rem";

  const searchWrapper = document.createElement("div");
  searchWrapper.className = "projects-search";
  searchWrapper.style.display = "flex";
  searchWrapper.style.justifyContent = "center";
  searchWrapper.style.flex = "0 0 auto";

  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.placeholder = "Rechercher par nom";
  searchInput.setAttribute("aria-label", "Rechercher par nom");
  searchInput.style.padding = "1.4rem 1.6rem";
  searchInput.style.borderRadius = "1.2rem";
  searchInput.style.border = "1px solid rgba(0, 255, 238, 0.35)";
  searchInput.style.background = "rgba(19, 19, 19, 0.95)";
  searchInput.style.color = "white";
  searchInput.style.fontSize = "1.6rem";
  searchInput.style.outline = "none";
  searchInput.style.boxSizing = "border-box";
  searchInput.style.width = "auto";
  searchInput.style.minWidth = "0";

  if (projectsTitle) {
    projectsSection.insertBefore(projectsHeader, projectsTitle);
    projectsHeader.appendChild(projectsTitle);
    projectsHeader.appendChild(searchWrapper);
    searchWrapper.appendChild(searchInput);
  } else {
    searchWrapper.appendChild(searchInput);
    projectsSection.insertBefore(searchWrapper, projectsContainer);
  }

  const searchSizer = document.createElement("span");
  searchSizer.style.position = "absolute";
  searchSizer.style.left = "-9999px";
  searchSizer.style.top = "-9999px";
  searchSizer.style.visibility = "hidden";
  searchSizer.style.whiteSpace = "pre";
  searchSizer.style.pointerEvents = "none";
  searchSizer.style.fontSize = searchInput.style.fontSize;
  searchSizer.style.fontFamily =
    window.getComputedStyle(searchInput).fontFamily;
  searchSizer.style.fontWeight =
    window.getComputedStyle(searchInput).fontWeight;
  searchSizer.style.letterSpacing =
    window.getComputedStyle(searchInput).letterSpacing;
  document.body.appendChild(searchSizer);

  const syncSearchWidth = () => {
    const text = searchInput.value || searchInput.placeholder || "";
    searchSizer.textContent = text;
    const textWidth = Math.ceil(searchSizer.getBoundingClientRect().width);
    const horizontalPadding = 32;
    const horizontalBorder = 2;
    searchInput.style.width = `${textWidth + horizontalPadding + horizontalBorder + 4}px`;
  };

  const noResults = document.createElement("p");
  noResults.className = "projects-empty";
  noResults.textContent = "Aucun projet ne correspond à cette recherche.";
  noResults.style.display = "none";
  noResults.style.textAlign = "center";
  noResults.style.margin = "1.2rem 0 0";
  noResults.style.fontSize = "1.6rem";
  noResults.style.color = "var(--text-color)";

  projectsSection.insertBefore(noResults, projectsContainer.nextSibling);

  const filterProjects = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const title =
        card.querySelector(".projects__title")?.textContent?.toLowerCase() ||
        "";
      const matches = title.includes(query);

      card.style.display = matches ? "block" : "none";

      if (matches) {
        visibleCount += 1;
      }
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
  };

  searchInput.addEventListener("input", () => {
    syncSearchWidth();
    filterProjects();
  });

  syncSearchWidth();
}
