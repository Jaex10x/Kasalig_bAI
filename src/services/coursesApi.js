// Routes of the backend's CourseController: the courses a teacher handles and the students
// enrolled in them. Every call needs a teacher (or admin) login token; pass AuthProvider's
// authRequest as `request`.

const enc = encodeURIComponent;

export const COURSE_ENDPOINTS = {
  courses: '/api/courses',
  course: (id) => `/api/courses/${enc(id)}`,
  students: (id) => `/api/courses/${enc(id)}/students`,
  enrollExisting: (id) => `/api/courses/${enc(id)}/enrollments`,
  student: (id, studentId) => `/api/courses/${enc(id)}/students/${enc(studentId)}`,
};

const E = COURSE_ENDPOINTS;

/**
 * A course: { id, subjectCode, title, section, yearLevel, semester, units, selfEnroll,
 *             teacherId, teacherName, studentCount }
 */
export function coursesApi(request) {
  return {
    list: () => request('GET', E.courses),
    /** body: { subjectCode, title, section?, yearLevel?, semester?, units?, selfEnroll } */
    create: (body) => request('POST', E.courses, body),
    update: (id, body) => request('PUT', E.course(id), body),
    remove: (id) => request('DELETE', E.course(id)),
    /** [{ id, fullName, email, program, enrolledOn }] */
    students: (id) => request('GET', E.students(id)),
    /** Enroll a student who already has an account, by email or student ID. */
    enrollExisting: (id, identifier) => request('POST', E.enrollExisting(id), { identifier }),
    /** Create a student account and enroll it. body: { fullName, email, program, password } */
    createStudent: (id, body) => request('POST', E.students(id), body),
    unenroll: (id, studentId) => request('DELETE', E.student(id, studentId)),
  };
}

// Student self-enrollment (StudentCourseController); always for the signed-in student.
export const ENROLL_ENDPOINTS = {
  courses: '/api/enroll/courses',
  course: (id) => `/api/enroll/courses/${enc(id)}`,
};

export function enrollApi(request) {
  return {
    /** [{ course, enrolled }]: open courses plus the ones I am in. */
    list: () => request('GET', ENROLL_ENDPOINTS.courses),
    enroll: (id) => request('POST', ENROLL_ENDPOINTS.course(id)),
    drop: (id) => request('DELETE', ENROLL_ENDPOINTS.course(id)),
  };
}
