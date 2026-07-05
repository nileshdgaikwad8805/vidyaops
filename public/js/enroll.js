const enrollmentForm = document.querySelector("#enrollment-form");
const productGrid = document.querySelector("#product-grid");
const productSelect = document.querySelector("#enrollment-product");
const enrollmentFeedback = document.querySelector("#enrollment-feedback");
const enrollmentSubmit = document.querySelector("#enrollment-submit");
const enrollmentApiBase = String(window.VIDYAOPS_CONFIG?.apiBase || "").replace(/\/$/, "");
const enrollmentApiUrl = (pathname) => (enrollmentApiBase ? `${enrollmentApiBase}${pathname}` : pathname);
const isStaticEnrollmentRuntime = window.VIDYAOPS_CONFIG?.runtimeMode === "static" && !enrollmentApiBase;
const learnerTokenKey = "vidyaops_learner_token";
const fallbackProductCatalog = [
  {
    id: "free-community-workshop",
    type: "free",
    category: "Community Workshop",
    name: "Free Community Workshop Pass",
    priceInr: 0,
    description:
      "An open-entry VidyaOps community workshop for students, freshers, and knowledge seekers who want a low-risk first step.",
    includes: [
      "Live community workshop access",
      "Skill guidance from VidyaOps",
      "Post-workshop next-step recommendations",
    ],
    ctaLabel: "Register Free",
  },
  {
    id: "paid-ai-workshop",
    type: "paid",
    category: "Paid Workshop",
    name: "AI Career Starter Workshop",
    priceInr: 1499,
    description:
      "A paid practical workshop focused on AI fundamentals, tool exposure, guided exercises, and clearer career direction.",
    includes: [
      "Guided live workshop",
      "Practical exercises and assignments",
      "Learner dashboard access and onboarding",
    ],
    ctaLabel: "Enroll",
  },
  {
    id: "paid-cloud-workshop",
    type: "paid",
    category: "Paid Workshop",
    name: "Cloud Foundations Workshop",
    priceInr: 1999,
    description:
      "A hands-on cloud workshop for learners who want stronger practical clarity before moving into deeper training paths.",
    includes: [
      "Structured workshop delivery",
      "Foundational cloud roadmap",
      "Access to onboarding and next-step guidance",
    ],
    ctaLabel: "Enroll",
  },
];

let productCatalog = [];
let razorpayReady = false;
let razorpayKeyId = "";

function renderProductCard(product) {
  const price = product.priceInr === 0 ? "Free" : `INR ${product.priceInr}`;
  return `
    <article class="enterprise-card reveal is-visible">
      <p class="story-card__label">${product.category}</p>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <strong class="product-price">${price}</strong>
      <ul class="page-hero__list">
        ${product.includes.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <button type="button" class="button button--secondary" data-product-select="${product.id}">
        ${product.ctaLabel}
      </button>
    </article>
  `;
}

async function loadProducts() {
  let payload;

  try {
    if (isStaticEnrollmentRuntime) {
      throw new Error("Static product catalog fallback.");
    }

    const response = await fetch(enrollmentApiUrl("/api/products"));
    payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error || "Unable to load products.");
    }
  } catch (error) {
    payload = {
      products: fallbackProductCatalog,
      razorpayEnabled: false,
      razorpayKeyId: "",
    };
  }

  productCatalog = Array.isArray(payload.products) ? payload.products : [];
  razorpayReady = Boolean(payload.razorpayEnabled);
  razorpayKeyId = String(payload.razorpayKeyId || "");

  if (productGrid) {
    productGrid.innerHTML = productCatalog.map(renderProductCard).join("");
  }

  if (productSelect) {
    productSelect.innerHTML =
      '<option value="">Select a workshop</option>' +
      productCatalog
        .map((product) => {
          const price = product.priceInr === 0 ? "Free" : `INR ${product.priceInr}`;
          return `<option value="${product.id}">${product.name} - ${price}</option>`;
        })
        .join("");
  }

  document.querySelectorAll("[data-product-select]").forEach((button) => {
    button.addEventListener("click", () => {
      if (productSelect instanceof HTMLSelectElement) {
        productSelect.value = button.getAttribute("data-product-select") || "";
        window.scrollTo({ top: enrollmentForm?.offsetTop || 0, behavior: "smooth" });
      }
    });
  });
}

function setFeedback(message, isError = false) {
  if (!enrollmentFeedback) {
    return;
  }

  enrollmentFeedback.hidden = false;
  enrollmentFeedback.textContent = message;
  enrollmentFeedback.style.color = isError ? "#9e3f12" : "";
}

async function submitFreeEnrollment(payload) {
  const response = await fetch(enrollmentApiUrl("/api/enrollments/free"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error || "Unable to register for the free workshop.");
  }

  window.localStorage.setItem(learnerTokenKey, result.accessToken);
  window.location.href = result.redirectUrl || `learner-dashboard.html?token=${encodeURIComponent(result.accessToken)}`;
}

function openEnrollmentMail(payload, selectedProduct) {
  const subject = encodeURIComponent(`VidyaOps Enrollment Inquiry - ${selectedProduct.name}`);
  const body = encodeURIComponent(
    [
      `Product: ${selectedProduct.name}`,
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Learner Type: ${payload.learnerType}`,
      "",
      "Goal:",
      payload.goal || "Not shared",
    ].join("\n")
  );

  window.location.href = `mailto:info@vidyaops.com?subject=${subject}&body=${body}`;
}

async function submitPaidEnrollment(payload) {
  const response = await fetch(enrollmentApiUrl("/api/payments/razorpay/order"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error || "Unable to start paid enrollment.");
  }

  if (!window.Razorpay || !razorpayReady || !razorpayKeyId) {
    throw new Error("Razorpay checkout is not configured yet.");
  }

  const options = {
    key: result.keyId,
    amount: result.amount,
    currency: result.currency,
    name: "VidyaOps",
    description: result.product?.name || "VidyaOps Workshop",
    order_id: result.orderId,
    prefill: result.learner,
    theme: {
      color: "#d96f32",
    },
    handler: async function (paymentResponse) {
      const verifyResponse = await fetch(enrollmentApiUrl("/api/payments/razorpay/verify"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enrollmentId: result.enrollmentId,
          ...paymentResponse,
        }),
      });
      const verifyPayload = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyPayload?.error || "Payment verification failed.");
      }

      window.localStorage.setItem(learnerTokenKey, verifyPayload.accessToken);
      window.location.href = verifyPayload.redirectUrl || `payment-success.html?token=${encodeURIComponent(verifyPayload.accessToken)}`;
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

if (enrollmentForm) {
  loadProducts().catch((error) => setFeedback(error instanceof Error ? error.message : "Unable to load products.", true));

  enrollmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (enrollmentFeedback) {
      enrollmentFeedback.hidden = true;
      enrollmentFeedback.textContent = "";
    }

    if (enrollmentSubmit instanceof HTMLButtonElement) {
      enrollmentSubmit.disabled = true;
    }

    const formData = new FormData(enrollmentForm);
    const payload = {
      productId: String(formData.get("productId") || "").trim(),
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      learnerType: String(formData.get("learnerType") || "").trim(),
      goal: String(formData.get("goal") || "").trim(),
    };

    try {
      const selectedProduct = productCatalog.find((product) => product.id === payload.productId);
      if (!selectedProduct) {
        throw new Error("Please choose a product first.");
      }

      if (isStaticEnrollmentRuntime || !razorpayReady) {
        openEnrollmentMail(payload, selectedProduct);
      } else if (selectedProduct.type === "free") {
        await submitFreeEnrollment(payload);
      } else {
        await submitPaidEnrollment(payload);
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to continue enrollment.", true);
      if (enrollmentSubmit instanceof HTMLButtonElement) {
        enrollmentSubmit.disabled = false;
      }
    }
  });
}
