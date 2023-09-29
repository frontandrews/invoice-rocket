"use client";
import withAuth from "@/hocs/withAuth";
import ClientForm from "@/app/clients/components/ClientForm";

import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { selectClientById } from "@/redux/features/client/selectors";
import { StoreTypes } from "@/types";

function EditClientPage() {
  const router = useRouter();
  const { id } = useParams();

  const initialValues = useSelector((state: StoreTypes) => selectClientById(state, id));

  return (
    <ClientForm
      isEditMode
      initialValues={initialValues}
      onCancel={() => router.push("/clients")}
    />
  );
}

export default withAuth(EditClientPage);
