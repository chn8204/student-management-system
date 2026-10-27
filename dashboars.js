
/*
  STUDENT MANAGEMENT SYSTEM
  File: dashboard.js

  Purpose:
  Handle navigation and update dashboard statistics.
*/

import { getStudentCount } from "./student-records.js";

export function initDashboard() {
  const pages = document.querySelectorAll(".page");
  const navigationButtons = document.querySelectorAll("[data-page]");

  const studentCount = document.getElementById("studentCount");
  const goToStudentsButton = document.getElementById("goToStudents");
  const viewRecordsButton = document.getElementById("viewRecordsButton");

  /*
    Display the selected page and update the active navigation button.
  */
  function showPage(pageId) {
    pages.forEach(page => {
      page.hidden = page.id !== pageId;
    });

    navigationButtons.forEach(button => {
      const isActive = button.dataset.page === pageId;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  /*
    Navigate when a navigation button is clicked.
  */
  navigationButtons.forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

  /*
    The dashboard buttons also open the student records page.
  */
  goToStudentsButton.addEventListener("click", () => {
    showPage("studentsPage");
  });

  viewRecordsButton.addEventListener("click", () => {
    showPage("studentsPage");
  });

  /*
    Update the total number of saved student records.
  */
  function updateStudentCount() {
    studentCount.textContent = getStudentCount();
  }

  /*
    Listen for changes made by the student records module.
  */
  document.addEventListener("studentsUpdated", updateStudentCount);

  /*
    Initialize the dashboard.
  */
  updateStudentCount();
  showPage("dashboardPage");
}
