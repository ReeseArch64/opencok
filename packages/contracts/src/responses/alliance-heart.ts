export interface AllianceHeartResponse {
  worldpoint: string;
}
export interface AllianceHeartLoginResponse {
  heart_allsender: string;
  heart_effecttype: string;
  heart_time: bigint;
}
export interface AllianceHeartNotificationResponse {
  point: string;
  effecttype: string;
  time: string;
  name?: string;
  receiveuid: string;
}
