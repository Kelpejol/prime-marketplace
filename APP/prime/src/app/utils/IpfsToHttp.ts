export const ipfsToHttp = (ipfsUri: string | undefined) => {
  if (!ipfsUri) return '';
  const gateway = 'https://ipfs.io/ipfs/';
  return ipfsUri.replace('ipfs://', gateway);
};