const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = { ...extra };
  const token = localStorage.getItem('edschedule_access_token');
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: getHeaders(body ? { 'Content-Type': 'application/json' } : {}),
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  if (!res.ok) {
    let detail: string;
    try {
      const err = await res.json();
      detail = err.detail || (err.errors ? JSON.stringify(err.errors) : `HTTP ${res.status}`);
    } catch {
      detail = `HTTP ${res.status}`;
    }
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Auth
  register(data: { username: string; password: string; organization_name: string; org_type: string }) {
    return request<any>('POST', `${BASE}/auth/register/`, data);
  },
  login(username: string, password: string) {
    return request<{ access: string; refresh: string }>('POST', `${BASE}/auth/login/`, { username, password });
  },
  me() {
    return request<any>('GET', `${BASE}/auth/me/`);
  },
  saveTokens(access: string, refresh: string) {
    localStorage.setItem('edschedule_access_token', access);
    localStorage.setItem('edschedule_refresh_token', refresh);
  },
  clearTokens() {
    localStorage.removeItem('edschedule_access_token');
    localStorage.removeItem('edschedule_refresh_token');
  },
  isAuthenticated() {
    return !!localStorage.getItem('edschedule_access_token');
  },

  // Academics — teachers
  teachers() {
    return request<any[]>('GET', `${BASE}/academics/teachers/`);
  },
  createTeacher(data: any) {
    return request<any>('POST', `${BASE}/academics/teachers/`, data);
  },
  updateTeacher(id: string, data: any) {
    return request<any>(`PATCH`, `${BASE}/academics/teachers/${id}/`, data);
  },
  deleteTeacher(id: string) {
    return request<void>('DELETE', `${BASE}/academics/teachers/${id}/`);
  },

  // Academics — groups (student_groups)
  groups() {
    return request<any[]>('GET', `${BASE}/academics/groups/`);
  },
  createGroup(data: any) {
    return request<any>('POST', `${BASE}/academics/groups/`, data);
  },
  updateGroup(id: string, data: any) {
    return request<any>(`PATCH`, `${BASE}/academics/groups/${id}/`, data);
  },
  deleteGroup(id: string) {
    return request<void>('DELETE', `${BASE}/academics/groups/${id}/`);
  },

  // Academics — classrooms
  classrooms() {
    return request<any[]>('GET', `${BASE}/academics/classrooms/`);
  },
  createClassroom(data: any) {
    return request<any>('POST', `${BASE}/academics/classrooms/`, data);
  },
  updateClassroom(id: string, data: any) {
    return request<any>(`PATCH`, `${BASE}/academics/classrooms/${id}/`, data);
  },
  deleteClassroom(id: string) {
    return request<void>('DELETE', `${BASE}/academics/classrooms/${id}/`);
  },

  // Academics — subjects
  subjects() {
    return request<any[]>('GET', `${BASE}/academics/subjects/`);
  },

  // Academics — time slots
  timeSlots() {
    return request<any[]>('GET', `${BASE}/academics/timeslots/`);
  },

  // Academics — terms
  terms() {
    return request<any[]>('GET', `${BASE}/academics/terms/`);
  },

  // Scheduling
  schedules() {
    return request<any[]>('GET', `${BASE}/scheduling/schedules/`);
  },
  createSchedule(data: any) {
    return request<any>('POST', `${BASE}/scheduling/schedules/`, data);
  },
  generateSchedule(scheduleId: string, requirements: any[]) {
    return request<any>('POST', `${BASE}/scheduling/schedules/${scheduleId}/generate/`, { requirements });
  },

  // AI Assistant
  aiChat(messages: any[]) {
    return request<any[]>('POST', `${BASE}/ai/chat/`, { messages });
  },

  // Export
  exportUrl(scheduleId: string, format: string) {
    return `${BASE}/scheduling/schedules/${scheduleId}/export/?format=${format}`;
  },
};
