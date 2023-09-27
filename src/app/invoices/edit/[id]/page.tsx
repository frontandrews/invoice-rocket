"use client";
import withAuth from "@/hocs/withAuth";
import dynamic from "next/dynamic";
import Loading from '@/components/common/LoadingSpinner'

const InvoiceForm = dynamic(() => import("../../components/InvoiceForm"), {
  ssr: false,
  loading: Loading
});

function EditInvoice() {
  return <InvoiceForm />;
}

export default withAuth(EditInvoice);
