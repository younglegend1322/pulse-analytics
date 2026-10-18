/* ========================================
   1. MOBILE NAVIGATION
======================================== */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navActions = document.querySelector(".nav-actions");

if (menuToggle && navLinks && navActions) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Open navigation menu" : "Close navigation menu",
    );

    navLinks.classList.toggle("is-open", !isExpanded);
    navActions.classList.toggle("is-open", !isExpanded);
  });

  // Close the mobile menu after selecting a navigation link.
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navActions.classList.remove("is-open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });

  // Close the mobile menu when switching back to desktop layout.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      navLinks.classList.remove("is-open");
      navActions.classList.remove("is-open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }
  });
}

/* ========================================
   2. AUTOMATIC COPYRIGHT YEAR
======================================== */

const yearElement = document.querySelector("#current-year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* ========================================
   3. SMOOTH SCROLLING FOR PAGE ANCHORS
======================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    // Ignore links that only contain "#".
    if (!targetId || targetId === "#") {
      return;
    }

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }
  });
});

/* ========================================
   4. DASHBOARD REVENUE CHART
======================================== */

const revenueChart = document.querySelector("#revenue-chart");
const revenueLine = document.querySelector("#revenue-line");
const revenueArea = document.querySelector("#revenue-area");
const revenuePoint = document.querySelector("#revenue-point");
const chartTooltip = document.querySelector("#chart-tooltip");
const chartLabels = document.querySelector("#chart-x-labels");

const chartPeriods = {
  daily: {
    labels: ["9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
    values: [5, 9, 7, 13, 11, 16, 14],
    revenue: "$2,840",
    description: "Sample daily revenue",
  },
  weekly: {
    labels: ["Apr 1", "Apr 7", "Apr 14", "Apr 21", "Apr 28"],
    values: [7, 11, 9, 15, 12, 18, 20],
    revenue: "$12,480",
    description: "Sample weekly revenue",
  },
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    values: [8, 10, 7, 14, 19, 16, 22],
    revenue: "$48,290",
    description: "Sample monthly revenue",
  },
};

function createSmoothPath(points) {
  if (points.length < 2) return "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const current = points[i];
    const middleX = (previous.x + current.x) / 2;

    path += ` C ${middleX} ${previous.y}, ${middleX} ${current.y}, ${current.x} ${current.y}`;
  }

  return path;
}

function updateRevenueChart(periodName) {
  const period = chartPeriods[periodName];

  if (
    !period ||
    !revenueChart ||
    !revenueLine ||
    !revenueArea ||
    !revenuePoint ||
    !chartTooltip ||
    !chartLabels
  ) {
    return;
  }

  const width = 600;
  const top = 20;
  const bottom = 200;
  const chartHeight = bottom - top;
  const minimum = Math.min(...period.values);
  const maximum = Math.max(...period.values);
  const range = maximum - minimum || 1;

  const points = period.values.map((value, index) => ({
    x: (index / (period.values.length - 1)) * width,
    y: bottom - ((value - minimum) / range) * chartHeight,
  }));

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${width} ${bottom} L 0 ${bottom} Z`;

  revenueLine.setAttribute("d", linePath);
  revenueArea.setAttribute("d", areaPath);

  const lastPoint = points[points.length - 1];

  revenuePoint.setAttribute("cx", lastPoint.x);
  revenuePoint.setAttribute("cy", lastPoint.y);

  chartTooltip.querySelector("strong").textContent = period.revenue;
  chartTooltip.querySelector("span").textContent = period.description;

  chartLabels.innerHTML = "";

  period.labels.forEach((label) => {
    const span = document.createElement("span");
    span.textContent = label;
    chartLabels.appendChild(span);
  });

  document.querySelectorAll("[data-period]").forEach((button) => {
    const isSelected = button.dataset.period === periodName;

    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

document.querySelectorAll("[data-period]").forEach((button) => {
  button.addEventListener("click", () => {
    updateRevenueChart(button.dataset.period);
  });
});

// Draw the default weekly chart.
updateRevenueChart("weekly");


/* ========================================
   5. DASHBOARD SIDEBAR NAVIGATION
======================================== */

const dashboardHeading = document.querySelector("#dashboard-heading");
const dashboardBreadcrumb = document.querySelector(".dashboard-breadcrumb");
const dashboardNavLinks = document.querySelectorAll(".dashboard-nav-link");

dashboardNavLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    // Update active sidebar link
    dashboardNavLinks.forEach((item) => {
      item.classList.remove("active");
      item.removeAttribute("aria-current");
    });

    link.classList.add("active");
    link.setAttribute("aria-current", "page");

    // Update dashboard heading
    const selectedView = link.dataset.view;

    if (dashboardHeading) {
      dashboardHeading.textContent = selectedView;
    }

    if (dashboardBreadcrumb) {
      dashboardBreadcrumb.textContent = `Dashboard / ${selectedView}`;
    }
  });
});


/* ========================================
   6. RECENT ACTIVITY INTERACTION
======================================== */

const viewActivityButton = document.querySelector("#view-activity");
const activityFeedback = document.querySelector("#activity-feedback");

if (viewActivityButton && activityFeedback) {
  viewActivityButton.addEventListener("click", () => {
    activityFeedback.textContent =
      "This preview contains three illustrative activity events. A complete activity history would require additional data and functionality.";
  });
}
