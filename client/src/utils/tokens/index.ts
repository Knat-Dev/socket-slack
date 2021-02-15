export const setAccessToken = (token: string) => {
  localStorage.setItem('cc_token', token);
};

export const getAccessToken = () => {
  return localStorage.getItem('cc_token');
};
