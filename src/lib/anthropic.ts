import Anthropic from "@anthropic-ai/sdk";

// Server-side only. Never import this file from a client component.
// The API key lives in ANTHROPIC_API_KEY and is read by the SDK automatically.
export const anthropic = new Anthropic();

export const CLAUDE_MODEL = "claude-sonnet-4-6";
