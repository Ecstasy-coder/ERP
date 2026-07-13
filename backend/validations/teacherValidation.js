 // ======================================
// Validate Teacher
// ======================================

const validateTeacher = (teacher) => {

    const errors = [];

    // Employee Code
    if (!teacher.employee_code || teacher.employee_code.trim() === "") {
        errors.push("Employee Code is required");
    }

    // Teacher Name
    if (!teacher.teacher_name || teacher.teacher_name.trim() === "") {
        errors.push("Teacher Name is required");
    }

    // Primary Mobile
    if (!teacher.primary_mobile || teacher.primary_mobile.trim() === "") {
        errors.push("Primary Mobile is required");
    }

    // Primary Email
    if (!teacher.primary_email || teacher.primary_email.trim() === "") {
        errors.push("Primary Email is required");
    }

    // Employee Role
    if (!teacher.employee_role || teacher.employee_role.trim() === "") {
        errors.push("Employee Role is required");
    }

    return {
        valid: errors.length === 0,
        errors
    };

};

module.exports = {
    validateTeacher
};