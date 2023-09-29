"use client";
import Link from "next/link";
import withAuth from "@/hocs/withAuth";
import Heading from "@/components/common/Heading";
import dynamic from "next/dynamic";
import Loading from '@/components/common/LoadingSpinner'

const InvoiceTable = dynamic(() => import("@/app/invoices/components/InvoiceTable"), {
  ssr: false,
  loading: Loading
});

function InvoicesPage() {
  return (
    <>
      <Heading title="Invoice">
        <Link
          href="/invoices/new"
          className="ml-3 inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          New Invoice
        </Link>
      </Heading>
      <div className="flex flex-col">
        <InvoiceTable />
      </div>
    </>
  );
}

export default withAuth(InvoicesPage);
