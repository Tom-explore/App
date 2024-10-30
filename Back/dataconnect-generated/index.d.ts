import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;



export interface CreateEmailData {
  email_insert: Email_Key;
}

export interface CreateEmailVariables {
  content?: string | null;
  subject?: string | null;
}

export interface CreateRecipientData {
  recipient_insert: Recipient_Key;
}

export interface CreateRecipientVariables {
  emailId?: UUIDString | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  name: string;
  address: string;
}

export interface EmailMeta_Key {
  userUid: string;
  emailId: UUIDString;
  __typename?: 'EmailMeta_Key';
}

export interface Email_Key {
  id: UUIDString;
  __typename?: 'Email_Key';
}

export interface GetUidByEmailData {
  users: ({
    uid: string;
    address: string;
  } & User_Key)[];
}

export interface GetUidByEmailVariables {
  emails?: string[] | null;
}

export interface ListEmailsData {
  emails: ({
    id: UUIDString;
    subject: string;
    text: string;
    sent: DateString;
    from: {
      name: string;
    };
  } & Email_Key)[];
}

export interface ListInboxData {
  emails: ({
    id: UUIDString;
    subject: string;
    sent: DateString;
    content: string;
    sender: {
      name: string;
      address: string;
      uid: string;
    } & User_Key;
      to: ({
        user: {
          name: string;
          address: string;
          uid: string;
        } & User_Key;
      })[];
  } & Email_Key)[];
}

export interface ListSentData {
  emails: ({
    id: UUIDString;
    subject: string;
    sent: DateString;
    content: string;
    sender: {
      name: string;
      address: string;
      uid: string;
    } & User_Key;
      to: ({
        user: {
          name: string;
          address: string;
          uid: string;
        } & User_Key;
      })[];
  } & Email_Key)[];
}

export interface ListSentVariables {
  uid?: string | null;
}

export interface ListUsersData {
  users: ({
    uid: string;
    name: string;
    address: string;
  } & User_Key)[];
}

export interface Recipient_Key {
  emailId: UUIDString;
  userUid: string;
  __typename?: 'Recipient_Key';
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}



/* Allow users to create refs without passing in DataConnect */
export function listEmailsRef(): QueryRef<ListEmailsData, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listEmailsRef(dc: DataConnect): QueryRef<ListEmailsData,undefined>;

export function listEmails(): QueryPromise<ListEmailsData, undefined>;
export function listEmails(dc: DataConnect): QueryPromise<ListEmailsData,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function listUsersRef(): QueryRef<ListUsersData, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listUsersRef(dc: DataConnect): QueryRef<ListUsersData,undefined>;

export function listUsers(): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect): QueryPromise<ListUsersData,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function listInboxRef(): QueryRef<ListInboxData, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listInboxRef(dc: DataConnect): QueryRef<ListInboxData,undefined>;

export function listInbox(): QueryPromise<ListInboxData, undefined>;
export function listInbox(dc: DataConnect): QueryPromise<ListInboxData,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function getUidByEmailRef(vars?: GetUidByEmailVariables): QueryRef<GetUidByEmailData, GetUidByEmailVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getUidByEmailRef(dc: DataConnect, vars?: GetUidByEmailVariables): QueryRef<GetUidByEmailData,GetUidByEmailVariables>;

export function getUidByEmail(vars?: GetUidByEmailVariables): QueryPromise<GetUidByEmailData, GetUidByEmailVariables>;
export function getUidByEmail(dc: DataConnect, vars?: GetUidByEmailVariables): QueryPromise<GetUidByEmailData,GetUidByEmailVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listSentRef(vars?: ListSentVariables): QueryRef<ListSentData, ListSentVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listSentRef(dc: DataConnect, vars?: ListSentVariables): QueryRef<ListSentData,ListSentVariables>;

export function listSent(vars?: ListSentVariables): QueryPromise<ListSentData, ListSentVariables>;
export function listSent(dc: DataConnect, vars?: ListSentVariables): QueryPromise<ListSentData,ListSentVariables>;


/* Allow users to create refs without passing in DataConnect */
export function createUserRef(vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createUserRef(dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData,CreateUserVariables>;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData,CreateUserVariables>;


/* Allow users to create refs without passing in DataConnect */
export function createEmailRef(vars?: CreateEmailVariables): MutationRef<CreateEmailData, CreateEmailVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createEmailRef(dc: DataConnect, vars?: CreateEmailVariables): MutationRef<CreateEmailData,CreateEmailVariables>;

export function createEmail(vars?: CreateEmailVariables): MutationPromise<CreateEmailData, CreateEmailVariables>;
export function createEmail(dc: DataConnect, vars?: CreateEmailVariables): MutationPromise<CreateEmailData,CreateEmailVariables>;


/* Allow users to create refs without passing in DataConnect */
export function createRecipientRef(vars?: CreateRecipientVariables): MutationRef<CreateRecipientData, CreateRecipientVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createRecipientRef(dc: DataConnect, vars?: CreateRecipientVariables): MutationRef<CreateRecipientData,CreateRecipientVariables>;

export function createRecipient(vars?: CreateRecipientVariables): MutationPromise<CreateRecipientData, CreateRecipientVariables>;
export function createRecipient(dc: DataConnect, vars?: CreateRecipientVariables): MutationPromise<CreateRecipientData,CreateRecipientVariables>;


