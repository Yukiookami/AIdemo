import { Ollama } from "ollama";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://shiro-windows:11434";

const ollama = new Ollama({ host: OLLAMA_HOST });

export default ollama;
