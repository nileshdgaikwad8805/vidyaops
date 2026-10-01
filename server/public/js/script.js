const reveals = document.querySelectorAll(".reveal");
const currentPage = document.body.dataset.page;
const activeNav = document.querySelector(`[data-nav="${currentPage}"]`);
const activeGroup = document.querySelector(`[data-nav-group="${currentPage}"]`);
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const contactForm = document.querySelector(".contact-card[action]");
const contactFormFeedback = document.querySelector(".form-feedback");
const chatbot = document.querySelector(".chatbot");
const isServedOverHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
const chatSessionKey = "vidyaops_chat_session_id";
const leadPrefillKey = "vidyaops_lead_prefill";
const apiBase = String(window.VIDYAOPS_CONFIG?.apiBase || "").replace(/\/$/, "");
const chatSessionId =
  window.localStorage.getItem(chatSessionKey) ||
  (window.crypto?.randomUUID ? window.crypto.randomUUID() : `session-${Date.now()}`);
const apiUrl = (pathname) => (apiBase ? `${apiBase}${pathname}` : pathname);
const isStaticRuntime = window.VIDYAOPS_CONFIG?.runtimeMode === "static" && !apiBase;
const openInquiryEmail = ({ recipient, name, email, organization, interest, message }) => {
  const subject = encodeURIComponent("New VidyaOps Inquiry");
  const body = encodeURIComponent(
    [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company or College: ${organization}`,
      `Interested In: ${interest}`,
      "",
      "Message:",
      message,
    ].join("\n")
  );

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
};
const vidyaOpsKnowledge = {
  contact:
    "You can contact VidyaOps at 9503685152, email info@vidyaops.com, or use the WhatsApp button on this page for a faster reply.",
  audience:
    "VidyaOps is built for college students, freshers, early professionals, and knowledge seekers.",
  location: "VidyaOps is based in Pune, Maharashtra.",
  services:
    "VidyaOps offers Cloud, Data Analysis, AI, and Cybersecurity trainings, along with free and paid workshops.",
  workshops:
    "VidyaOps runs both free and paid workshops. You can check the Upcoming Workshops page to see current workshop options and book your seat.",
  recommendation:
    "If you are just starting, a free workshop is the best first step. If you already want deeper practical learning, a paid workshop or full training track is a better fit.",
};

window.localStorage.setItem(chatSessionKey, chatSessionId);

if (activeNav) {
  activeNav.classList.add("is-active");
}

if (activeGroup) {
  activeGroup.classList.add("is-active");
}

if (navToggle && siteNav) {
  const closeMobileNav = () => {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  const closeDropdowns = () => {
    document.querySelectorAll(".nav-group.is-open").forEach((g) => g.classList.remove("is-open"));
  };

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.querySelectorAll(".nav-group").forEach((group) => {
    const trigger = group.querySelector('[data-nav="services"]');
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      if (window.innerWidth > 1024) return;
      event.preventDefault();
      group.classList.toggle("is-open");
    });
  });

  // Close dropdown on scroll or touch move
  window.addEventListener("scroll", closeDropdowns, { passive: true });
  window.addEventListener("touchmove", closeDropdowns, { passive: true });

  // Close nav + dropdowns on click/tap outside
  document.addEventListener("click", (event) => {
    const inNav = event.target.closest(".site-nav,.nav-toggle");
    if (!inNav) {
      closeDropdowns();
      closeMobileNav();
    }
  });
}

if (contactForm) {
  const savedLead = window.localStorage.getItem(leadPrefillKey);
  if (savedLead) {
    try {
      const lead = JSON.parse(savedLead);
      const nameField = contactForm.querySelector('[name="name"]');
      const emailField = contactForm.querySelector('[name="email"]');
      const organizationField = contactForm.querySelector('[name="organization"]');
      const interestField = contactForm.querySelector('[name="interest"]');
      const messageField = contactForm.querySelector('[name="message"]');

      if (nameField instanceof HTMLInputElement && lead.name) {
        nameField.value = lead.name;
      }

      if (emailField instanceof HTMLInputElement && typeof lead.contact === "string" && lead.contact.includes("@")) {
        emailField.value = lead.contact;
      }

      if (organizationField instanceof HTMLInputElement) {
        organizationField.value = lead.learnerType || "";
      }

      if (interestField instanceof HTMLSelectElement && lead.interest) {
        const matchingOption = Array.from(interestField.options).find(
          (option) => option.value.toLowerCase() === String(lead.interest).toLowerCase()
        );
        if (matchingOption) {
          interestField.value = matchingOption.value;
        }
      }

      if (messageField instanceof HTMLTextAreaElement) {
        messageField.value =
          `I already shared my details in the chatbot.\n` +
          `Learner type: ${lead.learnerType || "Not shared"}\n` +
          `Interest: ${lead.interest || "Not shared"}\n` +
          `Preferred contact: ${lead.contact || "Not shared"}\n\n` +
          `Please guide me on the best next step.`;
      }

      if (contactFormFeedback) {
        contactFormFeedback.hidden = false;
        contactFormFeedback.textContent =
          "Your chatbot details have been filled in here. You can review and send the inquiry.";
      }
    } catch (error) {
      console.error(error);
    }
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const organization = String(formData.get("organization") || "").trim();
    const interest = String(formData.get("interest") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const recipient = contactForm.dataset.fallbackEmail || "";

    if (!isServedOverHttp || isStaticRuntime) {
      openInquiryEmail({ recipient, name, email, organization, interest, message });
      return;
    }

    try {
      const response = await fetch(apiUrl(contactForm.dataset.apiEndpoint || "/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          organization,
          interest,
          message,
          source: "contact_form",
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save inquiry.");
      }

      window.localStorage.removeItem(leadPrefillKey);
      contactForm.reset();
      if (contactFormFeedback) {
        contactFormFeedback.hidden = false;
        contactFormFeedback.textContent =
          "Thanks. Your inquiry has been saved successfully in the VidyaOps app.";
      }
    } catch (error) {
      if (apiBase === "") {
        openInquiryEmail({ recipient, name, email, organization, interest, message });
      } else if (contactFormFeedback) {
        contactFormFeedback.hidden = false;
        contactFormFeedback.textContent = "Unable to send inquiry right now. Please contact VidyaOps on WhatsApp or email info@vidyaops.com.";
      }
    }
  });
}

if (chatbot) {
  const toggle = chatbot.querySelector(".chatbot__toggle");
  const panel = chatbot.querySelector(".chatbot__panel");
  const close = chatbot.querySelector(".chatbot__close");
  const messages = chatbot.querySelector(".chatbot__messages");
  const form = chatbot.querySelector(".chatbot__form");
  const input = chatbot.querySelector(".chatbot__input");
  const leadCapture = {
    active: false,
    step: null,
    data: {
      name: "",
      contact: "",
      learnerType: "",
      interest: "",
    },
  };
  const counselorFlow = {
    active: false,
    step: null,
    data: {
      learnerType: "",
      interest: "",
      goal: "",
    },
  };

  const leadSteps = ["name", "contact", "learnerType", "interest"];
  const leadPrompts = {
    name: "Great. What is your name?",
    contact: "How should VidyaOps contact you? Share your phone number or email.",
    learnerType: "Are you a college student, fresher, early professional, or knowledge seeker?",
    interest: "Which area are you most interested in: Cloud, Data Analysis, AI, Cybersecurity, Free Workshop, or Paid Workshop?",
  };
  const counselorSteps = ["learnerType", "interest", "goal"];
  const counselorPrompts = {
    learnerType: "I can help you choose the best VidyaOps path. First, are you a college student, fresher, early professional, or knowledge seeker?",
    interest: "Which area are you most interested in right now: Cloud, Data Analysis, AI, Cybersecurity, or workshops in general?",
    goal: "What is your main goal right now: explore a topic, build practical skills, prepare for a career start, or choose the right first step?",
  };
  const highIntentPatterns = [
    "enroll",
    "join",
    "admission",
    "admissions",
    "register",
    "sign up",
    "signup",
    "book",
    "call me",
    "contact me",
    "interested",
    "i want to start",
    "i want to join",
    "i want to enroll",
  ];
  const counselorPatterns = [
    "which course",
    "which program",
    "what should i start",
    "help me choose",
    "recommend",
    "suggest",
    "best path",
    "which is best",
    "what is best for me",
  ];

  const getLocalReply = async (text) => {
    const lower = text.toLowerCase();

    if (lower.includes("cloud")) {
      return "VidyaOps offers practical Cloud training for college students, freshers, and early professionals. You can ask us through Contact or WhatsApp to know the next batch.";
    }

    if (lower.includes("data")) {
      return "We offer Data Analysis training focused on practical understanding, tools, and analytical thinking. It is designed to be beginner-friendly and career-relevant.";
    }

    if (lower.includes("ai")) {
      return "VidyaOps provides AI training for curious learners who want practical exposure, guided learning, and workshop-based understanding of modern AI topics.";
    }

    if (lower.includes("cyber")) {
      return "Our Cybersecurity training is built for learners who want to understand security basics, awareness, and future career possibilities in cybersecurity.";
    }

    if (lower.includes("workshop") || lower.includes("free") || lower.includes("paid")) {
      return vidyaOpsKnowledge.workshops;
    }

    if (
      lower.includes("which") ||
      lower.includes("recommend") ||
      lower.includes("best") ||
      lower.includes("start")
    ) {
      return `${vidyaOpsKnowledge.recommendation} ${vidyaOpsKnowledge.contact}`;
    }

    if (lower.includes("college") || lower.includes("student") || lower.includes("fresher")) {
      return vidyaOpsKnowledge.audience;
    }

    if (lower.includes("contact") || lower.includes("phone") || lower.includes("email") || lower.includes("whatsapp")) {
      return vidyaOpsKnowledge.contact;
    }

    if (lower.includes("location") || lower.includes("pune")) {
      return vidyaOpsKnowledge.location;
    }

    if (lower.includes("service") || lower.includes("training")) {
      return vidyaOpsKnowledge.services;
    }

    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hello! I can help with VidyaOps trainings, workshops, contact details, audience, and learning paths. What would you like to know?";
    }

    return "I can help with VidyaOps trainings in Cloud, Data Analysis, AI, Cybersecurity, workshops, and contact details. Try asking about a course, workshop, how to contact us, or upcoming workshops.";
  };

  const botReplies = async (text, history) => {
    if (!isServedOverHttp || isStaticRuntime) {
      return getLocalReply(text);
    }

    try {
      const response = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: chatSessionId,
          message: text,
          messages: history,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Chat request failed.");
      }

      return payload.reply || getLocalReply(text);
    } catch (error) {
      console.error(error);
      return `${await getLocalReply(text)} For personalized guidance, contact VidyaOps on WhatsApp, call 9503685152, or email info@vidyaops.com.`;
    }
  };

  const addMessage = (text, sender) => {
    const bubble = document.createElement("div");
    bubble.className = `chatbot__bubble chatbot__bubble--${sender}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  };

  const resetLeadCapture = () => {
    leadCapture.active = false;
    leadCapture.step = null;
    leadCapture.data = {
      name: "",
      contact: "",
      learnerType: "",
      interest: "",
    };
  };

  const resetCounselorFlow = () => {
    counselorFlow.active = false;
    counselorFlow.step = null;
    counselorFlow.data = {
      learnerType: "",
      interest: "",
      goal: "",
    };
  };

  const startLeadCapture = () => {
    resetLeadCapture();
    leadCapture.active = true;
    leadCapture.step = leadSteps[0];
    addMessage(
      "I can help you get started. I will collect a few details so VidyaOps can guide you better.",
      "bot"
    );
    addMessage(leadPrompts[leadCapture.step], "bot");
  };

  const startCounselorFlow = () => {
    resetCounselorFlow();
    counselorFlow.active = true;
    counselorFlow.step = counselorSteps[0];
    addMessage(
      "I can guide you like a VidyaOps counselor. I will ask 3 quick questions, then recommend the best starting path.",
      "bot"
    );
    addMessage(counselorPrompts[counselorFlow.step], "bot");
  };

  const nextLeadStep = async () => {
    const currentIndex = leadSteps.indexOf(leadCapture.step);
    const nextStep = leadSteps[currentIndex + 1];

    if (!nextStep) {
      if (isServedOverHttp && !isStaticRuntime) {
        try {
          await fetch(apiUrl("/api/leads"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId: chatSessionId,
              name: leadCapture.data.name,
              contact: leadCapture.data.contact,
              learnerType: leadCapture.data.learnerType,
              interest: leadCapture.data.interest,
            }),
          });
        } catch (error) {
          console.error(error);
        }
      }

      window.localStorage.setItem(leadPrefillKey, JSON.stringify(leadCapture.data));

      const summary =
        `Thanks ${leadCapture.data.name}. Here is your lead summary:\n` +
        `Name: ${leadCapture.data.name}\n` +
        `Contact: ${leadCapture.data.contact}\n` +
        `Learner Type: ${leadCapture.data.learnerType}\n` +
        `Interest: ${leadCapture.data.interest}\n\n` +
        `Your details are ready. Open the Contact page to see them pre-filled, or continue via WhatsApp for a faster reply.`;
      addMessage(summary, "bot");
      resetLeadCapture();
      return;
    }

    leadCapture.step = nextStep;
    addMessage(leadPrompts[nextStep], "bot");
  };

  const saveLeadAnswer = async (text) => {
    if (!leadCapture.active || !leadCapture.step) {
      return false;
    }

    leadCapture.data[leadCapture.step] = text;
    await nextLeadStep();
    return true;
  };

  const getLocalCounselorReply = ({ learnerType, interest, goal }) => {
    const learner = learnerType.toLowerCase();
    const area = interest.toLowerCase();
    const objective = goal.toLowerCase();

    let recommendation = "a free workshop";
    let reason = "because it is the easiest way to explore a domain before committing to a deeper path.";

    if (
      area.includes("ai") ||
      area.includes("cloud") ||
      area.includes("data") ||
      area.includes("cyber")
    ) {
      if (objective.includes("career") || objective.includes("practical") || objective.includes("skills")) {
        recommendation = `${interest} training`;
        reason = "because you are looking for deeper practical growth, not just initial exposure.";
      } else if (objective.includes("explore") || objective.includes("first step")) {
        recommendation = `a ${interest} workshop`;
        reason = "because a workshop gives you a lower-risk starting point with clearer direction.";
      }
    }

    if (learner.includes("student") || learner.includes("fresher")) {
      reason += " For your stage, clarity and momentum matter more than trying to learn everything at once.";
    }

    return `Based on what you shared, I recommend starting with ${recommendation} ${reason} A good next alternative would be a paid workshop if you want more guided practice before joining a full training track. If you want, continue on the Contact page or WhatsApp so VidyaOps can guide you personally.`;
  };

  const completeCounselorFlow = async () => {
    const counselorPrompt =
      `Learner type: ${counselorFlow.data.learnerType}\n` +
      `Interest area: ${counselorFlow.data.interest}\n` +
      `Goal: ${counselorFlow.data.goal}\n` +
      `Please recommend the best VidyaOps starting path.`;

    const history = [
      {
        role: "user",
        content: counselorPrompt,
      },
    ];

    let reply = getLocalCounselorReply(counselorFlow.data);

    if (isServedOverHttp && !isStaticRuntime) {
      try {
        const response = await fetch(apiUrl("/api/chat"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: chatSessionId,
            mode: "counselor",
            message: counselorPrompt,
            messages: history,
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Counselor request failed.");
        }

        reply = payload.reply || reply;
      } catch (error) {
        console.error(error);
      }
    }

    addMessage(reply, "bot");
    resetCounselorFlow();
  };

  const saveCounselorAnswer = async (text) => {
    if (!counselorFlow.active || !counselorFlow.step) {
      return false;
    }

    counselorFlow.data[counselorFlow.step] = text;
    const currentIndex = counselorSteps.indexOf(counselorFlow.step);
    const nextStep = counselorSteps[currentIndex + 1];

    if (!nextStep) {
      await completeCounselorFlow();
      return true;
    }

    counselorFlow.step = nextStep;
    addMessage(counselorPrompts[nextStep], "bot");
    return true;
  };

  addMessage(
    "Hi, I am VidyaOps AI. I can answer questions about trainings, workshops, and how to contact VidyaOps.",
    "bot"
  );

  toggle.addEventListener("click", () => {
    const isHidden = panel.hasAttribute("hidden");
    if (isHidden) {
      panel.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
      input.focus();
    } else {
      panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  close.addEventListener("click", () => {
    panel.setAttribute("hidden", "");
    toggle.setAttribute("aria-expanded", "false");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      return;
    }

    addMessage(text, "user");
    input.value = "";

    if (leadCapture.active) {
      saveLeadAnswer(text);
      return;
    }

    if (counselorFlow.active) {
      saveCounselorAnswer(text);
      return;
    }

    const lower = text.toLowerCase();
    if (highIntentPatterns.some((pattern) => lower.includes(pattern))) {
      startLeadCapture();
      return;
    }

    if (counselorPatterns.some((pattern) => lower.includes(pattern))) {
      startCounselorFlow();
      return;
    }

    const history = Array.from(messages.querySelectorAll(".chatbot__bubble")).map((bubble) => ({
      role: bubble.classList.contains("chatbot__bubble--user") ? "user" : "assistant",
      content: bubble.textContent || "",
    }));

    window.setTimeout(async () => {
      addMessage(await botReplies(text, history), "bot");
    }, 250);
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

reveals.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 70, 320)}ms`;
  revealObserver.observe(element);
});

const countElements = document.querySelectorAll("[data-count]");

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 1400;
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        element.textContent =
          target >= 1000 ? `${value.toLocaleString()}+` : `${value}+`;

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else if (target === 92) {
          element.textContent = "92%";
        } else {
          element.textContent = `${target.toLocaleString()}+`;
        }
      };

      requestAnimationFrame(frame);
      countObserver.unobserve(element);
    });
  },
  { threshold: 0.5 }
);

countElements.forEach((element) => countObserver.observe(element));

async function loadSiteContent() {
  if (isStaticRuntime) {
    return;
  }

  try {
    const response = await fetch(apiUrl('/api/content'));
    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    
    if (payload.content) {
      const elements = document.querySelectorAll("[data-content-key]");
      elements.forEach((el) => {
        const key = el.getAttribute("data-content-key");
        if (payload.content[key]) {
          el.textContent = payload.content[key];
        }
      });
    }
  } catch (error) {
    return;
  }
}

loadSiteContent();

if (typeof Swiper !== "undefined") {
  new Swiper(".service-swiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: { el: ".service-pagination", clickable: true },
    breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
  });

  new Swiper(".case-swiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: { el: ".case-pagination", clickable: true },
    breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
  });

  new Swiper(".testimonial-swiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: { el: ".testimonial-pagination", clickable: true },
    breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
  });
}

