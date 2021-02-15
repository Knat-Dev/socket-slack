export type Message = {
  channelId: string;
  text: string;
  user: User;
  _id?: string; // created on the server
  // to be passed to the server and then back to the user to be replaced with
  optimisticId?: string;
};

export type Channel = {
  teamId: string;
  _id: string;
  name: string;
};

export type Team = {
  name: string;
  _id: string;
  optimisticId?: string;
  channels: Channel[];
};

export type User = {
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  teams: Team[];
  _id: string;
};
