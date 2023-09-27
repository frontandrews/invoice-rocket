"use client";
import { useState, useEffect } from "react";
import useFormInput from "@/hooks/useFormInput";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useRouter, useParams } from "next/navigation";
import { CURRENCY_OPTIONS } from "@/constants";
import { formatCurrency } from "@/utils/helper";
import { useSelector, useDispatch } from "react-redux";
import { addInvoice, updateInvoice } from "@/redux/features/invoice/slice";
import { v4 as uuidv4 } from "uuid";
import Heading from "@/components/common/Heading";
import { StoreTypes, InvoiceItem } from "@/types";

function InvoiceForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();

  const initialValues = useSelector((state: StoreTypes) =>
    state.invoices.find((invoice) => invoice.id === id)
  );

  const currentDate = new Date().toISOString().slice(0, 10);
  const clientId = useFormInput<string>(initialValues?.clientId || "");
  const clients = useSelector((state: StoreTypes) => state.clients || []);
  const currency = useFormInput<string>(initialValues?.currency || "USD");
  const dueDate = useFormInput<string>(initialValues?.dueDate || currentDate);
  const details = useFormInput<string>(initialValues?.details || "");
  const [items, setItems] = useState<InvoiceItem[]>(
    initialValues?.items || []
  );
  const [newItem, setNewItem] = useState<InvoiceItem>({ description: "", value: 0 });
  const status = useFormInput<string>(initialValues?.status || "unpaid");

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrors(["At least one item is required."]);
      return;
    } else if (errors.length) {
      return;
    }

    const formData = {
      clientId: clientId.value,
      currency: currency.value,
      items: items,
      dueDate: dueDate.value,
      details: details.value,
      status: status.value || "unpaid",
    };

    if (id) {
      // @ts-expect-error: TODO: fix this type error
      dispatch(updateInvoice({ id, ...formData }));
      router.push("/invoices");
      return;
    } else {
      dispatch(
        // @ts-expect-error: TODO: fix this type error
        addInvoice({
          id: uuidv4(),
          ...formData,
        })
      );
      router.push("/invoices");
    }
  };

  const removeItem = (itemIndex: number) => {
    const newItems = [...items];
    newItems.splice(itemIndex, 1);
    setItems(newItems);
  };

  const handleAddItem = () => {
    setErrors([]);
    let errorList = [];

    if (!newItem.description) {
      errorList.push("Description is required.");
    }

    if (!clientId.value) {
      errorList.push("Client is required.");
    }

    if (
      newItem.value.toString().trim() === "" ||
      isNaN(Number(newItem.value))
    ) {
      errorList.push("Value is required.");
    }

    if (errorList.length > 0) {
      setErrors(errorList);
      return;
    }

    setItems([...items, { ...newItem, value: Number(newItem.value) }]);
    setNewItem({ description: "", value: 0 });
  };

  const totalAmount =
    items.reduce((acc, item) => acc + Number(item.value), 0) || 0;

  return (
    <div className="max-w-lg mx-auto">
      <Heading title={id ? "Edit Invoice" : "Create Invoice"} />
      <form className="mx-auto max-w-7xl" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <div>
            <div className="flex space-x-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Client
              </label>
              <button
                type="button"
                className="inline-flex items-center rounded-md 
                bg-neutral-100 border border-neutral-400
                text-neutral-700 shadow-sm hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                onClick={() => router.push("/clients/new")}
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <select
              {...clientId}
              name="clientId"
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6"
            >
              <option>Choose a option</option>
              {clients.map((client: any) => (
                <option key={client.id} value={client.id}>
                  {client?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Status
            </label>
            <select
              {...status}
              name="status"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6"
            >
              <option value="unpaid">
                Unpaid
              </option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Currency
            </label>
            <select
              value={currency.value}
              onChange={currency.onChange}
              name="currency"
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6"
            >
              {CURRENCY_OPTIONS.map(
                (currency: { value: string; label: string }) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date
            </label>
            <div className="mt-2">
              <input
                {...dueDate}
                required
                name="dueDate"
                type="date"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="items"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              New Items
            </label>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0">
              <input
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                placeholder="Description"
                className="mr-0 sm:mr-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6 flex-1"
              />
              <input
                value={newItem.value}
                type="number"
                onChange={(e) =>
                  setNewItem({ ...newItem, value: Number(e.target.value) })
                }
                placeholder="Value"
                className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6 flex-1"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="rounded-md bg-cyan-600 px-3 sm:ml-1 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 flex flex-1 justify-center sm:max-w-[120px]"
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
          {items.length ? (
          <div className="col-span-full">
              <div>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Value
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 text-sm font-semibold text-gray-900"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {items.map((item, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          {item.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.value === 0
                            ? "Free"
                            : formatCurrency(item.value, currency.value)}
                        </td>
                        <td className="whitespace-nowrap py-4 text-center flex flex-1 space-x-2 justify-center">
                          <button
                            onClick={() => removeItem(index)}
                            type="button"
                            className="block rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700 px-1.5 py-1 text-center text-sm font-semibold shadow-sm  focus-visible:outline focus-visible:outline-2"
                          >
                            <TrashIcon
                              className="h-5 w-5 text-red-700"
                              aria-hidden="true"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-gray-100">
                      <td
                        colSpan={2}
                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
                      >
                        Total
                      </td>
                      <td className="whitespace-nowrap py-4 text-center flex flex-1 space-x-2 justify-center">
                        {totalAmount === 0
                          ? "Free"
                          : formatCurrency(totalAmount, currency.value)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
          </div>
          ) : (
            ""
          )}

          <div className="col-span-full">
            <label
              htmlFor="about"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Details
            </label>
            <div className="mt-2">
              <textarea
                {...details}
                name="details"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

       
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            Save
          </button>
        </div>
        {errors && errors.length > 0 && (
          <div className="border p-5 rounded-md border-neutral-300 bg-red-100/10 text-red-500 mt-2">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}

export default InvoiceForm;
