import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { StudentService } from "./services/student.service";
import type { Student } from "./models/student";


// Create terminal interface
const rl = readline.createInterface({
    input,
    output
});


// Create one StudentService object
const studentService = new StudentService();


// ==============================
// MAIN MENU
// ==============================

function showMenu(): void {

    console.log(`
=================================
     STUDENT MANAGEMENT SYSTEM
=================================

1. Add Student
2. View All Students
3. Find Student
4. Update Student
5. Delete Student
6. Search Students
7. Filter Students
8. Student Statistics
9. Sort Students
0. Exit

`);
}


// ==============================
// DISPLAY STUDENTS
// ==============================

function displayStudents(students: Student[]): void {

    if (students.length === 0) {
        console.log("\nNo students found.");
        return;
    }

    console.table(students);
}


// ==============================
// 1. ADD STUDENT
// ==============================

async function addStudent(): Promise<void> {

    console.log("\n--- Add Student ---");

    const name = await rl.question(
        "Enter name: "
    );

    const email = await rl.question(
        "Enter email: "
    );

    const age = Number(
        await rl.question("Enter age: ")
    );

    const course = await rl.question(
        "Enter course: "
    );

    const marks = Number(
        await rl.question("Enter marks: ")
    );


    const student = studentService.addStudent({
        name,
        email,
        age,
        course,
        marks
    });


    console.log("\nStudent added successfully.");

    console.table([student]);
}


// ==============================
// 2. VIEW ALL STUDENTS
// ==============================

function viewAllStudents(): void {

    console.log("\n--- All Students ---");

    const students =
        studentService.getAllStudents();

    displayStudents(students);
}


// ==============================
// 3. FIND STUDENT
// ==============================

async function findStudent(): Promise<void> {

    console.log("\n--- Find Student ---");

    const id = Number(
        await rl.question(
            "Enter student ID: "
        )
    );


    if (!Number.isInteger(id) || id <= 0) {

        console.log(
            "Please enter a valid student ID."
        );

        return;
    }


    const student =
        studentService.findStudentById(id);


    if (!student) {

        console.log(
            `Student with ID ${id} not found.`
        );

        return;
    }


    console.table([student]);
}


// ==============================
// 4. UPDATE STUDENT
// ==============================

async function updateStudent(): Promise<void> {

    console.log("\n--- Update Student ---");

    const id = Number(
        await rl.question(
            "Enter student ID to update: "
        )
    );


    if (!Number.isInteger(id) || id <= 0) {

        console.log(
            "Please enter a valid student ID."
        );

        return;
    }


    const student =
        studentService.findStudentById(id);


    if (!student) {

        console.log(
            `Student with ID ${id} not found.`
        );

        return;
    }


    console.log(`
Current Student:
`);

    console.table([student]);


    console.log(
        "\nPress Enter to keep the current value.\n"
    );


    const name = await rl.question(
        `Name (${student.name}): `
    );

    const email = await rl.question(
        `Email (${student.email}): `
    );

    const ageInput = await rl.question(
        `Age (${student.age}): `
    );

    const course = await rl.question(
        `Course (${student.course}): `
    );

    const marksInput = await rl.question(
        `Marks (${student.marks}): `
    );


    const updates: Partial<
        Omit<Student, "id">
    > = {};


    if (name.trim() !== "") {
        updates.name = name;
    }


    if (email.trim() !== "") {
        updates.email = email;
    }


    if (ageInput.trim() !== "") {
        updates.age = Number(ageInput);
    }


    if (course.trim() !== "") {
        updates.course = course;
    }


    if (marksInput.trim() !== "") {
        updates.marks = Number(marksInput);
    }


    const updatedStudent =
        studentService.updateStudent(
            id,
            updates
        );


    console.log(
        "\nStudent updated successfully."
    );

    console.table([updatedStudent]);
}


// ==============================
// 5. DELETE STUDENT
// ==============================

async function deleteStudent(): Promise<void> {

    console.log("\n--- Delete Student ---");

    const id = Number(
        await rl.question(
            "Enter student ID to delete: "
        )
    );


    if (!Number.isInteger(id) || id <= 0) {

        console.log(
            "Please enter a valid student ID."
        );

        return;
    }


    studentService.deleteStudent(id);


    console.log(
        `Student with ID ${id} deleted successfully.`
    );
}


// ==============================
// 6. SEARCH STUDENTS
// ==============================

async function searchStudents(): Promise<void> {

    console.log("\n--- Search Students ---");

    const keyword = await rl.question(
        "Enter name, email or course: "
    );


    const students =
        studentService.searchStudents(
            keyword
        );


    displayStudents(students);
}


// ==============================
// 7. FILTER STUDENTS
// ==============================

async function filterStudents(): Promise<void> {

    console.log(`
--- Filter Students ---

1. Filter by Course
2. Filter by Result
`);


    const choice = await rl.question(
        "Choose an option: "
    );


    // Filter by course
    if (choice.trim() === "1") {

        const course = await rl.question(
            "Enter course: "
        );


        const students =
            studentService.filterByCourse(
                course
            );


        displayStudents(students);

        return;
    }


    // Filter by result
    if (choice.trim() === "2") {

        const resultInput =
            await rl.question(
                "Enter result (Pass/Fail): "
            );


        const result =
            resultInput
                .trim()
                .toLowerCase();


        if (
            result !== "pass" &&
            result !== "fail"
        ) {

            console.log(
                "Please enter Pass or Fail."
            );

            return;
        }


        const selectedResult:
            "Pass" | "Fail" =
            result === "pass"
                ? "Pass"
                : "Fail";


        const students =
            studentService.filterByResult(
                selectedResult
            );


        displayStudents(students);

        return;
    }


    console.log("Invalid filter option.");
}


// ==============================
// 8. STUDENT STATISTICS
// ==============================

function showStatistics(): void {

    console.log("\n--- Student Statistics ---");


    const statistics =
        studentService.getStatistics();


    console.log(`
=================================
       STUDENT STATISTICS
=================================

Total Students  : ${statistics.totalStudents}
Average Marks   : ${statistics.averageMarks}
// Highest Marks   : ${statistics.highestMarks ?? "N/A"}
// Lowest Marks    : ${statistics.lowestMarks ?? "N/A"}
Passed Students : ${statistics.passedStudents}
Failed Students : ${statistics.failedStudents}

`);
}


// ==============================
// 9. SORT STUDENTS
// ==============================

async function sortStudents(): Promise<void> {

    console.log(`
--- Sort Students ---

1. Marks - Ascending
2. Marks - Descending
3. Name  - Ascending
4. Name  - Descending
`);


    const choice = await rl.question(
        "Choose an option: "
    );


    let students: Student[];


    switch (choice.trim()) {

        case "1":

            students =
                studentService.sortByMarks(
                    "asc"
                );

            break;


        case "2":

            students =
                studentService.sortByMarks(
                    "desc"
                );

            break;


        case "3":

            students =
                studentService.sortByName(
                    "asc"
                );

            break;


        case "4":

            students =
                studentService.sortByName(
                    "desc"
                );

            break;


        default:

            console.log(
                "Invalid sorting option."
            );

            return;
    }


    displayStudents(students);
}


// ==============================
// MAIN APPLICATION
// ==============================

async function main(): Promise<void> {

    let running = true;


    while (running) {

        showMenu();


        const choice = await rl.question(
            "Choose an option: "
        );


        try {

            switch (choice.trim()) {

                case "1":

                    await addStudent();

                    break;


                case "2":

                    viewAllStudents();

                    break;


                case "3":

                    await findStudent();

                    break;


                case "4":

                    await updateStudent();

                    break;


                case "5":

                    await deleteStudent();

                    break;


                case "6":

                    await searchStudents();

                    break;


                case "7":

                    await filterStudents();

                    break;


                case "8":

                    showStatistics();

                    break;


                case "9":

                    await sortStudents();

                    break;


                case "0":

                    running = false;

                    console.log(
                        "\nStudent Management System closed."
                    );

                    break;


                default:

                    console.log(
                        "\nInvalid option. Choose a number from 0 to 9."
                    );
            }

        } catch (error) {

            if (error instanceof Error) {

                console.log(
                    `\nError: ${error.message}`
                );

            } else {

                console.log(
                    "\nAn unexpected error occurred."
                );
            }
        }


        if (running) {

            await rl.question(
                "\nPress Enter to continue..."
            );
        }
    }


    rl.close();
}


// Start application
main();