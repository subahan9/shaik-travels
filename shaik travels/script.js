(function () {
    "use strict";

    const WHATSAPP_NUMBER = "919515412875";
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    const navLinks = document.querySelectorAll(".nav-link");
    const bookingForm = document.getElementById("booking-form");
    const travelDateInput = document.getElementById("travel-date");
    const copyrightYear = document.getElementById("copyright-year");
    const routeEnquireButtons = document.querySelectorAll(".route-enquire");

    // Set copyright year
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // Set min date for travel date to today
    function setMinDate() {
        if (!travelDateInput) return;
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        travelDateInput.min = `${yyyy}-${mm}-${dd}`;
    }
    setMinDate();

    // Mobile menu toggle
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        // Close menu when clicking a nav link
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Close menu on Escape
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && mainNav.classList.contains("open")) {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.focus();
            }
        });
    }

    // Header scroll effect
    function handleScroll() {
        if (!header) return;
        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Active nav link based on section visibility
    const sections = document.querySelectorAll("section[id]");

    function updateActiveNav() {
        const scrollPos =
            window.scrollY + (header ? header.offsetHeight + 40 : 100);

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + id) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();

    // Smooth scroll for anchor links (extra support)
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#" || targetId === "") return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Route enquire buttons – open WhatsApp with route details
    routeEnquireButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const route = btn.getAttribute("data-route") || "";
            const fare = btn.getAttribute("data-fare") || "";
            let message = "Hello Shaik Travels,\n\n";
            message += "I would like to enquire about the following route:\n";
            message += "Route: " + route + "\n";
            if (fare && fare !== "Contact for Price") {
                message += "Listed starting fare: " + fare + "\n";
            } else {
                message += "Please share the fare details.\n";
            }
            message +=
                "\nPlease confirm availability and final price. Thank you.";
            const url =
                "https://wa.me/" +
                WHATSAPP_NUMBER +
                "?text=" +
                encodeURIComponent(message);
            window.open(url, "_blank", "noopener,noreferrer");
        });
    });

    // Form validation helpers
    function showError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (input) input.classList.add("error");
        if (errorEl) errorEl.textContent = message;
    }

    function clearError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (input) input.classList.remove("error");
        if (errorEl) errorEl.textContent = "";
    }

    function clearAllErrors() {
        clearError("customer-name", "error-name");
        clearError("mobile-number", "error-mobile");
        clearError("pickup-location", "error-pickup");
        clearError("drop-location", "error-drop");
        clearError("travel-date", "error-date");
    }

    function isValidMobile(value) {
        // Accept Indian mobile: 10 digits, optional +91 or 0 prefix
        const cleaned = value.replace(/[\s\-()]/g, "");
        const patterns = [
            /^[6-9]\d{9}$/,
            /^91[6-9]\d{9}$/,
            /^\+91[6-9]\d{9}$/,
            /^0[6-9]\d{9}$/,
        ];
        return patterns.some(function (p) {
            return p.test(cleaned);
        });
    }

    function isValidDate(value) {
        if (!value) return false;
        const selected = new Date(value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today && !isNaN(selected.getTime());
    }

    function formatDateForMessage(value) {
        if (!value) return "";
        const d = new Date(value + "T00:00:00");
        if (isNaN(d.getTime())) return value;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return day + "/" + month + "/" + year;
    }

    // Booking form submit
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            clearAllErrors();

            const name = (
                document.getElementById("customer-name").value || ""
            ).trim();
            const mobile = (
                document.getElementById("mobile-number").value || ""
            ).trim();
            const pickup = (
                document.getElementById("pickup-location").value || ""
            ).trim();
            const drop = (
                document.getElementById("drop-location").value || ""
            ).trim();
            const travelDate =
                document.getElementById("travel-date").value || "";
            const vehicleType =
                document.getElementById("vehicle-type").value || "";
            const message = (
                document.getElementById("additional-message").value || ""
            ).trim();

            let valid = true;

            if (!name) {
                showError(
                    "customer-name",
                    "error-name",
                    "Please enter your name.",
                );
                valid = false;
            }

            if (!mobile) {
                showError(
                    "mobile-number",
                    "error-mobile",
                    "Please enter your mobile number.",
                );
                valid = false;
            } else if (!isValidMobile(mobile)) {
                showError(
                    "mobile-number",
                    "error-mobile",
                    "Enter a valid 10-digit Indian mobile number.",
                );
                valid = false;
            }

            if (!pickup) {
                showError(
                    "pickup-location",
                    "error-pickup",
                    "Please enter pickup location.",
                );
                valid = false;
            }

            if (!drop) {
                showError(
                    "drop-location",
                    "error-drop",
                    "Please enter drop location.",
                );
                valid = false;
            }

            if (!travelDate) {
                showError(
                    "travel-date",
                    "error-date",
                    "Please select travel date.",
                );
                valid = false;
            } else if (!isValidDate(travelDate)) {
                showError(
                    "travel-date",
                    "error-date",
                    "Travel date cannot be in the past.",
                );
                valid = false;
            }

            if (!valid) {
                const firstError = bookingForm.querySelector(".error");
                if (firstError) firstError.focus();
                return;
            }

            // Build WhatsApp message
            let waMessage = "Hello Shaik Travels,\n\n";
            waMessage += "I would like to book / enquire about a trip.\n\n";
            waMessage += "Name: " + name + "\n";
            waMessage += "Mobile: " + mobile + "\n";
            waMessage += "Pickup: " + pickup + "\n";
            waMessage += "Drop: " + drop + "\n";
            waMessage +=
                "Travel Date: " + formatDateForMessage(travelDate) + "\n";
            if (vehicleType) {
                waMessage += "Preferred Vehicle: " + vehicleType + "\n";
            }
            if (message) {
                waMessage += "Message: " + message + "\n";
            }
            waMessage += "\nPlease confirm availability and fare. Thank you.";

            const url =
                "https://wa.me/" +
                WHATSAPP_NUMBER +
                "?text=" +
                encodeURIComponent(waMessage);
            window.open(url, "_blank", "noopener,noreferrer");
        });

        // Clear errors on input
        [
            "customer-name",
            "mobile-number",
            "pickup-location",
            "drop-location",
            "travel-date",
        ].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener("input", function () {
                    const errorId =
                        "error-" +
                        (id === "customer-name"
                            ? "name"
                            : id === "mobile-number"
                              ? "mobile"
                              : id === "pickup-location"
                                ? "pickup"
                                : id === "drop-location"
                                  ? "drop"
                                  : "date");
                    clearError(id, errorId);
                });
            }
        });

        // Reset form also clears errors
        bookingForm.addEventListener("reset", function () {
            setTimeout(clearAllErrors, 0);
        });
    }

    // Image fallback: hide broken images gracefully
    document.querySelectorAll("img").forEach(function (img) {
        img.addEventListener("error", function () {
            this.style.display = "none";
            if (this.parentElement) {
                this.parentElement.style.background =
                    "var(--color-bg-alt, #f0f0f0)";
            }
        });
    });
})();
(function () {
    const tabs = document.querySelectorAll(".fleet-tab");
    const cards = document.querySelectorAll(".fleet-grid-tabs .fleet-card");
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            const filter = tab.getAttribute("data-filter");
            tabs.forEach(function (item) {
                item.classList.toggle("active", item === tab);
            });
            cards.forEach(function (card) {
                card.classList.toggle(
                    "is-hidden",
                    filter !== "all" &&
                        card.getAttribute("data-seats") !== filter,
                );
            });
        });
    });
})();
