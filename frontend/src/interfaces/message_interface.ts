export interface Message {
  CID: string;
  ownerAddress: string;
  timestamp: string;
}
export interface AddMessageParams {
  CID: string;
  timestamp: string;
}