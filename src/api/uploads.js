import { apiFetch, apiFetchWithAccepted, authenticatedFetch } from './http'

export async function listUploads() {
  const data = await apiFetch('/api/uploads')
  return data.uploads ?? []
}

export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await authenticatedFetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  return apiFetchWithAccepted(response)
}

export async function getUploadStatus(uploadedFileId) {
  const response = await authenticatedFetch(`/api/uploads/${uploadedFileId}/status`)
  return apiFetchWithAccepted(response)
}
