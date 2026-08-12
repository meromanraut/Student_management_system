import { Student } from "../models/student";

import {
    isValidAge,
    isValidEmail,
    isValidMarks,
    isValidText
} from "../utils/validation";


// Pass or Fail type
export type StudentResult = "Pass" | "Fail";


// Structure of statistics result
export interface StudentStatistics {
    totalStudents: number;
    averageMarks: number;
    highestMarks: number | null;
    lowestMarks: number | null;
    passedStudents: number;
    failedStudents: number;
}


export class StudentService {

    // Store students in memory
    private students: Student[] = [];

    // ID for next student
    private nextId: number = 1;


    // =========================
    // ADD STUDENT
    // =========================

    addStudent(
        data: Omit<Student, "id">
    ): Student {

        // Validate name
        if (!isValidText(data.name)) {
            throw new Error(
                "Student name is required."
            );
        }


        // Validate email
        if (!isValidEmail(data.email)) {
            throw new Error(
                "Invalid email address."
            );
        }


        // Check duplicate email
        const emailExists =
            this.students.some(
                student =>
                    student.email
                        .toLowerCase() ===
                    data.email
                        .trim()
                        .toLowerCase()
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
            throw new Error(
                "Course is required."
            );
        }


        // Validate marks
        if (!isValidMarks(data.marks)) {
            throw new Error(
                "Marks must be between 0 and 100."
            );
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


        // Store student
        this.students.push(newStudent);


        return newStudent;
    }



    // =========================
    // VIEW ALL STUDENTS
    // =========================

    getAllStudents(): Student[] {

        return [...this.students];
    }



    // =========================
    // FIND STUDENT
    // =========================

    findStudentById(
        id: number
    ): Student | undefined {

        return this.students.find(
            student => student.id === id
        );
    }



    // =========================
    // UPDATE STUDENT
    // =========================

    updateStudent(
        id: number,
        data: Partial<Omit<Student, "id">>
    ): Student {

        const student =
            this.findStudentById(id);


        if (!student) {
            throw new Error(
                `Student with ID ${id} not found.`
            );
        }


        // Validate name
        if (data.name !== undefined) {

            if (!isValidText(data.name)) {
                throw new Error(
                    "Student name is required."
                );
            }

            student.name =
                data.name.trim();
        }


        // Validate email
        if (data.email !== undefined) {

            if (!isValidEmail(data.email)) {
                throw new Error(
                    "Invalid email address."
                );
            }


            const normalizedEmail =
                data.email
                    .trim()
                    .toLowerCase();


            const emailExists =
                this.students.some(
                    currentStudent =>
                        currentStudent.id !== id &&
                        currentStudent.email
                            .toLowerCase() ===
                        normalizedEmail
                );


            if (emailExists) {
                throw new Error(
                    "A student with this email already exists."
                );
            }


            student.email =
                data.email.trim();
        }


        // Validate age
        if (data.age !== undefined) {

            if (!isValidAge(data.age)) {
                throw new Error(
                    "Age must be a positive whole number between 1 and 120."
                );
            }

            student.age = data.age;
        }


        // Validate course
        if (data.course !== undefined) {

            if (!isValidText(data.course)) {
                throw new Error(
                    "Course is required."
                );
            }

            student.course =
                data.course.trim();
        }


        // Validate marks
        if (data.marks !== undefined) {

            if (!isValidMarks(data.marks)) {
                throw new Error(
                    "Marks must be between 0 and 100."
                );
            }

            student.marks =
                data.marks;
        }


        return student;
    }



    // =========================
    // DELETE STUDENT
    // =========================

    deleteStudent(id: number): Student {

        const index =
            this.students.findIndex(
                student =>
                    student.id === id
            );


        if (index === -1) {
            throw new Error(
                `Student with ID ${id} not found.`
            );
        }


        const deletedStudent =
            this.students[index];


        if (!deletedStudent) {
            throw new Error(
                "Unable to delete student."
            );
        }


        this.students.splice(
            index,
            1
        );


        return deletedStudent;
    }



    // =========================
    // SEARCH STUDENTS
    // =========================

    searchStudents(
        keyword: string
    ): Student[] {

        if (!isValidText(keyword)) {
            return [];
        }


        const searchValue =
            keyword
                .trim()
                .toLowerCase();


        return this.students.filter(
            student =>
                student.name
                    .toLowerCase()
                    .includes(searchValue) ||

                student.email
                    .toLowerCase()
                    .includes(searchValue) ||

                student.course
                    .toLowerCase()
                    .includes(searchValue)
        );
    }



    // =========================
    // FILTER BY COURSE
    // =========================

    filterByCourse(
        course: string
    ): Student[] {

        if (!isValidText(course)) {
            return [];
        }


        const courseName =
            course
                .trim()
                .toLowerCase();


        return this.students.filter(
            student =>
                student.course
                    .toLowerCase() ===
                courseName
        );
    }



    // =========================
    // FILTER BY RESULT
    // =========================

    filterByResult(
        result: StudentResult
    ): Student[] {

        if (result === "Pass") {

            return this.students.filter(
                student =>
                    student.marks >= 40
            );
        }


        return this.students.filter(
            student =>
                student.marks < 40
        );
    }



    // =========================
    // STUDENT STATISTICS
    // =========================

    getStatistics(): StudentStatistics {

        const totalStudents =
            this.students.length;


        // No students
        if (totalStudents === 0) {

            return {
                totalStudents: 0,
                averageMarks: 0,
                highestMarks: null,
                lowestMarks: null,
                passedStudents: 0,
                failedStudents: 0
            };
        }


        // Get all marks
        const marks =
            this.students.map(
                student =>
                    student.marks
            );


        // Add all marks
        const totalMarks =
            marks.reduce(
                (sum, mark) =>
                    sum + mark,
                0
            );


        // Count passed students
        const passedStudents =
            this.students.filter(
                student =>
                    student.marks >= 40
            ).length;


        // Count failed students
        const failedStudents =
            this.students.filter(
                student =>
                    student.marks < 40
            ).length;


        return {

            totalStudents,

            averageMarks: Number(
                (
                    totalMarks /
                    totalStudents
                ).toFixed(2)
            ),

            highestMarks:
                Math.max(...marks),

            lowestMarks:
                Math.min(...marks),

            passedStudents,

            failedStudents
        };
    }



    // =========================
    // SORT BY MARKS
    // =========================

    sortByMarks(
        order: "asc" | "desc"
    ): Student[] {

        const students =
            [...this.students];


        students.sort(
            (a, b) => {

                if (order === "asc") {

                    return (
                        a.marks -
                        b.marks
                    );
                }


                return (
                    b.marks -
                    a.marks
                );
            }
        );


        return students;
    }



    // =========================
    // SORT BY NAME
    // =========================

    sortByName(
        order: "asc" | "desc"
    ): Student[] {

        const students =
            [...this.students];


        students.sort(
            (a, b) => {

                const comparison =
                    a.name.localeCompare(
                        b.name,
                        undefined,
                        {
                            sensitivity: "base"
                        }
                    );


                if (order === "asc") {

                    return comparison;
                }


                return -comparison;
            }
        );


        return students;
    }
}