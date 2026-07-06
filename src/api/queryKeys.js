export const queryKeys = {
  uploads: {
    all: ['uploads'],
  },
  uploadStatus: (id) => ['uploads', id, 'status'],
  jobStatus: (id) => ['jobs', id, 'status'],
  jobResults: (id, page, pageSize) => ['jobs', id, 'results', page, pageSize],
}
