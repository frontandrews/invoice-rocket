"use client"
import React from "react";
import FloatingMenu from "@/components/common/FloatingMenu";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Heading from "@/components/common/Heading";
import { InvoiceViewerProps } from "@/types";
import { formatCurrency, convertDateToDDMMYYYY } from "@/utils/helper";

export function InvoiceViewer(props: InvoiceViewerProps) {
  const {
    invoiceData,
    exportPdf,
    exportJpg,
    currentDate,
    profile,
    client,
    total,
    hasExport = true
  } = props;

  const buttonOptions = [
    { name: "Export PDF", icon: DocumentArrowDownIcon, onClick: exportPdf },
    { name: "Export JPG", icon: DocumentArrowDownIcon, onClick: exportJpg },
  ];

  return (
    <>
      <Heading title="View Invoice">
        { hasExport ? (<FloatingMenu buttonOptions={buttonOptions} />) : <></> }
      </Heading>
      <div className="mx-auto grid max-w-7xl">
        <div
          id="invoice-view"
          className=" -mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16"
        >
          <p>
            <strong>Invoice</strong>
          </p>
          <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
            <div className="sm:pr-4">
              <dt className="inline text-black">Issued on</dt>{" "}
              <dd className="inline text-gray-700">
                <time>{convertDateToDDMMYYYY(currentDate)}</time>
              </dd>
            </div>
            <div className="mt-2 sm:mt-0 sm:pl-4">
              <dt className="inline text-black">Due on</dt>{" "}
              <dd className="inline text-gray-700">
                <time>{invoiceData?.dueDate && convertDateToDDMMYYYY(invoiceData.dueDate)}</time>
              </dd>
            </div>
            <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
              <dt>
                <strong>From</strong>
              </dt>
              <dd className="mt-2 text-black">
                <span className="font-medium text-gray-900">
                  {profile.company}
                </span>
                <br />
                {profile.address}
              </dd>
            </div>
            <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
              <dt>
                <strong>To</strong>
              </dt>
              <dd className="mt-2 text-black">
                <span className="font-medium text-gray-900">{client?.name}</span>
                <br />
                {client?.address}
              </dd>
            </div>
          </dl>
          <table className="my-4 w-full whitespace-nowrap text-left text-sm leading-6">
            <colgroup>
              <col className="w-full" />
            </colgroup>
            <thead className="border-b border-gray-200 text-gray-900">
              <tr>
                <th scope="col" className="px-0 py-3 font-semibold">
                  <strong>Projects</strong>
                </th>
                <th scope="col" className="py-3 pl-8 pr-0 text-right">
                  <strong>Price</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceData?.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="max-w-0 align-top py-1.5">
                    <div className="truncate text-black">
                      {item.description}
                    </div>
                  </td>
                  <td className="text-right">
                    {formatCurrency(Number(item.value), invoiceData.currency)}
                  </td>
                </tr>
              ))}
              <tr className="bg-neutral-100/50">
                <td className="max-w-0 align-top py-1.5"></td>
                <td className="text-right">
                  <strong>Total</strong>{" "}
                  {formatCurrency(total, invoiceData?.currency || "USD")}
                </td>
              </tr>
            </tbody>
          </table>
          {!!profile.bankingDetails && (
            <div>
              <div
                dangerouslySetInnerHTML={{ __html: profile.bankingDetails }}
              />
            </div>
          )}
          {!!profile.signatureImage && (
            <div className="flex flex-1 justify-end">
              <div className="flex flex-col">
                <div className="py-2">Signature</div>
                <Image
                  alt="user-signature"
                  src={profile.signatureImage}
                  width="300"
                  height="100"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default InvoiceViewer;
