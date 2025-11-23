import { JoinedProviderEnum } from "@prisma/client";

export type TRegisterOrLoginUserPayload = {
    email: string;
    name: string;
    image: string;
    provider: JoinedProviderEnum;
    providerId: string;
};