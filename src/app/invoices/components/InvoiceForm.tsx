"use client";
import { useEffect, useReducer, Reducer } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useRouter, useParams } from "next/navigation";
import { formatCurrency } from "@/utils/helper";
import { useSelector, useDispatch } from "react-redux";
import { addInvoice, updateInvoice } from "@/redux/features/invoice/slice";
import { v4 as uuidv4 } from "uuid";
import Heading from "@/components/common/Heading";
import { StoreTypes, InvoiceItem, Currency } from "@/types";
import { fetchCurrencies } from "@/hooks/fetchCurrencies";
import { STATUSES } from "@/constants";
import { capitalizeFirstLetter } from "@/utils/helper";
import { useNotification } from "@/app/providers/NotificationProvider";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const SET_FORM_DATA = "SET_FORM_DATA";
const ADD_ITEM = "ADD_ITEM";
const REMOVE_ITEM = "REMOVE_ITEM";
const SET_ERRORS = "SET_ERRORS";
const SET_NEW_ITEM = "SET_NEW_ITEM";
const SET_CURRENCIES = "SET_CURRENCIES";

enum ActionTypes {
  SET_FORM_DATA = "SET_FORM_DATA",
  ADD_ITEM = "ADD_ITEM",
  REMOVE_ITEM = "REMOVE_ITEM",
  SET_ERRORS = "SET_ERRORS",
  SET_NEW_ITEM = "SET_NEW_ITEM",
  SET_CURRENCIES = "SET_CURRENCIES",
}

type FormValidationError = {
  field: string;
  message: string;
};

type FormValidationErrors = FormValidationError[];

interface InvoiceState {
  formData: {
    clientId: string;
    currency: string;
    dueDate: string;
    details: string;
    status: string;
  };
  items: InvoiceItem[];
  errors: FormValidationErrors;
  newItem: InvoiceItem;
  currencies: Currency[];
}

type InvoiceActions = {
  type: ActionTypes;
  payload: any;
};

function InvoiceForm() {
  const { id } = useParams();
  const router = useRouter();
  const reduxDispatch = useDispatch();
  const initialValues = useSelector((state: StoreTypes) =>
    state.invoices.find((invoice) => invoice.id === id)
  );
  const currentDate = new Date().toISOString().slice(0, 10);
  const clients = useSelector((state: StoreTypes) => state.clients || []);
  const { addNotification } = useNotification();

  const invoiceReducer = (state: InvoiceState, action: InvoiceActions): InvoiceState => {
    switch (action.type) {
      case SET_FORM_DATA:
        return { ...state, formData: { ...state.formData, ...action.payload } };
      case ADD_ITEM:
        return { ...state, items: [...state.items, action.payload] };
      case REMOVE_ITEM:
        return {
          ...state,
          items: state.items.filter((_, idx) => idx !== action.payload),
        };
      case SET_ERRORS:
        return { ...state, errors: action.payload };
      case SET_NEW_ITEM:
        return { ...state, newItem: action.payload };
      case SET_CURRENCIES:
        return { ...state, currencies: action.payload };
      default:
        return state;
    }
  };

  const initialState: InvoiceState = {
    formData: {
      clientId: initialValues?.clientId || "",
      currency: initialValues?.currency || "USD",
      dueDate: initialValues?.dueDate || currentDate,
      details: initialValues?.details || "",
      status: initialValues?.status || "unpaid",
    },
    items: initialValues?.items || [],
    errors: [],
    newItem: { description: "", value: 0 },
    currencies: [],
  };

  const [state, dispatch] = useReducer<Reducer<InvoiceState, any>>(
    invoiceReducer,
    initialState
  );

  useEffect(() => {
    (async () => {
      const fetchedCurrencies = await fetchCurrencies();
      dispatch({ type: "SET_CURRENCIES", payload: fetchedCurrencies });
    })();
  }, [dispatch]);

  /**
   * Handle form submission.
   * - Validates the form fields.
   * - Dispatches the action to create or update an invoice.
   * - Redirects to the invoice list page.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate: Ensure at least one item is present.
    if (state.items.length === 0) {
      dispatch({
        type: SET_ERRORS,
        payload: ["At least one item is required."],
      });
      return;
    }

    const formData = {
      clientId: state.formData.clientId,
      currency: state.formData.currency,
      items: state.items,
      dueDate: state.formData.dueDate,
      details: state.formData.details,
      status: state.formData.status || "unpaid",
    };

    if (id) {
      // @ts-expect-error: TODO: fix this type error
      reduxDispatch(updateInvoice({ id, ...formData }));

      addNotification({
        title: "Your invoice has been updated",
        type: "success",
      });

      router.push("/invoices");
      return;
    } else {
      reduxDispatch(
        // @ts-expect-error: TODO: fix this type error
        addInvoice({
          id: uuidv4(),
          ...formData,
        })
      );
      addNotification({
        title: "Your invoice has been created",
        type: "success",
      });
      router.push("/invoices");
    }
  };

  const removeItem = (itemIndex: number) => {
    dispatch({ type: REMOVE_ITEM, payload: itemIndex });
  };

  const formValidationErrors = (
    newItem: any,
    clientId: string
  ): FormValidationErrors => {
    let errorList: FormValidationErrors = [];

    if (!newItem.description) {
      errorList.push({ field: "items", message: "Description is required." });
    }

    if (!clientId) {
      errorList.push({ field: "clientId", message: "Client is required." });
    }

    if (
      newItem.value.toString().trim() === "" ||
      isNaN(Number(newItem.value))
    ) {
      errorList.push({ field: "items", message: "Value is required." });
    }

    return errorList;
  };

  const validateAndAddItem = () => {
    // Validate the new item and the client ID
    const validationErrors = formValidationErrors(
      state.newItem,
      state.formData.clientId
    );

    if (validationErrors.length > 0) {
      dispatch({ type: "SET_ERRORS", payload: validationErrors });
      return;
    }

    dispatch({
      type: ADD_ITEM,
      payload: { ...state.newItem, value: Number(state.newItem.value) },
    });

    dispatch({ type: SET_NEW_ITEM, payload: { description: "", value: 0 } });
  };

  const totalAmount =
    state.items.reduce((acc, item) => acc + Number(item.value), 0) || 0;

  const isDataLoading = state.currencies.length  > 0

  return isDataLoading ? (
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
              value={state.formData.clientId}
              onChange={(e) =>
                dispatch({ type: SET_FORM_DATA, payload: { ...state.formData, clientId: e.target.value } })
              }
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
              value={state.formData.status}
              onChange={(e) =>
                dispatch({ type: SET_FORM_DATA, payload: { ...state.formData, status: e.target.value } })
              }
              name="status"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6"
            >
              {STATUSES.map((status: string) => (
                <option key={status} value={status}>
                  {capitalizeFirstLetter(status)}
                </option>
              ))}
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
              value={state.formData.currency}
              onChange={(e) =>
                dispatch({ type: SET_FORM_DATA, payload: { ...state.formData, currency: e.target.value } })
              }
              name="currency"
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6"
            >
              {state.currencies.map(
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
                value={state.formData.dueDate}
                onChange={(e) =>
                  dispatch({ type: SET_FORM_DATA, payload: { ...state.formData, dueDate: e.target.value } })
                }
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
                value={state.newItem.description}
                onChange={(e) =>
                  dispatch({ type: SET_NEW_ITEM, payload: { ...state.newItem, description: e.target.value } })
                }
                placeholder="Description"
                className="mr-0 sm:mr-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6 flex-1"
              />
              <input
                value={state.newItem.value}
                onChange={(e) =>
                  dispatch({ type: SET_NEW_ITEM, payload: { ...state.newItem, value: Number(e.target.value) } })
                }
                type="number"
                placeholder="Value"
                className="rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6 flex-1"
              />
              <button
                type="button"
                onClick={validateAndAddItem}
                className="rounded-md bg-cyan-600 px-3 sm:ml-1 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 flex flex-1 justify-center sm:max-w-[120px]"
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
          {state.items.length ? (
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
                    {state.items.map((item, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          {item.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.value === 0
                            ? "Free"
                            : formatCurrency(item.value, state.formData.currency)}
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
                          : formatCurrency(totalAmount, state.formData.currency)}
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
                value={state.formData.details}
                onChange={(e) =>
                  dispatch({ type: SET_FORM_DATA, payload: { ...state.formData, details: e.target.value } })
                }
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
        {state.errors && state.errors.length > 0 && (
          <div className="border p-5 rounded-md border-neutral-300 bg-red-100/10 text-red-500 mt-2">
            <ul>
              {state.errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  ) : <LoadingSpinner />;
}

export default InvoiceForm;
