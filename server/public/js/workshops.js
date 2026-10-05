const workshopList = document.querySelector("#workshop-list");
const workshopsApiBase = String(window.VIDYAOPS_CONFIG?.apiBase || "").replace(/\/$/, "");
const workshopApiUrl = (pathname) => (workshopsApiBase ? `${workshopsApiBase}${pathname}` : pathname);
const isStaticWorkshopRuntime = window.VIDYAOPS_CONFIG?.runtimeMode === "static" && !workshopsApiBase;
const defaultWorkshops = [
  {
    title: "Cloud Basics for College Students",
    type: "Free Workshop",
    description: "Introductory session covering cloud concepts, career paths, and practical starting points.",
    schedule_text: "Coming Soon",
    duration_text: "2 Hours",
    level_text: "Beginner",
    cta_text: "Notify Me",
    cta_link: "enroll.html",
  },
  {
    title: "Hands-On Data Analysis Sprint",
    type: "Paid Workshop",
    description: "Learn practical data workflows, basic tools, and how to think analytically with guided exercises.",
    schedule_text: "Coming Soon",
    duration_text: "3 Hours",
    level_text: "Beginner to Intermediate",
    cta_text: "Notify Me",
    cta_link: "enroll.html",
  },
  {
    title: "Introduction to AI Tools and Use Cases",
    type: "Free Workshop",
    description: "Explore AI ideas, practical examples, and how students and freshers can start learning responsibly.",
    schedule_text: "Coming Soon",
    duration_text: "90 Minutes",
    level_text: "Beginner",
    cta_text: "Notify Me",
    cta_link: "enroll.html",
  },
  {
    title: "Cybersecurity Awareness and Foundations",
    type: "Paid Workshop",
    description: "Understand security basics, threat awareness, and how cybersecurity skills connect to career growth.",
    schedule_text: "Coming Soon",
    duration_text: "2.5 Hours",
    level_text: "Beginner",
    cta_text: "Notify Me",
    cta_link: "enroll.html",
  },
];

function renderWorkshopCard(workshop) {
  return `
    <article class="workshop-card reveal is-visible">
      <p class="workshop-card__type">${workshop.type}</p>
      <h3>${workshop.title}</h3>
      <p>${workshop.description}</p>
      <ul class="workshop-meta">
        <li>${workshop.schedule_text}</li>
        <li>${workshop.duration_text}</li>
        <li>${workshop.level_text}</li>
      </ul>
      <a class="button" href="${workshop.cta_link === 'contact.html' ? 'enroll.html' : workshop.cta_link}">${workshop.cta_text}</a>
    </article>
  `;
}

async function loadWorkshops() {
  if (!workshopList) {
    return;
  }

  if (window.location.protocol !== "http:" && window.location.protocol !== "https:") {
    workshopList.innerHTML = `
      <article class="workshop-card reveal is-visible">
        <p class="workshop-card__type">Preview Mode</p>
        <h3>Workshops are coming soon at VidyaOps.</h3>
        <p>Stay tuned — session dates will be announced once confirmed. Get in touch to express your interest.</p>
        <a class="button" href="contact.html">Notify Me</a>
      </article>
    `;
    return;
  }

  if (isStaticWorkshopRuntime) {
    workshopList.innerHTML = defaultWorkshops.map(renderWorkshopCard).join("");
    return;
  }

  try {
    const response = await fetch(workshopApiUrl("/api/workshops"), {
      headers: {
        Accept: "application/json",
      },
    });
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error("Workshop API did not return JSON.");
    }

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error || "Unable to load workshops.");
    }

    const workshops = Array.isArray(payload.workshops) ? payload.workshops : [];
    workshopList.innerHTML = (workshops.length ? workshops : defaultWorkshops).map(renderWorkshopCard).join("");
  } catch (error) {
    workshopList.innerHTML = defaultWorkshops.map(renderWorkshopCard).join("");
  }
}

loadWorkshops();
