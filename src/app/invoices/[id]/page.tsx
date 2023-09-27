"use client";
import withAuth from "@/hocs/withAuth";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import { StoreTypes } from "@/types";
import dynamic from "next/dynamic"; 
import Loading from "@/components/common/LoadingSpinner";	

const InvoiceViewer = dynamic(() => import("../components/InvoiceViewer"), {
  ssr: false,
  loading: Loading,
});

function Profile() {
  const exportPdf = () => {
    const invoiceView = document.getElementById("invoice-view");
    // @ts-expect-error imported as Script tag on layout.tsx
    html2pdf(invoiceView);
  };

  const exportJpg = () => {
    const invoiceView = document.getElementById("invoice-view");
    if (invoiceView) {
      html2canvas(invoiceView).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "invoice.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const { id } = useParams();
  const currentDate = new Date().toISOString().slice(0, 10);

  const profile = useSelector((state: StoreTypes) => state.profile);
  const invoice = useSelector((state: StoreTypes) =>
    state.invoices.find((invoice) => invoice.id === id)
  );
  const client = useSelector((state: StoreTypes) =>
    state.clients.find((client) => client.id === invoice?.clientId)
  );
  const total = invoice?.items.reduce(
    (acc, item) => acc + Number(item.value),
    0
  ) || 0;

  return (
    <InvoiceViewer 
      invoiceData={invoice}
      exportPdf={exportPdf}
      exportJpg={exportJpg}
      currentDate={currentDate}
      profile={profile}
      client={client}
      total={total}
    />
  );
}

export default withAuth(Profile);
