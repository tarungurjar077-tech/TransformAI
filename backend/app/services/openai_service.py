import os
import logging
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("transformai.openai")

class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "").strip()
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o").strip()
        self.client = None
        self._init_client()

    def _init_client(self):
        if self.api_key and not self.api_key.startswith("your-") and len(self.api_key) > 10:
            try:
                import openai
                self.client = openai.OpenAI(api_key=self.api_key)
                logger.info(f"[OpenAI] Initialized client with model '{self.model}'.")
            except Exception as e:
                logger.error(f"[OpenAI] Client initialization failed: {e}")
                self.client = None
        else:
            self.client = None
            logger.info("[OpenAI] No OPENAI_API_KEY detected. Demo Mode will be utilized.")

    def is_configured(self) -> bool:
        return self.client is not None

    def get_status(self) -> Dict[str, Any]:
        return {
            "configured": self.is_configured(),
            "model": self.model if self.is_configured() else "Demo Engine (Offline Simulator)",
            "api_key_set": bool(self.api_key and len(self.api_key) > 5)
        }

    async def generate_content(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 3000
    ) -> str:
        """
        Executes a prompt completion against the OpenAI API.
        """
        if not self.is_configured():
            raise ValueError(
                "OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file "
                "or enable Demo Mode."
            )

        try:
            # First try requested model
            models_to_try = [self.model]
            if self.model != "gpt-4o":
                models_to_try.append("gpt-4o")
            if "gpt-4o-mini" not in models_to_try:
                models_to_try.append("gpt-4o-mini")

            last_err = None
            for model_name in models_to_try:
                try:
                    response = self.client.chat.completions.create(
                        model=model_name,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        temperature=temperature,
                        max_tokens=max_tokens
                    )
                    return response.choices[0].message.content or ""
                except Exception as call_err:
                    last_err = call_err
                    logger.warning(f"[OpenAI] Call to {model_name} failed: {call_err}. Trying fallback...")
                    continue
            
            raise last_err or RuntimeError("OpenAI completion failed across all candidate models.")

        except Exception as exc:
            logger.error(f"[OpenAI] Execution exception: {exc}")
            raise RuntimeError(f"OpenAI API Error: {str(exc)}")

openai_service = OpenAIService()
