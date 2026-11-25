// Routes of the backend's LearningDataController (/api/learning/**): the data behind the
// quiz, gap report, learning path, progress, teacher and admin pages.
// Every call needs the login token; pass AuthProvider's authRequest as `request`.

const enc = encodeURIComponent;

export const LEARNING_ENDPOINTS = {
  student: (id) => `/api/learning/students/${enc(id)}`,
  attempts: (id) => `/api/learning/students/${enc(id)}/attempts`,
  state: (id) => `/api/learning/students/${enc(id)}/state`,
  reset: (id) => `/api/learning/students/${enc(id)}/reset`,
  classData: '/api/learning/class',
  classRecord: (kind, id, studentId) =>
    `/api/learning/class/${kind}/${enc(id)}${studentId === undefined ? '' : `?studentId=${enc(studentId)}`}`,
  school: '/api/learning/school',
  schoolRecord: (kind, id) => `/api/learning/school/${kind}/${enc(id)}`,
  roster: '/api/learning/roster',
};

const E = LEARNING_ENDPOINTS;

/** Calls for one signed-in user. `request(method, path, body)` is AuthProvider's authRequest. */
export function learningApi(request) {
  return {
    // Student: attempts are saved one by one; everything else is one "state" document.
    getStudent: (id) => request('GET', E.student(id)),
    saveAttempts: (id, attempts) => request('POST', E.attempts(id), attempts),
    saveState: (id, state) => request('PUT', E.state(id), state),
    resetHistory: (id, state) => request('POST', E.reset(id), state),

    // Class content. kind: quizzes | resources | taught | interventions | standings
    getClass: () => request('GET', E.classData),
    putClassRecord: (kind, id, body, studentId) => request('PUT', E.classRecord(kind, id, studentId), body),
    deleteClassRecord: (kind, id) => request('DELETE', E.classRecord(kind, id)),

    // School. kind: classes | subjects
    getSchool: () => request('GET', E.school),
    putSchoolRecord: (kind, id, body) => request('PUT', E.schoolRecord(kind, id), body),
    deleteSchoolRecord: (kind, id) => request('DELETE', E.schoolRecord(kind, id)),

    // Every student with their attempts (teachers and admins).
    getRoster: () => request('GET', E.roster),
  };
}
