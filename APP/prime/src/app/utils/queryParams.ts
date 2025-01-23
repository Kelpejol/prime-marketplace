import qs from 'query-string';

export const queryParams = ( path: string, view: string, user: string) => {
  const url = qs.stringifyUrl(
    {
      url: path,  
      query: {
        view,
        user
      }
    },
    { skipNull: true }
  );
  return url;
};