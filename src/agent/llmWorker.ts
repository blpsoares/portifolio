/**
 * Dedicated Web Worker that hosts the WebLLM engine.
 *
 * Running the engine off the main thread is what makes the ~950 MB download and
 * the WebGPU inference invisible to the visitor: the page never janks, the
 * neural globe keeps spinning, and the rule-based chat stays fully usable while
 * the weights stream in behind the scenes.
 */
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};
