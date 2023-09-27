"use client";
import withAuth from "@/hocs/withAuth";
import { useNotification } from "@/app/providers/NotificationProvider";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import useModal from "@/hooks/useModal";
import Heading from "@/components/common/Heading";
import { removeClient } from "@/redux/features/client/slice";
import dynamic from "next/dynamic";

const Table = dynamic(() => import("@/components/common/Table"), {
  ssr: false,
});

interface Client {
  id: string;
  name: string;
  email: string;
  owner: string;
  address: string;
  details: string;
}

type ClientsState = Client[];

function Clients() {
  const { addNotification } = useNotification();
  const [idToDelete, setIdToDelete] = useState<string>("");
  const dispatch = useDispatch();
  const modal = useModal();

  useEffect(() => {
    setIdToDelete("");
  }, []);

  const clients = useSelector(
    (state: { clients: ClientsState }) => state.clients
  );

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    modal.show();
  };

  const onConfirmDelete = () => {
    modal.hide();
    addNotification({
      title: "Your invoice has been deleted",
      type: "success",
    });
    dispatch(removeClient(idToDelete));
  };

  const headers = [];

  const renderRow = (client: any) => (
    <>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="font-medium">{client.name}</div>
        <div className="text-xs">{client.email}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500  hidden md:table-cell">
        <div>{client.address}</div>
        <div className="text-xs">Owner {client.owner}</div>
      </td>
    </>
  );

  const renderActions = (client: any) => (
    <>
      <div className="flex flex-row flex-1 sm:flex-row items-center justify-end space-x-2 sm:space-x-6">
        <Link
          href={`/clients/edit/${client.id}`}
          className="block rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700 px-1.5 py-1 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2"
        >
          <PencilIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => handleDelete(client.id)}
          className="block rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700 px-1.5 py-1 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2"
        >
          <TrashIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
        </button>
      </div>
    </>
  );

  return (
    <>
      <DeleteConfirmModal
        isVisible={modal.isVisible}
        onConfirm={() => onConfirmDelete()}
        onCancel={() => modal.hide()}
      />
      <Heading title="Clients">
        <Link
          href="/clients/new"
          className="ml-3 inline-flex items-center rounded-md bg-cyan-600 hover:bg-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          New Client
        </Link>
      </Heading>
      <div className="flex flex-col">
        <Table
          data={clients}
          renderRow={renderRow}
          renderActions={renderActions}
        />
      </div>
    </>
  );
}

export default withAuth(Clients);
