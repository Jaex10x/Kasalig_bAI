// Routes of the backend's AdminController that the admin pages call. Every call needs an admin
// login token; pass AuthProvider's authRequest as `request`.

const enc = encodeURIComponent;

export const ADMIN_ENDPOINTS = {
  teachers: '/api/admin/getTeachers',
  createTeacher: '/api/admin/postTeachers',
  updateTeacher: (id) => `/api/admin/putTeacher/${enc(id)}`,
  deleteTeacher: (id) => `/api/admin/deleteTeachers/${enc(id)}`,
};

export function adminApi(request) {
  return {
    /** [{ teacherId, fullName, email, admin: { adminId, fullName, email } | null }] */
    getTeachers: () => request('GET', ADMIN_ENDPOINTS.teachers),
    /** body: { fullName, email, password } */
    createTeacher: (body) => request('POST', ADMIN_ENDPOINTS.createTeacher, body),
    /** body: { fullName, email, password? }: a password resets theirs; leave it out to keep it. */
    updateTeacher: (id, body) => request('PUT', ADMIN_ENDPOINTS.updateTeacher(id), body),
    deleteTeacher: (id) => request('DELETE', ADMIN_ENDPOINTS.deleteTeacher(id)),
  };
}
