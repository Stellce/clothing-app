import { JwtPayload } from "jwt-decode";

export interface JwtDecoded extends JwtPayload {
  azp?: string
  session_state?: string
  realm_access?: RealmAccess
  scope?: string
  sid?: string
  preferred_username?: string
  name?: string
}

export interface RealmAccess {
  roles: string[]
}
