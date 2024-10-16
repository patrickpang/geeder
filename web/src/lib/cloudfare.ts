import { createMiddleware } from "@solidjs/start/middleware";
import { getRequestEvent } from "solid-js/web";

export const env = () => {
  const event = getRequestEvent();
  const env = event?.nativeEvent.context.cloudflare.env ?? process.env;
  return env;
};

export default createMiddleware({
  onRequest: [
    async (event) => {
      // inject cloudfare locally
      if (!import.meta.env.PROD) {
        const wrangler = await import("wrangler");
        const proxy = await wrangler.getPlatformProxy();
        // @ts-ignore
        event.nativeEvent.context.cloudflare = proxy;
      }
    },
  ],
});
