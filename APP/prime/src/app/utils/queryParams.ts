import qs from 'query-string';

export const queryParams = ( path: string, view: string) => {
  const url = qs.stringifyUrl(
    {
      url: path,  
      query: {
        view
      }
    },
    { skipNull: true }
  );
  return url;
};