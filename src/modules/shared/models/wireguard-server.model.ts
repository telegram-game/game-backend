interface BaseWireGuardServerPayload {
  serverScheme?: string;
  serverIp: string;
  serverPort: number;
  ipv6Enabled?: boolean;
}

export interface WireGuardServerExchangePeerPayload
  extends BaseWireGuardServerPayload {
  clientPublicKey: string;
  isPresharedKey?: boolean;
  isUneyGuard?: boolean;
  dns?: string;
}

export interface WireGuardServerExchangePeerOriginResponse {
  serverPublicKey: string;
  allowIps: string[];
  presharedKey?: string;
  jc?: number;
  jmin?: number;
  jmax?: number;
  s1?: number;
  s2?: number;
  h1?: number;
  h2?: number;
  h3?: number;
  h4?: number;
}

export interface WireGuardServerExchangePeerResponse {
  serverPublicKey: string;
  allowIps: string[];
  presharedKey?: string;
  junkPacketCount?: number;
  junkPacketMinSize?: number;
  junkPacketMaxSize?: number;
  initPacketJunkSize?: number;
  responsePacketJunkSize?: number;
  initPacketMagicHeader?: number;
  responsePacketMagicHeader?: number;
  underloadPacketMagicHeader?: number;
  transportPacketMagicHeader?: number;
}

export interface WireGuardServerRemovePeerPayload
  extends BaseWireGuardServerPayload {
  clientPublicKey: string;
  serverPort: number;
}
