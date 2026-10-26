
/*
  STUDENT MANAGEMENT SYSTEM
  File: main.js

  Purpose:
  Initialize and connect the application's modules.
*/

import { initStudentRecords } from "./student-records.js";
import { initDashboard } from "./dashboard.js";

function showStartupError() {
  const status = document.getElementById("systemStatus");

  status.textContent =
    "The system could not start. Check the JavaScript files and browser console.";

  status.className = "status-message error";
}

function initializeApplication() {
  const status = document.getElementById("systemStatus");

  try {
    // Initialize student records first.
    initStudentRecords();

    // Initialize dashboard navigation and statistics.
    initDashboard();

    status.textContent = "System initialized successfully.";
    status.className = "status-message success";
  } catch (error) {
    console.error("Application initialization failed:", error);
    showStartupError();
  }
}

// Start the application after the HTML document is ready.
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeApplication,
    { once: true }
  );
} else {
  initializeApplication();
}
