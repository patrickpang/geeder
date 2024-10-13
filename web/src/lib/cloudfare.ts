import { getRequestEvent } from "solid-js/web";

export const env = () => {
  const event = getRequestEvent();
  const env = event?.nativeEvent.context.cloudflare.env ?? process.env;
  return env;
};
