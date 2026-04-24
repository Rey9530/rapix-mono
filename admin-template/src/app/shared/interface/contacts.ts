export interface IContactSidebarList {
  id: number;
  title: string;
  value?: string;
}

export interface IContact {
  id: number;
  first_name: string;
  last_name: string;
  profile: string;
  gender: string;
  DOB: string;
  personality: string;
  city: string;
  contact_number: string;
  email: string;
  website: string;
  interest: string;
  category: string;
  contact_type: string;
}

export interface INewContactInput {
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  contact_type: string;
}
