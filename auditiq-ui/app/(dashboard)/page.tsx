import { redirect } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { getDefaultRedirect } from '@/lib/utils/permissions';

export default function DashboardIndexPage() {
  // In a real app, this would check the user's role and redirect
  // For now, we'll redirect to inference
  redirect('/inference');
}
