import { type TUser } from '@jobie/users/types';
import { type Request } from 'express';

export type AuthorizedRequest = Request & { authToken: string; user?: TUser };
