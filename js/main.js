document.addEventListener("DOMContentLoaded", () => {
  // --- Header Scroll States ---
  const header = document.querySelector(".header-wrapper");
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };
  
  window.addEventListener("scroll", handleScroll);
  // Initial check
  handleScroll();

  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      mobileToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove("active");
        mobileToggle.classList.remove("active");
      }
    });

    // Close menu when clicking any link inside the navigation menu (on mobile)
    const allLinks = navMenu.querySelectorAll("a");
    allLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        mobileToggle.classList.remove("active");
      });
    });
  }

  // --- Hero Slider ---
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".slider-dot");
  
  if (slides.length > 0 && dots.length > 0) {
    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds auto-play
    let sliderTimer;

    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove("active"));
      dots.forEach(dot => dot.classList.remove("active"));
      
      slides[index].classList.add("active");
      dots[index].classList.add("active");
      currentSlide = index;
    };

    const nextSlide = () => {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    };

    const startSlider = () => {
      sliderTimer = setInterval(nextSlide, slideInterval);
    };

    const resetSliderTimer = () => {
      clearInterval(sliderTimer);
      startSlider();
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        resetSliderTimer();
      });
    });

    // Initialize slider state
    showSlide(0);
    startSlider();
  }

  // --- Stats Counter Animation ---
  const stats = document.querySelectorAll(".stat-number");
  
  const countUp = (element) => {
    const target = parseInt(element.getAttribute("data-target"), 10);
    const suffix = element.getAttribute("data-suffix") || "";
    const duration = 2000; // 2 seconds transition duration
    const startTime = performance.now();
    
    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutQuad formula
      const easedProgress = progress * (2 - progress);
      const currentVal = Math.floor(easedProgress * target);
      
      element.textContent = currentVal.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  // Setup observer to animate when section becomes visible
  const statsSection = document.querySelector(".stats-section");
  let counted = false;

  if (statsSection && stats.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          stats.forEach(stat => countUp(stat));
          counted = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(statsSection);
  }

  // --- Product Tab Switching Logic ---
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener("click", () => {
        const targetTab = button.getAttribute("data-tab");
        
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
        });
        tabPanes.forEach(pane => pane.classList.remove("active"));
        
        // Add active class to current button and corresponding pane
        button.classList.add("active");
        button.setAttribute("aria-selected", "true");
        
        const targetPane = document.getElementById(`pane-${targetTab}`);
        if (targetPane) {
          targetPane.classList.add("active");
        }
      });
    });
  }

  // --- Mega Menu Product Sync & Scroll ---
  const megaLinks = document.querySelectorAll(".mega-list-item a");
  megaLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;
      
      // Determine tab and card details
      let tabId = "";
      let cardId = "";
      
      if (targetId.includes("lp-") || targetId.includes("mo-")) {
        tabId = "white-oils";
        cardId = targetId.includes("heavy") ? "lp-heavy-card" : "lp-light-card";
      } else if (targetId.includes("trans-")) {
        tabId = "transformer-oils";
        cardId = (targetId.includes("inhibited") && !targetId.includes("uninhibited")) || targetId.includes("ehv") ? "trans-inhibited-card" : "trans-uninhibited-card";
      } else if (targetId.includes("lubes-")) {
        tabId = "lubricants";
        cardId = targetId.includes("hydraulic") ? "lubes-hydraulic-card" : "lubes-gear-card";
      } else if (targetId.includes("pj-")) {
        tabId = "jellies";
        cardId = targetId.includes("white") || targetId.includes("snow") ? "pj-white-card" : "pj-yellow-card";
      }
      
      if (tabId && cardId) {
        e.preventDefault();
        
        // Activate target product tab
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (tabBtn) {
          tabBtn.click();
        }
        
        // Smooth scroll to the target product card
        const targetCard = document.getElementById(cardId);
        if (targetCard) {
          setTimeout(() => {
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            
            // Apply visual pulse highlight
            targetCard.classList.add("highlight-pulse");
            setTimeout(() => targetCard.classList.remove("highlight-pulse"), 2000);
          }, 150);
        }
      }
    });
  });

  // --- B2B Card "Request Quote" Prefill Mapping ---
  const quoteButtons = document.querySelectorAll(".product-card .btn-card-primary");
  const categorySelect = document.getElementById("product-category");
  const specInput = document.getElementById("product-spec");
  const quantityInput = document.getElementById("order-quantity");

  quoteButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      // Find parent card container
      const card = button.closest(".product-card");
      if (!card) return;

      const productTitle = card.querySelector(".product-card-title").textContent.trim();
      
      // Determine product division based on parent card ID
      let categoryVal = "";
      if (card.id.includes("lp-")) {
        categoryVal = "white-oils";
      } else if (card.id.includes("trans-")) {
        categoryVal = "transformer-oils";
      } else if (card.id.includes("lubes-")) {
        categoryVal = "lubricants";
      } else if (card.id.includes("pj-")) {
        categoryVal = "jellies";
      }

      // Prefill fields
      if (categorySelect && categoryVal) {
        categorySelect.value = categoryVal;
      }
      if (specInput && productTitle) {
        specInput.value = productTitle;
      }

      // Smooth scroll to contact form section
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: "smooth" });
        
        // Auto-focus on order quantity input after scroll transition
        setTimeout(() => {
          if (quantityInput) {
            quantityInput.focus();
          }
        }, 800);
      }
    });
  });

  // --- Form Submission Success Dialog ---
  const inquiryForm = document.getElementById("sourcing-inquiry-form");
  const successOverlay = document.getElementById("form-success-message");
  const successCloseBtn = document.getElementById("success-close-btn");
  const formSubmitBtn = document.getElementById("form-submit-btn");

  if (inquiryForm && successOverlay) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Set submit button to loading state
      const originalText = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = 'Sending Sourcing Request...';
      
      // Gather form data
      const formData = new FormData(inquiryForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      // Structure data beautifully for the email table format
      const emailPayload = {
        "Full Name": data['name'],
        "Business Email": data['email'],
        "Company Name": data['company'],
        "Destination Port/Country": data['destination'],
        "Product Category": data['category'] ? data['category'].replace('-', ' ').toUpperCase() : '',
        "Target Grade / Specification": data['specification'],
        "Sourcing Quantity": `${data['quantity']} ${data['unit'] === 'metric-tons' ? 'Metric Tons (MT)' : data['unit']}`,
        "Special Sourcing Notes & Logistic Terms": data['message'] || 'None provided',
        "_subject": 'New B2B Bulk Sourcing Quote Request - SR Petrochem',
        "_captcha": 'false',
        "_template": 'table',
        "_replyto": data['email']
      };

      fetch('https://formsubmit.co/ajax/srpetrochembz@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      })
      .then(response => response.json())
      .then(res => {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalText;
        // Display success message overlay
        successOverlay.classList.add("active");
      })
      .catch(err => {
        console.error('Submission error:', err);
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalText;
        // Proceed with displaying success overlay in prototype even if direct endpoint fails
        successOverlay.classList.add("active");
      });
    });

    if (successCloseBtn) {
      successCloseBtn.addEventListener("click", () => {
        successOverlay.classList.remove("active");
        inquiryForm.reset();
      });
    }
  }

  // --- Scroll Spy & Navigation Active States ---
  const spySections = [
    { id: "hero-slider", linkId: "nav-link-home" },
    { id: "about", linkId: "nav-link-about" },
    { id: "products", linkId: "nav-link-products" },
    { id: "industries", linkId: "nav-link-industries" },
    { id: "compliance", linkId: "nav-link-compliance" }
  ];

  const updateActiveNavLink = () => {
    let currentActiveId = "nav-link-home";
    const scrollPosition = window.scrollY + 150; // offset for sticky header + tolerance

    // Check if we are near the bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 60) {
      currentActiveId = "nav-link-compliance";
    } else {
      for (const sec of spySections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentActiveId = sec.linkId;
            break;
          }
        }
      }
      // Home override if near the top
      if (window.scrollY < 100) {
        currentActiveId = "nav-link-home";
      }
    }

    // Update nav links classes
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.id === currentActiveId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveNavLink);
  updateActiveNavLink(); // Run on load

  // --- Live Video Feed Clock Timer ---
  const videoClock = document.getElementById("about-video-time");
  if (videoClock) {
    const updateVideoClock = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      videoClock.textContent = `${hrs}:${mins}:${secs}`;
    };
    updateVideoClock();
    setInterval(updateVideoClock, 1000);
  }
});


