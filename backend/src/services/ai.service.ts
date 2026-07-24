import { GoogleGenAI } from "@google/genai";
import { AiInputPayload, AiOutputPayload, CoachPersona } from "../types/ai.types";
import { AiPrompts } from "../prompts/ai.prompts";
import { AiValidator } from "../validators/ai.validator";
import { AiFallbackService } from "./ai-fallback.service";
import { AiInputPreparerService } from "./ai-input-preparer.service";

const DEFAULT_TIMEOUT_MS = 60000;
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

export class AiService {
  private static cachedClientInstance: {
    apiKey: string;
    client: GoogleGenAI;
  } | null = null;

  private static getApiKey(): string | null {
    const key = process.env.GEMINI_API_KEY;

    if (!key || key.trim() === "" || key === "your_gemini_api_key_here") {
      return null;
    }

    return key.trim();
  }

  private static getModelName(): string {
    // gemini-1.5-flash has a higher free tier limit (1500 req/day) than newer preview models
    return process.env.GEMINI_MODEL || "models/gemini-1.5-flash";
  }

  private static getClient(apiKey: string): GoogleGenAI {
    if (
      this.cachedClientInstance &&
      this.cachedClientInstance.apiKey === apiKey
    ) {
      return this.cachedClientInstance.client;
    }

    const client = new GoogleGenAI({
      apiKey,
    });

    this.cachedClientInstance = {
      apiKey,
      client,
    };

    return client;
  }

  private static async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    let timer: NodeJS.Timeout;

    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(
          new Error(
            `GEMINI_TIMEOUT: API request exceeded timeout limit of ${timeoutMs}ms.`
          )
        );
      }, timeoutMs);
    });

    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timer!);
    }
  }

  private static isTransientError(err: any): boolean {
    const msg = String(err?.message || "").toLowerCase();

    // If we hit a quota limit, immediate retries in 1s or 2s will fail anyway,
    // because quota resets usually take a minute or a day.
    // Return false to immediately trigger the offline fallback report.
    if (msg.includes("quota exceeded") || msg.includes("429") || msg.includes("resource_exhausted")) {
      return false;
    }

    return (
      msg.includes("503") ||
      msg.includes("504") ||
      msg.includes("unavailable") ||
      msg.includes("fetch failed") ||
      msg.includes("gemini_timeout")
    );
  }

  static async generateReport(
    userProfile: any = {},
    historicalLogs: any[] = [],
    todayLog: any = {},
    coachPersona: CoachPersona = "Motivational"
  ): Promise<AiOutputPayload> {
    const inputPayload: AiInputPayload =
      AiInputPreparerService.prepareInputPayload({
        userProfile,
        historyLogs: historicalLogs,
        todayLog,
      });

    const apiKey = this.getApiKey();

    if (!apiKey) {
      console.warn(
        "[AiService] No valid GEMINI_API_KEY configured. Using fallback."
      );

      return AiFallbackService.generateFallbackReport(inputPayload);
    }

    const modelName = this.getModelName();
    const systemInstruction =
      AiPrompts.getSystemInstruction(coachPersona);
    const userPromptText =
      AiPrompts.getUserPrompt(inputPayload);

    const aiClient = this.getClient(apiKey);

    let delayMs = INITIAL_BACKOFF_MS;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const apiCallPromise = aiClient.models.generateContent({
          model: modelName,
          contents: userPromptText,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
          },
        });

        const response = await this.executeWithTimeout(
          apiCallPromise,
          DEFAULT_TIMEOUT_MS
        );

        const responseText = response.text || "";

        if (!responseText.trim()) {
          throw new Error(
            "GEMINI_EMPTY_RESPONSE: Model returned empty output."
          );
        }

        const validated =
          AiValidator.validateAndClean(responseText);

        return validated;
      } catch (err: any) {
        console.warn(
          `[AiService] Attempt ${attempt}/${MAX_RETRIES} failed: ${
            err?.message || err
          }`
        );

        const retry = this.isTransientError(err);

        if (attempt < MAX_RETRIES && retry) {
          console.log(
            `[AiService] Retrying in ${delayMs} ms...`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, delayMs)
          );

          delayMs *= 2;
        } else {
          console.error(
            "[AiService] Switching to offline fallback."
          );

          break;
        }
      }
    }

    return AiFallbackService.generateFallbackReport(inputPayload);
  }
}