import { Student } from "../models/student";

import {
    isValidAge,
    isValidEmail,
    isValidMarks,
    isValidText
} from "../utils/validation";


export class StudentService {

    private students: Student[] = [];

    private nextId: number = 1;


    // CREATE
    addStudent(data: Omit<Student, "id">): Student {

        // Validate name
        if (!isValidText(data.name)) {
            throw new Error("Student name is required.");
        }

        // Validate email
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
            throw new Error(
                "A student with this email already exists."
            );
        }

        // Validate age
        if (!isValidAge(data.age)) {
            throw new Error(
                "Age must be a positive whole number between 1 and 120."
            );
        }

        // Validate course
        if (!isValidText(data.course)) {
            throw new Error("Course is required.");
        }

        // Validate marks
        if (!isValidMarks(data.marks)) {
            throw new Error(
                "Marks must be between 0 and 100."
            );
        }

        // Create student
        const newStudent: Student = {
            id: this.nextId,
            name: data.name.trim(),
            email: data.email.trim(),
            age: data.age,
            course: data.course.trim(),
            marks: data.marks
        };

        // Store student in memory
        this.students.push(newStudent);

        // Prepare next unique ID
        this.nextId++;

        return newStudent;
    }


    // READ ALL
    getAllStudents(): Student[] {
        return this.students;
    }


    // READ BY ID
    findStudentById(id: number): Student | undefined {

        return this.students.find(
            student => student.id === id
        );
    }


    // UPDATE
    updateStudent(
        id: number,
        data: Partial<Omit<Student, "id">>
    ): Student {

        const student = this.findStudentById(id);

        if (!student) {
            throw new Error(
                `Student with ID ${id} not found.`
            );
        }


        // Update name
        if (data.name !== undefined) {

            if (!isValidText(data.name)) {
                throw new Error(
                    "Student name is required."
                );
            }

            student.name = data.name.trim();
        }


        // Update email
        if (data.email !== undefined) {

            if (!isValidEmail(data.email)) {
                throw new Error(
                    "Invalid email address."
                );
            }

            const normalizedEmail =
                data.email.trim().toLowerCase();

            const emailExists = this.students.some(
                otherStudent =>
                    otherStudent.id !== id &&
                    otherStudent.email
                        .toLowerCase() === normalizedEmail
            );

            if (emailExists) {
                throw new Error(
                    "A student with this email already exists."
                );
            }

            student.email = data.email.trim();
        }


        // Update age
        if (data.age !== undefined) {

            if (!isValidAge(data.age)) {
                throw new Error(
                    "Age must be a positive whole number between 1 and 120."
                );
            }

            student.age = data.age;
        }


        // Update course
        if (data.course !== undefined) {

            if (!isValidText(data.course)) {
                throw new Error(
                    "Course is required."
                );
            }

            student.course = data.course.trim();
        }


        // Update marks
        if (data.marks !== undefined) {

            if (!isValidMarks(data.marks)) {
                throw new Error(
                    "Marks must be between 0 and 100."
                );
            }

            student.marks = data.marks;
        }


        return student;
    }


    // DELETE
    deleteStudent(id: number): boolean {

        const index = this.students.findIndex(
            student => student.id === id
        );

        if (index === -1) {
            throw new Error(
                `Student with ID ${id} not found.`
            );
        }

        this.students.splice(index, 1);

        return true;
    }
}