document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("volunteer-form");
  const submitBtn = document.getElementById("submit-btn");
  const errorBox = document.getElementById("form-error");
  const successBox = document.getElementById("application-success");

  if (!form) return;

  const API_BASE = window.VIDYAOPS_CONFIG?.apiBase || "";

  // Handle file input visual feedback
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', function(e) {
      const oldLabel = this.parentElement.querySelector('.file-name-label');
      if (oldLabel) oldLabel.remove();

      if (this.files && this.files.length > 0) {
        const file = this.files[0];
        const span = document.createElement('div');
        span.className = 'file-name-label';
        span.style.marginTop = '0.75rem';
        span.style.color = '#10b981';
        span.style.fontWeight = '600';
        span.innerHTML = `✅ Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        this.parentElement.appendChild(span);
        this.parentElement.style.borderColor = '#10b981';
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.style.display = "none";
    
    // Prevent double clicking
    submitBtn.disabled = true;
    submitBtn.textContent = "Uploading (Please Wait)...";

    try {
      // Use FormData to allow native handling of text + file uploads
      const formData = new FormData(form);

      const response = await fetch(`${API_BASE}/api/volunteer/apply`, {
        method: "POST",
        body: formData,
        // When using FormData, do NOT set Content-Type header manually.
        // The browser sets it automatically with the correct multipart boundary.
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application.");
      }

      // Success
      form.style.display = "none";
      successBox.style.display = "block";
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = "block";
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Application";
    }
  });
});
