export function isValidEmail(email: string): boolean {
    return email.includes("@") && email.includes(".");
}

export function isValidAge(age: number): boolean {
    return age > 0 && age <= 120;
}

export function isValidmarks(marks: number): boolean {
    return marks >= 0 && marks <= 100;
}
