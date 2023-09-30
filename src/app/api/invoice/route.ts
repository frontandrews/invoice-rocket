import { INVOICE_DATA } from "@/constants";

export async function GET(request: Request) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    return Response.json(INVOICE_DATA)
}