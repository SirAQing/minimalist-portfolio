(function () {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".side-nav a");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });

          const staggerItems = entry.target.querySelectorAll(
            ".timeline-item, .project-card, .blog-item"
          );
          staggerItems.forEach((item, i) => {
            item.style.setProperty(
              "--stagger-delay",
              `${i * 80}ms`
            );
            item.classList.add("stagger-in");
          });
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
})();
