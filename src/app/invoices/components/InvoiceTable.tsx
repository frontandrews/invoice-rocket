"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TrashIcon, PencilIcon, EyeIcon } from "@heroicons/react/20/solid";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import Table from "@/components/common/Table";
import { useNotification } from "@/app/providers/NotificationProvider";
import { RadioGroup } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import useModal from "@/hooks/useModal";
import { useDispatch, useSelector } from "react-redux";
import {
  classNames,
  padWithZeros,
  formatCurrency,
  convertDateToDDMMYYYY,
  capitalizeFirstLetter,
} from "@/utils/helper";
import { removeInvoice } from "@/redux/features/invoice/slice";
import { Invoice, StoreTypes } from "@/types";

export default function InvoiceTable() {
  const { addNotification } = useNotification();
  const dispatch = useDispatch();
  const modal = useModal();

  const invoices = useSelector((state: StoreTypes) => state.invoices);
  const clients = useSelector((state: StoreTypes) => state.clients);

  // TODO: Not the ideal way to do this, but it works for now, as we don't have a backend
  const invoicesData = invoices.map((invoice, index) => {
    const client = clients.find(
      (client) => client.id === invoice.clientId
    );

    return {
      number: index + 1,
      client,
      amount:
        invoice?.items?.reduce(
          (acc: number, item: any) => acc + item.value,
          0
        ) || "0",
      ...invoice,
    };
  });

  const [filteredInvoices, setFilteredInvoices] = useState(invoicesData || []);
  const [statusFilter, setStatusFilter] = useState("all");
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState<string>("");

  const handleDelete = (id: string) => {
    modal.show();
    setInvoiceIdToDelete(id);
  };

  const generateInvoiceData = (invoicesArray: Invoice[]) => {
    return invoicesArray.map((invoice: any, index: number) => {
      const client = clients.find(
        (client: any) => client.id === invoice.clientId
      );

      return {
        number: index + 1, // TODO: Not the ideal way to do this, but it works for now, as we don't have a backend
        client,
        amount:
          invoice?.items?.reduce(
            (acc: number, item: any) => acc + item.value,
            0
          ) || "0",
        ...invoice,
      };
    });
  };

  useEffect(() => {
    const invoicesData = generateInvoiceData(invoices);
    setFilteredInvoices(invoicesData);
    // In a real life scenario, we would have a backend that would return the invoices with the client data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices, clients]);

  const onConfirmDelete = () => {
    modal.hide();
    addNotification({
      title: "Your invoice has been deleted",
      type: "success",
    });
    dispatch(removeInvoice(invoiceIdToDelete));
  };

  const handleStatusChange = (value: any) => {
    setStatusFilter(value);
    if (value === "all") {
      setFilteredInvoices(generateInvoiceData(invoices));
    } else {
      const filteredRawInvoices = invoices.filter(
        (invoice: any) => invoice.status === value
      );
      setFilteredInvoices(generateInvoiceData(filteredRawInvoices));
    }
  };

  const filterStatuses = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "paid",
      label: "Paid",
    },
    {
      value: "unpaid",
      label: "Unpaid",
    },
  ];

  const EmptyState = () => (
    <div className="text-center my-24">
      <div className="font-medium text-lg">No invoice found</div>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating you first client or invoice.
      </p>
      <div className="my-6 flex space-x-2 justify-center">
        <Link
          href="/clients/new"
          className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Client
        </Link>
        <Link
          href="/invoices/new"
          className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Invoice
        </Link>
      </div>
    </div>
  );

  const headers = ["Client", "", ""];

  const StatusBadge = ({ status }: { status: "unpaid" | "paid" }) => {
    const statusClass = {
      paid: "bg-green-100 text-green-800",
      unpaid: "bg-red-100 text-red-800",
    }[status];

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
      >
        {capitalizeFirstLetter(status)}
      </span>
    );
  };

  const renderRow = (invoice: any) => (
    <>
      <td className="px-3 py-4 text-sm text-gray-500">
        <div className="flex flex-col font-medium">
          {invoice.client?.name || ""}
        </div>
        <div className="flex flex-col">
          #{padWithZeros(invoice.number || 0, 5)}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="flex flex-col space-y-2">
          <div>Due Date: {convertDateToDDMMYYYY(invoice.dueDate)}</div>
          <div>Total: {formatCurrency(invoice.amount, invoice.currency)}</div>
          <div>
            <StatusBadge status={invoice.status} />
          </div>
        </div>
      </td>
    </>
  );

  const renderActions = (invoice: Invoice) => (
    <>
      <div className="flex flex-col flex-1 sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-6">
        <Link
          href={`/invoices/${invoice.id}`}
          className="block rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700 px-1.5 py-1 text-center text-sm font-semibold shadow-sm  focus-visible:outline focus-visible:outline-2"
        >
          <EyeIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <Link
          href={`/invoices/edit/${invoice.id}`}
          className="rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700 px-1.5 py-1 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2"
        >
          <PencilIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <button
          onClick={() => handleDelete(invoice.id)}
          type="button"
          className="rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700 px-1.5 py-1 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2"
        >
          <TrashIcon className="h-5 w-5 text-red-700" aria-hidden="true" />
        </button>
      </div>
    </>
  );

  return (
    <main>
      {invoices.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <DeleteConfirmModal
            isVisible={modal.isVisible}
            onConfirm={() => onConfirmDelete()}
            onCancel={() => modal.hide()}
          />
          <div className="flex justify-end">
            <RadioGroup
              value={statusFilter}
              onChange={handleStatusChange}
              className="grid grid-cols-3 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
            >
              <RadioGroup.Label className="sr-only">Filter</RadioGroup.Label>
              {filterStatuses.map((option) => (
                <RadioGroup.Option
                  key={option.value}
                  value={option.value}
                  className={({ checked }) =>
                    classNames(
                      checked ? "bg-cyan-600 text-white" : "text-gray-500",
                      "cursor-pointer rounded-full px-2.5 py-1"
                    )
                  }
                >
                  <span>{option.label}</span>
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>
          <div className="flex flex-col flex-1">
              <Table
                headers={headers}
                data={filteredInvoices}
                renderRow={renderRow}
                renderActions={renderActions}
              />
              {filteredInvoices.length === 0 && (
                <div className="text-center my-24">
                  <div className="font-light text-base">No invoice found for this searching criteria</div>
                </div>
              )}
          </div>
        </>
      )}
    </main>
  );
}
