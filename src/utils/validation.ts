export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}

export function isValidAge(age: number): boolean {
    return Number.isInteger(age) && age > 0 && age <= 120;
}

export function isValidMarks(marks: number): boolean {
    return marks >= 0 && marks <= 100;
}

export function isValidText(value: string): boolean {
    return value.trim().length > 0;
}