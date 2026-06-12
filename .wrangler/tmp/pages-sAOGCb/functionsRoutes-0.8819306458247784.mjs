import { onRequestPost as __api_chat_ts_onRequestPost } from "/home/mithrandir/embark-me/packages/portifolio/functions/api/chat.ts"
import { onRequestGet as __api_models_ts_onRequestGet } from "/home/mithrandir/embark-me/packages/portifolio/functions/api/models.ts"

export const routes = [
    {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_ts_onRequestPost],
    },
  {
      routePath: "/api/models",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_models_ts_onRequestGet],
    },
  ]