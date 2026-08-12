import { Student } from "../models/student";

import {
    isValidAge,
    isValidEmail,
    isValidMarks,
    isValidText
} from "../utils/validation";

export type StudentResult = "Pass" | "Fail";

export interface StudentStatistics {
    totalStudents: number;
    passedStudents: number;
    failedStudents: number;
    averageMarks: number;
    topScorers: Student[];
}

export class StudentService {

    // Store all students
    private students: Student[] = [];

    // ID for next student
    private nextId: number = 1;


    // Add a new student
    addStudent(data: Omit<Student, "id">): Student {

        // Check name
        if (!isValidText(data.name)) {
            throw new Error("Student name is required.");
        }

        // Check email
        if (!isValidEmail(data.email)) {
            throw new Error("Invalid email address.");
        }

        // Check duplicate email
        const emailExists = this.students.some(
            student =>
                student.email.toLowerCase() ===
                data.email.toLowerCase()
        );

        if (emailExists) {
            throw new Error("A student with this email already exists.");
        }

        // Check age
        if (!isValidAge(data.age)) {
            throw new Error(
                "Age must be a positive whole number between 1 and 120."
            );
        }

        // Check course
        if (!isValidText(data.course)) {
            throw new Error("Course is required.");
        }

        // Check marks
        if (!isValidMarks(data.marks)) {
            throw new Error("Marks must be between 0 and 100.");
        }

        // Create student
        const newStudent: Student = {
            id: this.nextId++,
            name: data.name.trim(),
            email: data.email.trim(),
            age: data.age,
            course: data.course.trim(),
            marks: data.marks
        };

        // Save student
        this.students.push(newStudent);

        return newStudent;
    }


    // Get all students
    getAllStudents(): Student[] {
        return [...this.students];
    }


    // Find student by ID
    findStudentById(id: number): Student {

        const student = this.students.find(
            student => student.id === id
        );

        // Student not found
        if (!student) {
            throw new Error(`Student with ID ${id} not found.`);
        }

        return student;
    }


    // Update student
    updateStudent(
        id: number,
        data: Partial<Omit<Student, "id">>
    ): Student {

        // Find student first
        const student = this.findStudentById(id);

        // Check name
        if (
            data.name !== undefined &&
            !isValidText(data.name)
        ) {
            throw new Error("Student name is required.");
        }

        // Check email
        if (
            data.email !== undefined &&
            !isValidEmail(data.email)
        ) {
            throw new Error("Invalid email address.");
        }

        // Check duplicate email
        if (data.email !== undefined) {

            const emailExists = this.students.some(
                currentStudent =>
                    currentStudent.id !== id &&
                    currentStudent.email.toLowerCase() ===
                    data.email!.toLowerCase()
            );

            if (emailExists) {
                throw new Error(
                    "A student with this email already exists."
                );
            }
        }

        // Check age
        if (
            data.age !== undefined &&
            !isValidAge(data.age)
        ) {
            throw new Error(
                "Age must be a positive whole number between 1 and 120."
            );
        }

        // Check course
        if (
            data.course !== undefined &&
            !isValidText(data.course)
        ) {
            throw new Error("Course is required.");
        }

        // Check marks
        if (
            data.marks !== undefined &&
            !isValidMarks(data.marks)
        ) {
            throw new Error("Marks must be between 0 and 100.");
        }

        // Update name
        if (data.name !== undefined) {
            student.name = data.name.trim();
        }

        // Update email
        if (data.email !== undefined) {
            student.email = data.email.trim();
        }

        // Update age
        if (data.age !== undefined) {
            student.age = data.age;
        }

        // Update course
        if (data.course !== undefined) {
            student.course = data.course.trim();
        }

        // Update marks
        if (data.marks !== undefined) {
            student.marks = data.marks;
        }

        return student;
    }


    // Delete student
    deleteStudent(id: number): Student {

        // Find student index
        const index = this.students.findIndex(
            student => student.id === id
        );

        // Student not found
        if (index === -1) {
            throw new Error(`Student with ID ${id} not found.`);
        }

        // Get student before deleting
        const deletedStudent = this.students[index];

        // Remove student
        this.students.splice(index, 1);

        return deletedStudent;
    }


    // Search students
    searchStudents(keyword: string): Student[] {

        // Return empty if keyword is empty
        if (!isValidText(keyword)) {
            return [];
        }

        const searchValue = keyword.trim().toLowerCase();

        // Search by name, email or course
        return this.students.filter(student =>
            student.name.toLowerCase().includes(searchValue) ||
            student.email.toLowerCase().includes(searchValue) ||
            student.course.toLowerCase().includes(searchValue)
        );
    }


    // Filter students by course
    filterByCourse(course: string): Student[] {

        if (!isValidText(course)) {
            return [];
        }

        const courseName = course.trim().toLowerCase();

        return this.students.filter(
            student =>
                student.course.toLowerCase() === courseName
        );
    }


    // Filter students by result
    filterByResult(result: StudentResult): Student[] {

        // Passed students
        if (result === "Pass") {
            return this.students.filter(
                student => student.marks >= 40
            );
        }

        // Failed students
        if (result === "Fail") {
            return this.students.filter(
                student => student.marks < 40
            );
        }

        return [];
    }


    // Get student statistics
    getStatistics(): StudentStatistics {

        // Total students
        const totalStudents = this.students.length;

        // Count passed students
        const passedStudents = this.students.filter(
            student => student.marks >= 40
        ).length;

        // Count failed students
        const failedStudents = this.students.filter(
            student => student.marks < 40
        ).length;

        // Add all marks
        const totalMarks = this.students.reduce(
            (sum, student) => sum + student.marks,
            0
        );

        // Calculate average marks
        const averageMarks =
            totalStudents === 0
                ? 0
                : totalMarks / totalStudents;

        let topScorers: Student[] = [];

        // Find top scorer
        if (totalStudents > 0) {

            const highestMarks = Math.max(
                ...this.students.map(
                    student => student.marks
                )
            );

            // Get all students with highest marks
            topScorers = this.students.filter(
                student => student.marks === highestMarks
            );
        }

        return {
            totalStudents,
            passedStudents,
            failedStudents,
            averageMarks,
            topScorers
        };
    }
}