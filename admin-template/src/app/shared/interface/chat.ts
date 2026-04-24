export interface IRecentChats {
  id: number;
  user_name?: string;
  user_profile?: string;
  message_time: string;
  last_message: string;
  user_status?: string;
  unread_message?: number;
  last_seen?: string;
  chats?: IChat[];
  group_name?: string;
  group_members?: IGroupMembers[];
  total_members?: number;
  group_profile?: string;
}

export interface IChat {
  chat: string;
  is_reply: boolean;
  time: string;
  user_name?: string;
}

export interface IContact {
  id: number;
  user_name: string;
  user_profile?: string;
  contact_number: string;
}

export interface IGroupChat {
  id: number;
  group_name: string;
  group_members: IGroupMembers[];
  total_members: number;
  message_time: string;
  last_message: string;
  chats?: IChat[];
}

export interface IGroupMembers {
  user_name: string;
  user_profile: string;
}
