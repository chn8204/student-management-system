
/*
  STUDENT MANAGEMENT SYSTEM
  File: validation.js

  Purpose:
  Validate student information before saving it.
*/

export function validateStudent(student) {
  if (
    student === null ||
    typeof student !== "object" ||
    Array.isArray(student)
  ) {
    return {
      valid: false,
      message: "Student information is required."
    };
  }

  const requiredFields = [
    ["Student ID", student.studentId],
    ["Full Name", student.fullName],
    ["Course", student.course],
    ["Year Level", student.yearLevel],
    ["Section", student.section]
  ];

  // Check whether required fields are empty.
  for (const [label, value] of requiredFields) {
    if (typeof value !== "string" || value.trim() === "") {
      return {
        valid: false,
        message: `${label} is required.`
      };
    }
  }

  // Check the student ID format.
  const studentId = student.studentId.trim();

  if (!/^[a-zA-Z0-9-]+$/.test(studentId)) {
    return {
      valid: false,
      message:
        "Student ID can only contain letters, numbers, and hyphens."
    };
  }

  // Check the maximum lengths.
  if (studentId.length > 30) {
    return {
      valid: false,
      message: "Student ID cannot exceed 30 characters."
    };
  }

  if (student.fullName.trim().length > 100) {
    return {
      valid: false,
      message: "Full name cannot exceed 100 characters."
    };
  }

  if (student.course.trim().length > 100) {
    return {
      valid: false,
      message: "Course cannot exceed 100 characters."
    };
  }

  if (student.section.trim().length > 50) {
    return {
      valid: false,
      message: "Section cannot exceed 50 characters."
    };
  }

  // Only allow the year levels provided by the form.
  const allowedYearLevels = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year"
  ];

  if (!allowedYearLevels.includes(student.yearLevel)) {
    return {
      valid: false,
      message: "Please select a valid year level."
    };
  }

  return {
    valid: true,
    message: "Student information is valid."
  };
}
