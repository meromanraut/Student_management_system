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