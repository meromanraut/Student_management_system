
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


    addStudent(data: Omit<Student, "id">): Student {

        if (!isValidText(data.name)) {
            throw new Error("Student name is required.");
        }
        if (!isValidEmail(data.email)) {
            throw new Error("Invalid email address.");
        }
        const emailExists = this.students.some(
            student =>
                student.email.toLowerCase() ===
                data.email.toLowerCase()
        );
        if (emailExists) {
            throw new Error("A student with this email already exists.");
        }
     
        if (!isValidAge(data.age)) {
            throw new Error(
                "Age must be a positive whole number between 1 and 120."
            );
        }

        if (!isValidText(data.course)) {
            throw new Error("Course is required.");
        }


 
        if (!isValidMarks(data.marks)) {
            throw new Error("Marks must be between 0 and 100.");
        }



        const newStudent: Student = {
            id: this.nextId,
            name: data.name.trim(),
            email: data.email.trim(),
            age: data.age,
            course: data.course.trim(),
            marks: data.marks
        };


      
        this.students.push(newStudent);


      
        this.nextId++;


        return newStudent;
    }

getAllStudents(): Student[] {
    return this.students;
}


findStudentById(id: number): Student | undefined {
    return this.students.find(
        student => student.id === id
    );
}


updateStudent(
    id: number,
    updates: Partial<Omit<Student, "id">>
): Student {

    // Find student
    const student = this.students.find(
        student => student.id === id
    );

    if (!student) {
        throw new Error(`Student with ID ${id} not found.`);
    }


    // Validate name
    if (updates.name !== undefined) {

        if (!isValidText(updates.name)) {
            throw new Error("Student name cannot be empty.");
        }

        student.name = updates.name.trim();
    }


    // Validate email
    if (updates.email !== undefined) {

        if (!isValidEmail(updates.email)) {
            throw new Error("Invalid email address.");
        }

        const newEmail = updates.email.toLowerCase();

        const emailExists = this.students.some(
            otherStudent =>
                otherStudent.id !== id &&
                otherStudent.email.toLowerCase() === newEmail
        );

        if (emailExists) {
            throw new Error(
                "Another student already uses this email."
            );
        }

        student.email = updates.email.trim();
    }


    // Validate age
    if (updates.age !== undefined) {

        if (!isValidAge(updates.age)) {
            throw new Error(
                "Age must be between 1 and 120."
            );
        }

        student.age = updates.age;
    }


    // Validate course
    if (updates.course !== undefined) {

        if (!isValidText(updates.course)) {
            throw new Error("Course cannot be empty.");
        }

        student.course = updates.course.trim();
    }


    // Validate marks
    if (updates.marks !== undefined) {

        if (!isValidMarks(updates.marks)) {
            throw new Error(
                "Marks must be between 0 and 100."
            );
        }

        student.marks = updates.marks;
    }


    return student;
}


deleteStudent(id: number): Student {

    const index = this.students.findIndex(
        student => student.id === id
    );

    if (index === -1) {
        throw new Error(
            `Student with ID ${id} not found.`
        );
    }

    const deletedStudents = this.students.splice(index, 1);

    const deletedStudent = deletedStudents[0];

    if (!deletedStudent) {
        throw new Error("Unable to delete student.");
    }

    return deletedStudent;
}
}