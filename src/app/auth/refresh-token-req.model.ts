export interface RefreshTokenReq {
  grant_type: string;
  refresh_token: string;
  client_id: string;
  client_secret: string;
}
