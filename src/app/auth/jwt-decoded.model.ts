import { JwtPayload } from "jwt-decode";

export interface JwtDecoded extends JwtPayload {
  azp?: string
  session_state?: string
  realm_access?: RealmAccess
  scope?: string
  sid?: string
  preferred_username?: string
  name?: string
  lastname?: string
  email?: string
  picture?: string
}

export interface GoogleJwtDecoded extends JwtPayload {
  azp: string
  email: string
  email_verified: boolean
  at_hash: string
  name: string
  picture: string
  given_name: string
  iat: number
}

export interface RealmAccess {
  roles: string[]
}
