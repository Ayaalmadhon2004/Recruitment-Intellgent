import { redirect } from 'next/navigation';
import { routes } from '@/domain/config';

/** The remaining questions are a step of the continuous audit now. */
export default function Page(): never {
  redirect(`${routes.quickStart}?phase=sections`);
}
