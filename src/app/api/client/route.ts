import { CLIENT } from "@/constants";

export async function GET(request: Request) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    return Response.json(CLIENT)
}