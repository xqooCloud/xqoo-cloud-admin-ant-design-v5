
export interface GetUploadSignParam{
  path?: string;
  accessType: 'public' | 'protected'
}

export interface SignBodyServer{
  accessid: string;
  callback: string;
  dir: string;
  expire: string;
  host: string;
  policy: string;
  signature: string;
}
