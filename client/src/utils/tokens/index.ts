export const setAccessToken = (token: string) => {
  localStorage.setItem('cc_token', token);
};

export const getAccessToken = () => {
  return localStorage.getItem('cc_token');
};

export const refreshToken = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API}/users/refresh`, {
      credentials: 'include',
      method: 'POST',
    });
    const data = await res.json();
    const { accessToken } = data;
    setAccessToken(accessToken);
  } catch (e) {
    console.log(e);
  }
};
