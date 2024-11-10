export class UserInfo {
  userId?: string;
  userEmail?: string;
  deviceId?: string;
  [k: string]: any;
}
export class RequestContext {
  cid: string;
  requestTimestamp: number;
  userInfo: UserInfo;
  deviceId?: string;
  lang?: string;
  accesstoken?: string;
  constructor(data: Partial<RequestContext>) {
    Object.assign(this, data);
  }
}
