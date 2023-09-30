"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { StoreTypes } from "@/types";
import { useState, useEffect } from "react";
import { fetchAllData } from "@/hooks/fetchAllData";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Invoice, Client, Profile } from '@/types/index'; // Replace with your actual path to types

const InvoiceViewer = dynamic(() => import("@/app/invoices/components/InvoiceViewer"), {
  ssr: false,
  loading: LoadingSpinner,
});

interface FetchedData {
  invoiceData: Invoice;
  clientData: Client;
  profileData: Profile;
}

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<FetchedData | null>(null);
  const isAuthenticated = useSelector((state: StoreTypes) => state.auth.user.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/invoices");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    (async () => {
      const fetchedData = await fetchAllData();
      setData(fetchedData);
    })();
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto ">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simplify the way you create invoices.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Create clients, invoices, and estimates in seconds. <br></br>Check the example below to see how the invoice looks like.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="create-account"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Create account
            </Link>
            <Link
              href="login"
              className="text-sm font-semibold leading-6 text-white"
            >
              Sign In
            </Link>
          </div>
          
        </div>
      </div>
        {data && (
          <InvoiceViewer 
            exportJpg={() => {}}
            exportPdf={() => {}}
            hasExport={false}
            currentDate="2023-09-26"
            profile={data.profileData}
            client={data.clientData}
            total={5000}
            invoiceData={data.invoiceData} 
          />
        )}
    </div>
  );
}
