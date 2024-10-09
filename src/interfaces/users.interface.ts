export interface User {
  _id: string;
  full_name: string;
  about: string;
  email: string;
  password: string;
  position_id: number;
  userType: string
  status: number;
  remark: string;
  token: any;
  device_token: any;
  createdAt: any
}
