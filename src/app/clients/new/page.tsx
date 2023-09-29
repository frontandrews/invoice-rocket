"use client";
import withAuth from "@/hocs/withAuth";
import ClientForm from "@/app/clients/components/ClientForm";
import { useRouter } from "next/navigation";

function NewClientPage() {
  const router = useRouter();
  return <ClientForm onCancel={() => router.push("/clients")} />;
}

export default withAuth(NewClientPage);
