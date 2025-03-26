export const validateRegistration = (givenName: string, lastName: string, email: string, phone: string, password: string, confirmPassword: string, birthDate: string, gender: string) => {
    const errors: Record<string, string> = {};

    // Validate given name
    if (!givenName.trim()) {
        errors.givenName = "Given name is required";
    } else if (givenName.length < 2) {
        errors.givenName = "Given name must be at least 2 characters long";
    }

    // Validate family name
    if (!lastName.trim()) {
        errors.lastName = "Family name is required";
    } else if (lastName.length < 2) {
        errors.lastName = "Family name must be at least 2 characters long";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
    }

    // Validate phone
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phone.trim()) {
        errors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
        errors.phoneNumber = "Please enter a valid phone number";
    }

    // Validate password
    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Validate confirm password
    if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match";
    }

    // Validate date of birth
    const dobDate = new Date(birthDate);
    const today = new Date();
    const minAge = 13; // Minimum age requirement
    const maxAge = 120; // Maximum reasonable age
    
    if (!birthDate || birthDate.length == 0) {
        errors.birthDate = "Date of birth is required";
    } else if (isNaN(dobDate.getTime())) {
        errors.birthDate = "Please enter a valid date";
    } else {
        const age = today.getFullYear() - dobDate.getFullYear();
        if (age < minAge) {
            errors.birthDate = `You must be at least ${minAge} years old`;
        } else if (age > maxAge) {
            errors.birthDate = "Please enter a valid date of birth";
        }
    }

    // Validate gender
    const validGenders = ["male", "female", "other", "prefer not to say"];
    if (!gender) {
        errors.gender = "Gender is required";
    } else if (!validGenders.includes(gender.toLowerCase())) {
        errors.gender = "Please select a valid gender option";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};