import jwtDecode from 'jwt-decode';

export const setAccessToken = (token: string) => {
  localStorage.setItem('cc_token', token);
};

export const getAccessToken = () => {
  return localStorage.getItem('cc_token');
};

const refresh = async () => {
  const res = await fetch(`${process.env.REACT_APP_API}/users/refresh`, {
    credentials: 'include',
    method: 'POST',
  });
  const data = await res.json();
  const { accessToken } = data;
  setAccessToken(accessToken);
};

export const refreshToken = async () => {
  try {
    const currentToken = getAccessToken();
    if (currentToken) {
      const { exp } = jwtDecode(currentToken) as { exp: number };
      if (Date.now() >= exp * 1000) {
        await refresh();
      }
    } else await refresh();
  } catch (e) {
    console.log(e);
  }
};
