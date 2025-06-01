import { Suspense } from 'react';
import EnquiryFormClient from './EnquiryFormClient';

export default function EnquiryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading enquiry form...</div>}>
      <EnquiryFormClient />
    </Suspense>
  );
}