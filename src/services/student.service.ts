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
}