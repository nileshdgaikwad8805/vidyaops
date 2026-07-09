document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("volunteer-form");
  const submitBtn = document.getElementById("submit-btn");
  const errorBox = document.getElementById("form-error");
  const successBox = document.getElementById("application-success");

  if (!form) return;

  const cfg = window.VIDYAOPS_CONFIG || {};
  const API_BASE = cfg.apiBase || (cfg.runtimeMode === "static" ? "" : "");
  const isStatic = cfg.runtimeMode === "static" && !API_BASE;

  // Build a mailto link from form data (files excluded — can't attach via mailto)
  const buildMailto = (formData) => {
    const fields = {
      name: "Name",
      email: "Email",
      phone: "Phone",
      linkedin_url: "LinkedIn",
      topic_of_choice: "Topic of Choice",
    };
    const lines = [];
    for (const [key, label] of Object.entries(fields)) {
      const val = String(formData.get(key) || "").trim();
      if (val) lines.push(`${label}: ${val}`);
    }
    lines.push("", "(Files not included — please send resume and photo separately via WhatsApp or as a reply.)");
    const subject = encodeURIComponent("Volunteer Trainer Application");
    const body = encodeURIComponent(lines.join("\n"));
    return `mailto:info@vidyaops.com?subject=${subject}&body=${body}`;
  };

  const openMailto = (href) => {
    var a = document.createElement("a");
    a.href = href;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle file input visual feedback
  document.querySelectorAll('input[type="file"]').forEach(function (input) {
    input.addEventListener("change", function () {
      var oldLabel = this.parentElement.querySelector(".file-name-label");
      if (oldLabel) oldLabel.remove();
      if (this.files && this.files.length > 0) {
        var file = this.files[0];
        var span = document.createElement("div");
        span.className = "file-name-label";
        span.style.cssText = "margin-top:0.75rem;color:#10b981;font-weight:600";
        span.textContent = " Selected: " + file.name + " (" + (file.size / 1024 / 1024).toFixed(2) + " MB)";
        this.parentElement.appendChild(span);
        this.parentElement.style.borderColor = "#10b981";
      }
    });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorBox.style.display = "none";
    // Remove any previous fallback buttons
    var oldFallback = document.getElementById("volunteer-fallback");
    if (oldFallback) oldFallback.remove();

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    var formData = new FormData(form);

    if (isStatic) {
      openMailto(buildMailto(formData));
      form.style.display = "none";
      successBox.style.display = "block";
      successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      var response = await fetch(API_BASE + "/api/volunteer/apply", {
        method: "POST",
        body: formData,
      });

      var result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application.");
      }

      form.style.display = "none";
      successBox.style.display = "block";
      successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      var mailtoHref = buildMailto(formData);

      errorBox.innerHTML =
        "<strong>Could not reach the server.</strong> " +
        "Use one of the options below to send your application directly.";
      errorBox.style.display = "block";
      errorBox.scrollIntoView({ behavior: "smooth", block: "center" });

      var fallback = document.createElement("div");
      fallback.id = "volunteer-fallback";
      fallback.style.cssText = "margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:1rem;justify-content:center";

      var emailBtn = document.createElement("a");
      emailBtn.href = mailtoHref;
      emailBtn.className = "button button--secondary";
      emailBtn.textContent = "Send via Email";
      emailBtn.target = "_blank";

      var waBtn = document.createElement("a");
      waBtn.href = "https://wa.me/919503685152?text=" + encodeURIComponent(
        "Hello, I want to apply as a volunteer trainer.\n\n" +
        "Name: " + (formData.get("name") || "") + "\n" +
        "Email: " + (formData.get("email") || "") + "\n" +
        "Phone: " + (formData.get("phone") || "") + "\n" +
        "LinkedIn: " + (formData.get("linkedin_url") || "") + "\n" +
        "Topic: " + (formData.get("topic_of_choice") || "")
      );
      waBtn.className = "button";
      waBtn.textContent = "Send via WhatsApp";
      waBtn.target = "_blank";
      waBtn.rel = "noreferrer";

      fallback.appendChild(emailBtn);
      fallback.appendChild(waBtn);
      form.appendChild(fallback);

      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Application";
    }
  });
});
