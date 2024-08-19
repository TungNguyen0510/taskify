import { useColumnsStore } from '@/stores/columns';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

export const resetAllStores = () => {
  useColumnsStore.getState().reset();
  useProjectsStore.getState().reset();
  useTasksStore.getState().reset();
};

export const handleError = (error: string) => {
  throw new Error(error);
};

export function formatDateMD(
  dateString: string,
  locale: string = 'en-US',
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateFull(
  dateString: string,
  locale: string = 'en-US',
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * So sánh thời gian với thời gian hiện tại.
 * @param expirationTime - Thời gian hết hạn dưới dạng chuỗi ISO hoặc đối tượng Date.
 * @returns true nếu thời gian hiện tại chưa vượt quá thời gian hết hạn, ngược lại false.
 */
export function isExpiredDate(expirationTime: string | Date): boolean {
  const now = new Date();
  const expiryDate = new Date(expirationTime);

  return now > expiryDate;
}
