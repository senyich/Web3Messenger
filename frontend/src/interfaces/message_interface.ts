export interface Message {
  CID: string;
  ownerAddress: string;
  timestamp: string;
  fromAddress: string; 
  toAddress: string;  
}

export interface AddMessageParams {
  CID: string;
  timestamp: string;
  fromAddress: string; 
  toAddress: string;   
}

export interface MessageContent {
  content: string;
}