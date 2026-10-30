import { redirect } from 'next/navigation';
import { routes } from '@/domain/config';

/** The first read is a step of the continuous audit now. */
export default function Page(): never {
  redirect(`${routes.quickStart}?phase=read`);
}
