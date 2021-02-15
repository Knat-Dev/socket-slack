export type Message = {
  channelId: string;
  text: string;
  user: User;
  _id?: string; // created on the server
  // to be passed to the server and then back to the user to be replaced with
  optimisticId?: string;
};

export type User = {
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  _id: string;
};
