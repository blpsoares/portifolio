/**
 * Tiny event bus so the AI chat can drive ambient visuals elsewhere on the page
 * (e.g. the hero's neural globe "thinks" while bra.ia is processing) without
 * coupling the components or threading props through the tree.
 */
export type AgentBusState = 'idle' | 'thinking';

const target: EventTarget | null = typeof window !== 'undefined' ? new EventTarget() : null;

export function setAgentState(state: AgentBusState): void {
  target?.dispatchEvent(new CustomEvent<AgentBusState>('agentstate', { detail: state }));
}

export function onAgentState(cb: (state: AgentBusState) => void): () => void {
  if (!target) return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<AgentBusState>).detail);
  target.addEventListener('agentstate', handler);
  return () => target.removeEventListener('agentstate', handler);
}
