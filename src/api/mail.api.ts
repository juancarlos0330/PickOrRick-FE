import {instance} from "./api";
import {ISendEmail} from "../types/mail.type";

export const mailAPI = {
    sendEmail: async (data: ISendEmail) => {
        const response = await instance.post<string>('mail', data);
        return response.data;
    },
}
