import { Invoice, Client } from "@/types"	

export const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'BRL', label: 'BRL'},
    { value: 'CAD', label: 'CAD' },
]

export const CLIENT: Client = {
    "id": "01e40fa4-58de-4dd0-84d0-0369a31c2e1b",
    "name": "Duff Beer Brewery",
    "email": "mr.burns@duffbeer.com",
    "owner": "Mr. Montgomery Burns",
    "address": "1 Nuclear Power Plant Way, Springfield, USA",
    "details": "Duff Beer Brewery, surprisingly owned by the wealthy and enigmatic Mr. Montgomery Burns, is a prominent brewery located within the sprawling grounds of the Springfield Nuclear Power Plant. Despite his typically ruthless business practices, Mr. Burns has managed to maintain the popularity of Duff Beer throughout Springfield."
}

export const INVOICE_DATA: Invoice =  {
    "id": "e85cb2da-6941-447a-a167-33243bb64d5e",
    "clientId": "01e40fa4-58de-4dd0-84d0-0369a31c2e1b",
    "currency": "USD",
    "items": [
        {
            "description": "Safety Operations Supervisor",
            "value": 5000
        }
    ],
    "dueDate": "2023-09-27",
    "details": "",
    "status": "unpaid",
    "invoiceNumber": "1",
    "total": "5000"
}

export const PROFILE = {
    "id": "531b5f0e-874f-4ee7-829a-b23e0d094e5d",
    "firstName": "Homer",
    "lastName": "Simpson",
    "company": "The Simpsons House",
    "email": "homersimpson@email.com",
    "phoneNumber": "+55 21 9 8899 3144",
    "address": "742 Evergreen Terrace",
    "bankingDetails": "<p><strong style=\"background-color: transparent;\">Beneficiary Bank</strong></p><ul><li><span style=\"background-color: transparent;\">SWIFT Code -&nbsp; TOP123444</span></li><li><span style=\"background-color: transparent;\">Bank and Address - SpringField Bank</span></li></ul><p><strong style=\"background-color: transparent;\">Beneficiary Customer Instruction</strong></p><ul><li><span style=\"background-color: transparent;\">IBAN -&nbsp; BR4675675670000431657240C1</span></li><li><span style=\"background-color: transparent;\">Name and address -&nbsp; </span>Bank of Springfield, Evergreen Terrace</li></ul><p><strong style=\"background-color: transparent;\">Intermediary Bank</strong></p><ul><li><span style=\"background-color: transparent;\">SWIFT Code - SCBL12344</span></li><li><span style=\"background-color: transparent;\">Bank and Address - </span>Bank of Springfield<span style=\"background-color: transparent;\"> - New York, USA</span></li><li><span style=\"background-color: transparent;\">Bank account holder - &nbsp;</span>Bank of Springfield</li><li><span style=\"background-color: transparent;\">Bank account number - 443123123</span></li></ul><p><br></p>",
    "signatureImage": "data:image/jpeg;base64,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"
}