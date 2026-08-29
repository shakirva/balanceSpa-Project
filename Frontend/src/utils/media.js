import { BASE_URL } from "../config";

export const getMediaUrl = (url, fallback = '/default-treatment.jpg') => {
  if (!url) return fallback;
  let cleanUrl = String(url).trim();
  if (cleanUrl.startsWith('/uploads/')) {
    cleanUrl = cleanUrl.replace('/uploads/', '/pdf-assets/');
  }
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  const base = BASE_URL || '';
  const cleanPath = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  return `${base}${cleanPath}`;
};
