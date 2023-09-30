import axios, { AxiosResponse } from 'axios';
import { Invoice, Client, Profile } from '@/types/index';

export const fetchAllData = async () => {
  const fetchInvoice = axios.get<Invoice>('/api/invoice');
  const fetchClient = axios.get<Client>('/api/client');
  const fetchProfile = axios.get<Profile>('/api/profile');

  const [invoiceResp, clientResp, profileResp]: [
    AxiosResponse<Invoice>,
    AxiosResponse<Client>,
    AxiosResponse<Profile>
  ] = await Promise.all([fetchInvoice, fetchClient, fetchProfile]);

  const { data: invoiceData } = invoiceResp;
  const { data: clientData } = clientResp;
  const { data: profileData } = profileResp;

  return {
    invoiceData,
    clientData,
    profileData,
  };
};
