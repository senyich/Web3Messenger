import { createHelia } from 'helia';
import { json } from '@helia/json';
import type { Helia } from '@helia/interface';
import { CID } from 'multiformats/cid';
import { LevelBlockstore } from 'blockstore-level';
import { LevelDatastore } from 'datastore-level';

let heliaInstance: Helia | null = null;
let jsonInstance: ReturnType<typeof json> | null = null;
// const PROJECT_ID = 'b704286137144e42ba079b2b90cad659';
// const PROJECT_SECRET = 'DQxTQsMUrFcIeJwoaan40VpD1BbRDW4+bq+1yWEaeXkGttRwnarKPw"'; 

export const initIPFS = async (): Promise<Helia> => {
  if (!heliaInstance) {
    const blockstore = new LevelBlockstore('./ipfs/blocks');
    const datastore = new LevelDatastore('./ipfs/data');
    
    await Promise.all([blockstore.open(), datastore.open()]);

    heliaInstance = await createHelia({
      blockstore,
      datastore,
    });
    
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
