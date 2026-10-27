
/*
  STUDENT MANAGEMENT SYSTEM
  File: student-records.js

  Purpose:
  Add, display, search, delete, and store student records.
*/

import { validateStudent } from "./validation.js";

const STORAGE_KEY = "student-management-records";

/* =========================
   1. STORAGE FUNCTIONS
========================= */

// Get the saved student records.
export function getStudents() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return [];
    }

    const students = JSON.parse(savedData);

    return Array.isArray(students) ? students : [];
  } catch (error) {
    console.error("Could not read student records:", error);
    return [];
  }
}

// Save the student records.
function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return true;
  } catch (error) {
    console.error("Could not save student records:", error);
    showMessage(
      "Could not save the record. Check browser storage.",
      true
    );
    return false;
  }
}

// Return the total number of saved students.
export function getStudentCount() {
  return getStudents().length;
}

/* =========================
   2. STATUS MESSAGES
========================= */

function showMessage(message, isError = false) {
  const status = document.getElementById("systemStatus");

  status.textContent = message;
  status.className = isError
    ? "status-message error"
    : "status-message success";
}

/* =========================
   3. RENDER STUDENT TABLE
========================= */

function renderStudents() {
  const tbody = document.getElementById("studentTableBody");
  const searchInput = document.getElementById("searchInput");
  const recordsSummary = document.getElementById("recordsSummary");

  const query = searchInput.value.trim().toLowerCase();

  // Filter records based on the search text.
  const filteredStudents = getStudents()
    .filter(student => {
      const searchableValues = [
        student.studentId,
        student.fullName,
        student.course,
        student.yearLevel,
        student.section
      ];

      return searchableValues.some(value =>
        String(value).toLowerCase().includes(query)
      );
    })
    .sort((first, second) =>
      first.fullName.localeCompare(second.fullName, undefined, {
        sensitivity: "base"
      })
    );

  // Clear the existing table.
  tbody.replaceChildren();

  // Update the result count.
  recordsSummary.textContent =
    `${filteredStudents.length} student(s) found`;

  // Show a message if no records match.
  if (filteredStudents.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 6;
    cell.className = "empty-state";

    cell.textContent = query
      ? "No students match your search."
      : "No student records yet.";

    row.appendChild(cell);
    tbody.appendChild(row);

    return;
  }

  // Display each student.
  for (const student of filteredStudents) {
    const row = document.createElement("tr");

    const values = [
      student.studentId,
      student.fullName,
      student.course,
      student.yearLevel,
      student.section
    ];

    // Create table cells safely.
    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    }

    // Create the delete button.
    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";

    deleteButton.setAttribute(
      "aria-label",
      `Delete student ${student.studentId}`
    );

    deleteButton.addEventListener("click", () => {
      deleteStudent(student.studentId);
    });

    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  }
}

/* =========================
   4. ADD STUDENT
========================= */

function addStudent(student) {
  // Validate the submitted information.
  const validation = validateStudent(student);

  if (!validation.valid) {
    showMessage(validation.message, true);
    return false;
  }

  const students = getStudents();

  // Prevent duplicate student IDs.
  const duplicate = students.some(existingStudent =>
    existingStudent.studentId.toLowerCase() ===
    student.studentId.toLowerCase()
  );

  if (duplicate) {
    showMessage(
      "This student ID already exists. Please use a different ID.",
      true
    );

    return false;
  }

  // Add the new record.
  students.push(student);

  // Do not update the UI unless saving succeeds.
  if (!saveStudents(students)) {
    return false;
  }

  showMessage("Student record added successfully.");

  return true;
}

/* =========================
   5. DELETE STUDENT
========================= */

function deleteStudent(studentId) {
  const confirmed = window.confirm(
    `Are you sure you want to delete student ${studentId}?`
  );

  if (!confirmed) {
    return;
  }

  const students = getStudents();

  const updatedStudents = students.filter(
    student => student.studentId !== studentId
  );

  // Save first so the UI does not claim deletion succeeded
  // when browser storage fails.
  if (!saveStudents(updatedStudents)) {
    return;
  }

  renderStudents();

  // Notify the dashboard that the records changed.
  document.dispatchEvent(new Event("studentsUpdated"));

  showMessage("Student record deleted successfully.");
}

/* =========================
   6. INITIALIZE MODULE
========================= */

export function initStudentRecords() {
  const form = document.getElementById("studentForm");
  const searchInput = document.getElementById("searchInput");

  // Handle form submission.
  form.addEventListener("submit", event => {
    event.preventDefault();

    const student = {
      studentId: document.getElementById("studentId").value.trim(),
      fullName: document.getElementById("fullName").value.trim(),
      course: document.getElementById("course").value.trim(),
      yearLevel: document.getElementById("yearLevel").value,
      section: document.getElementById("section").value.trim()
    };

    const wasAdded = addStudent(student);

    if (!wasAdded) {
      return;
    }

    form.reset();
    renderStudents();

    // Tell other modules that the record count changed.
    document.dispatchEvent(new Event("studentsUpdated"));
  });

  // Update the table as the user types.
  searchInput.addEventListener("input", renderStudents);

  // Display existing saved records.
  renderStudents();
}
