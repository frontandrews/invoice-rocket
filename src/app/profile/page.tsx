"use client";
import withAuth from "@/hocs/withAuth";
import { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { addProfileData } from "@/redux/features/profile/slice";
import { useNotification } from "@/app/providers/NotificationProvider";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";
import Heading from "@/components/common/Heading";
import { Profile, StoreTypes } from "@/types";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import RichTextEditor from "@/components/common/RichTextEditor";

function ProfilePage() {
  const { addNotification } = useNotification();
  const dispatch = useDispatch();

  const initialValues = useSelector((state: StoreTypes) => state.profile, shallowEqual);

  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [company, setCompany] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    setFirstName(initialValues.firstName || "");
    setLastName(initialValues.lastName || "");
    setCompany(initialValues.company || "");
    setEmail(initialValues.email || "");
    setPhoneNumber(initialValues.phoneNumber || "");
    setAddress(initialValues.address || "");
  }, [initialValues]);

  const [bankingDetails, setBankingDetails] = useState<string>(
    initialValues.bankingDetails || ""
  );
  const [signatureImage, setSignatureImage] = useState<string>(
    initialValues.signatureImage || ""
  );
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      id: uuidv4(),
      firstName,
      lastName,
      company,
      email,
      phoneNumber,
      address,
      bankingDetails,
      signatureImage,
    };

    dispatch(addProfileData(formData as Profile));
    addNotification({
      title: "Profile updated with success",
      type: "success",
      duration: 4000,
    });
    router.push("/invoices")
  };

  return (
    <>
      <div className="max-w-lg mx-auto">
        <Heading title="Profile" />
        <div className="isolate bg-white">
          <p className="my-2 text-lg leading-8 text-gray-600">
            Set your profile information to automatically fill the invoice.
          </p>
          <form onSubmit={handleSubmit} className="">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2.5">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2.5">
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="signature-image"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Signature Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="signatureImage"
                  id="signature-image"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setSignatureImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {signatureImage && (
                  <Image
                    src={signatureImage}
                    alt="Preview of signature"
                    className="mt-4"
                    width="300"
                    height="100"
                  />
                )}
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Company
                </label>
                <div className="mt-2.5">
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    type="text"
                    name="company"
                    id="company"
                    autoComplete="organization"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    required
                    id="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Phone number
                </label>
                <div className="relative mt-2.5">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="country" className="sr-only">
                      Country
                    </label>
                  </div>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="tel"
                    name="phoneNumber"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Address
                </label>
                <div className="relative mt-2.5">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="country" className="sr-only">
                      Country
                    </label>
                  </div>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="tel"
                    name="address"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Banking Details
                </label>
                <div className="mt-2.5">
                  <RichTextEditor
                    value={bankingDetails}
                    setValue={setBankingDetails}
                  />
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button
                type="submit"
                className="block w-full rounded-md bg-cyan-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default withAuth(ProfilePage);
