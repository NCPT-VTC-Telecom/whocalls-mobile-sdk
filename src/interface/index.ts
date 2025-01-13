export interface ContactList {
  index?: number;
  item: ContactInfomation;
}

export interface ContactInfomation {
  phoneNumbers: NumberInformation[];
  isStarred: boolean;
  postalAddresses: any[];
  thumbnailPath: string;
  department: string;
  jobTitle: string;
  emailAddresses: Email[] | any;
  urlAddresses: any[];
  suffix: string | null;
  company: string | null;
  imAddresses: any[];
  note: null;
  middleName: string;
  displayName: string;
  familyName: string;
  givenName: string;
  prefix: string | null;
  hasThumbnail: boolean;
  rawContactId: number;
  recordID: number;
}

export interface NumberInformation {
  id?: number;
  label?: string;
  number: number;
}

export interface Email {}
