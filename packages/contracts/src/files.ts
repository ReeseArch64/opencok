export const FILE_LIMIT = 2097152;
export const BODY_LIMIT = 2162688;
export const UPLOAD_PATH = "/gameservice/www/gateway/json.php";
export const IMAGE_PATH = /^\/cok\/img\/([0-9]{1,6})\/([a-f0-9]{32})\.jpg$/;
export interface ImageStore {
  put(key: string, bytes: Buffer, owner: string, seq: string, hash: string): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
  find(owner: string, sequence: string): Promise<UploadReceipt | null>;
}
export interface UploadReceipt {
  owner: string;
  sequence: string;
  hash: string;
}
