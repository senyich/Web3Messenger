import { createHelia } from 'helia';
import { json } from '@helia/json';
import type { Helia } from '@helia/interface';
import { CID } from 'multiformats/cid';

let heliaInstance: Helia | null = null;
let jsonInstance: ReturnType<typeof json> | null = null;

export const initIPFS = async (): Promise<Helia> => {
  if (!heliaInstance) {
    heliaInstance = await createHelia();
    jsonInstance = json(heliaInstance);
  }
  return heliaInstance;
};

export const storeToIPFS = async <T>(data: T): Promise<string> => {
  await initIPFS();
  if (!jsonInstance) throw new Error("IPFS not initialized");
  
  const cid = await jsonInstance.add(data);
  return cid.toString();
};

export const getFromIPFS = async <T>(cid: string): Promise<T> => {
  await initIPFS();
  if (!jsonInstance) throw new Error("IPFS not initialized");
  
  const parsedCID = CID.parse(cid);
  return jsonInstance.get(parsedCID);
};

export const destroyIPFS = async () => {
  if (heliaInstance) {
    await heliaInstance.stop();
    heliaInstance = null;
    jsonInstance = null;
  }
};