class Metadata {
  rx: number;
  tx: number;
}

class ClientData {
  clientPublicKey: string;
  metadata: Metadata;
}

export class SyncDataUsagePayload {
  dataUsage: ClientData[];
}
