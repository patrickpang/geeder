import { createDefine } from "fresh";
import type { Client } from "@libsql/client";

export interface State {
  turso: Client;
}

export const define = createDefine<State>();
