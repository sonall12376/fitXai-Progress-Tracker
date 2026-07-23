// Redirect root to progress dashboard
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/progress');
}
