"use client";
import { useFormInput } from "@/hooks/useFormInput";
import { useDispatch } from "react-redux";
import { addClient, updateClient } from "@/redux/features/client/slice";
import { useNotification } from "@/app/providers/NotificationProvider";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface ClientFormProps {
  isEditMode?: boolean;
  initialValues?: any;
  onSubmit?: (formData: any) => void;
  onCancel?: () => void;
}

function ClientForm({
  isEditMode = false,
  initialValues = {},
  onSubmit = () => {},
  onCancel = () => {},
}: ClientFormProps) {
  const { addNotification } = useNotification();
  const router = useRouter();
  const dispatch = useDispatch();

  const name = useFormInput<string>(initialValues.name || "");
  const email = useFormInput<string>(initialValues.email || "");
  const owner = useFormInput<string>(initialValues.owner || "");
  const address = useFormInput<string>(initialValues.address || "");
  const details = useFormInput<string>(initialValues.details || "");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const formData = {
      id: isEditMode ? initialValues.id : uuidv4(),
      name: name.value,
      email: email.value,
      owner: owner.value,
      address: address.value,
      details: details.value,
    };

    onSubmit(formData);

    if (!isEditMode) {
      dispatch(addClient(formData));
      addNotification({
        title: "New Client Added",
        type: "success"
      });
      router.push("/clients");
    } else {
      dispatch(updateClient(formData));
      addNotification({
        title: "Client Updated",
      });
      router.push("/clients");
    }
  };

  return (
    <>
      <form className="mx-auto max-w-7xl md:max-w-sm" onSubmit={handleSubmit}>
        <h1 className="font-medium pt-4">
          {isEditMode ? "Edit Client" : "New Client"}
        </h1>
        <div className="space-y-6">
          <div className="border-gray-900/10">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Company Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    {...name}
                    name="name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Owner
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...owner}
                    name="owner"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    {...email}
                    type="email"
                    name="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
                <div className="mt-2">
                  <textarea
                    {...address}
                    required
                    name="address"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Details
                </label>
                <div className="mt-2">
                  <textarea
                    {...details}
                    name="details"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={onCancel}
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
      </form>
    </>
  );
}

export default ClientForm;
