"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const genai_1 = require("@google/genai");
const ai_prompts_1 = require("../prompts/ai.prompts");
const ai_validator_1 = require("../validators/ai.validator");
const ai_fallback_service_1 = require("./ai-fallback.service");
const ai_input_preparer_service_1 = require("./ai-input-preparer.service");
const DEFAULT_TIMEOUT_MS = 60000;
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;
class AiService {
    static getApiKey() {
        const key = process.env.GEMINI_API_KEY;
        if (!key || key.trim() === "" || key === "your_gemini_api_key_here") {
            return null;
        }
        return key.trim();
    }
    static getModelName() {
        return process.env.GEMINI_MODEL || "models/gemini-3.5-flash";
    }
    static getClient(apiKey) {
        if (this.cachedClientInstance &&
            this.cachedClientInstance.apiKey === apiKey) {
            return this.cachedClientInstance.client;
        }
        const client = new genai_1.GoogleGenAI({
            apiKey,
        });
        this.cachedClientInstance = {
            apiKey,
            client,
        };
        return client;
    }
    static executeWithTimeout(promise, timeoutMs) {
        return __awaiter(this, void 0, void 0, function* () {
            let timer;
            const timeout = new Promise((_, reject) => {
                timer = setTimeout(() => {
                    reject(new Error(`GEMINI_TIMEOUT: API request exceeded timeout limit of ${timeoutMs}ms.`));
                }, timeoutMs);
            });
            try {
                return yield Promise.race([promise, timeout]);
            }
            finally {
                clearTimeout(timer);
            }
        });
    }
    static isTransientError(err) {
        const msg = String((err === null || err === void 0 ? void 0 : err.message) || "");
        return (msg.includes("429") ||
            msg.includes("503") ||
            msg.includes("504") ||
            msg.includes("RESOURCE_EXHAUSTED") ||
            msg.includes("UNAVAILABLE") ||
            msg.includes("fetch failed") ||
            msg.includes("GEMINI_TIMEOUT"));
    }
    static generateReport() {
        return __awaiter(this, arguments, void 0, function* (userProfile = {}, historicalLogs = [], todayLog = {}, coachPersona = "Motivational") {
            const inputPayload = ai_input_preparer_service_1.AiInputPreparerService.prepareInputPayload({
                userProfile,
                historyLogs: historicalLogs,
                todayLog,
            });
            const apiKey = this.getApiKey();
            if (!apiKey) {
                console.warn("[AiService] No valid GEMINI_API_KEY configured. Using fallback.");
                return ai_fallback_service_1.AiFallbackService.generateFallbackReport(inputPayload);
            }
            const modelName = this.getModelName();
            const systemInstruction = ai_prompts_1.AiPrompts.getSystemInstruction(coachPersona);
            const userPromptText = ai_prompts_1.AiPrompts.getUserPrompt(inputPayload);
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
                    const response = yield this.executeWithTimeout(apiCallPromise, DEFAULT_TIMEOUT_MS);
                    const responseText = response.text || "";
                    if (!responseText.trim()) {
                        throw new Error("GEMINI_EMPTY_RESPONSE: Model returned empty output.");
                    }
                    const validated = ai_validator_1.AiValidator.validateAndClean(responseText);
                    return validated;
                }
                catch (err) {
                    console.warn(`[AiService] Attempt ${attempt}/${MAX_RETRIES} failed: ${(err === null || err === void 0 ? void 0 : err.message) || err}`);
                    const retry = this.isTransientError(err);
                    if (attempt < MAX_RETRIES && retry) {
                        console.log(`[AiService] Retrying in ${delayMs} ms...`);
                        yield new Promise((resolve) => setTimeout(resolve, delayMs));
                        delayMs *= 2;
                    }
                    else {
                        console.error("[AiService] Switching to offline fallback.");
                        break;
                    }
                }
            }
            return ai_fallback_service_1.AiFallbackService.generateFallbackReport(inputPayload);
        });
    }
}
exports.AiService = AiService;
AiService.cachedClientInstance = null;
