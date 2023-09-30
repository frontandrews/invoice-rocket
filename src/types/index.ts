
export interface Client {
    id: string;
    address: string;
    email: string;
    name: string;
    owner: string;
    details: string;
}

export interface Currency {
    value: string;
    label: string;
}

export interface InvoiceItem {
    description: string;
    value: number;
}

export interface Invoice {
    id: string;
    clientId: string;
    details: string;
    dueDate: string;
    invoiceNumber: string;
    items: InvoiceItem[];
    status: "unpaid" | "paid";
    total: string;
    currency: string;
}

export interface Profile {
    id: string;
    bankingDetails: string;
    company: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    signatureImage: string
    address: string;
}

export interface User {
    isAuthenticated: boolean;
    token: string;
    email: string;
}

export interface StoreTypes {
    profile: Profile;
    auth: {
        user: User
    };
    clients: Client[];
    invoices: Invoice[];
}

export interface InvoiceViewerProps {
    invoiceData?: Invoice | null,
    exportPdf: () => void,
    exportJpg: () => void,
    currentDate: string,
    profile: Profile,
    client?: Client,
    total: number,
    hasExport?: boolean,
}
