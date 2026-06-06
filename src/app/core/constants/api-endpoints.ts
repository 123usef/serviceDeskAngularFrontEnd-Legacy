export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me'
  },
  TICKETS: {
    BASE: '/tickets',
    BY_ID: (id: number) => `/tickets/${id}`,
    ASSIGN: (id: number) => `/tickets/${id}/assign`,
    STATUS: (id: number) => `/tickets/${id}/status`,
    MY_TICKETS: '/tickets/my-tickets',
    ASSIGNED: '/tickets/assigned'
  },
  COMMENTS: {
    BY_TICKET: (ticketId: number) => `/tickets/${ticketId}/comments`,
    BY_ID: (ticketId: number, commentId: number) => `/tickets/${ticketId}/comments/${commentId}`
  },
  CATEGORIES: {
    BASE: '/categories'
  },
  DEPARTMENTS: {
    BASE: '/departments'
  },
  USERS: {
    BASE: '/users',
    TECHNICIANS: '/users/technicians',
    ROLE: (id: number) => `/users/${id}/role`
  },
  DASHBOARD: {
    STATS: '/dashboard/stats'
  }
};
