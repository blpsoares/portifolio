-- Conversation log for the bra.ia chat.
--
-- Logged from the BROWSER, not from `/api/chat`. Two of the three brains never
-- touch the server: the in-browser WebLLM model and the deterministic rule
-- engine both answer locally. Capturing the turn server-side would therefore
-- miss exactly the cases worth studying — every fallback, and every wrong
-- deterministic answer. The client posts the finished turn instead.
--
-- Apply:  wrangler d1 execute bryan-chat --remote --file=./migrations/0001_chat_logs.sql

CREATE TABLE IF NOT EXISTS chat_turns (
  id            TEXT PRIMARY KEY,
  -- Epoch milliseconds, stamped by the server so a wrong client clock cannot
  -- scatter rows across the timeline.
  created_at    INTEGER NOT NULL,
  -- Random per-browser id from localStorage. Not an account, not an identity:
  -- it only exists to group turns of one conversation.
  session_id    TEXT NOT NULL,
  locale        TEXT NOT NULL,
  -- 'cloud' (OpenRouter) | 'webllm' (in-browser LLM) | 'local' (rule engine).
  source        TEXT NOT NULL,
  model         TEXT,
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  -- Which action the agent took, if any, and whether it actually ran.
  tool_name     TEXT,
  tool_arg      TEXT,
  -- Milliseconds from send to last token.
  latency_ms    INTEGER,
  -- Set when the cloud brain declined and something else answered.
  fallback_reason TEXT,
  -- Section the visitor was looking at when they asked.
  section       TEXT,
  -- 1 = helpful, -1 = not helpful, NULL = no verdict given.
  rating        INTEGER,
  rated_at      INTEGER
);

CREATE INDEX IF NOT EXISTS idx_chat_turns_created ON chat_turns (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_turns_session ON chat_turns (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_turns_rating  ON chat_turns (rating) WHERE rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chat_turns_source  ON chat_turns (source, created_at);
