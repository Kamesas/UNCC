// gemma3-enhanced-rag-chat.ts

import { Ollama, ChatResponse, Message, EmbeddingsResponse } from "ollama";
import * as readline from "readline";
import * as fs from "fs/promises";
import * as path from "path";

const OLLAMA_HOST = "http://localhost:11434";
const CHAT_MODEL = "gemma3:4b";
const EMBEDDING_MODEL = "nomic-embed-text:latest";
const CONTEXT_FILE = "user_profile.json";
const EMBEDDINGS_FILE = "embeddings_cache.json";

interface UserProfile {
  name: string;
  age: number;
  nationality: string;
  languages: string[];
  skills: string[];
  interests: string[];
  personalityTraits: string[];
  conversationHistory: ConversationEntry[];
  knowledgeBase: KnowledgeEntry[];
}

interface ConversationEntry {
  id: string;
  timestamp: number;
  userInput: string;
  botResponse: string;
  embedding?: number[];
  topics: string[];
}

interface KnowledgeEntry {
  id: string;
  content: string;
  category: string;
  embedding?: number[];
  relevanceScore?: number;
}

interface EmbeddingCache {
  [key: string]: number[];
}

const ollama = new Ollama({ host: OLLAMA_HOST });

// Cosine similarity function
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Generate embeddings using nomic-embed-text
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response: EmbeddingsResponse = await ollama.embeddings({
      model: EMBEDDING_MODEL,
      prompt: text,
    });
    return response.embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return [];
  }
}

// Load embeddings cache
async function loadEmbeddingsCache(): Promise<EmbeddingCache> {
  try {
    const filePath = path.join(process.cwd(), EMBEDDINGS_FILE);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Save embeddings cache
async function saveEmbeddingsCache(cache: EmbeddingCache): Promise<void> {
  const filePath = path.join(process.cwd(), EMBEDDINGS_FILE);
  await fs.writeFile(filePath, JSON.stringify(cache, null, 2), "utf-8");
}

// Get or generate embedding with caching
async function getOrGenerateEmbedding(
  text: string,
  cache: EmbeddingCache
): Promise<number[]> {
  const key = text.substring(0, 100); // Use first 100 chars as key

  if (cache[key]) {
    return cache[key];
  }

  const embedding = await generateEmbedding(text);
  cache[key] = embedding;
  await saveEmbeddingsCache(cache);
  return embedding;
}

async function loadUserProfile(): Promise<UserProfile> {
  const defaultProfile: UserProfile = {
    name: "Alex",
    age: 37,
    nationality: "Ukrainian",
    languages: ["Ukrainian", "English (learning)"],
    skills: ["React", "Next.js", "TypeScript", "Node.js (learning)"],
    interests: ["Web Development", "Programming", "Technology"],
    personalityTraits: ["Curious", "Detail-oriented", "Learning-focused"],
    conversationHistory: [],
    knowledgeBase: [
      {
        id: "1",
        content:
          "Alex is a 37-year-old Ukrainian developer who specializes in React and TypeScript",
        category: "personal",
      },
      {
        id: "2",
        content:
          "Alex is actively learning English and Node.js to expand his technical skills",
        category: "learning",
      },
      {
        id: "3",
        content:
          "Alex works with React, Next.js, and TypeScript in his development projects",
        category: "technical",
      },
    ],
  };

  try {
    const filePath = path.join(process.cwd(), CONTEXT_FILE);
    const data = await fs.readFile(filePath, "utf-8");
    const profile = { ...defaultProfile, ...JSON.parse(data) };

    // Ensure arrays exist
    profile.conversationHistory = profile.conversationHistory || [];
    profile.knowledgeBase =
      profile.knowledgeBase || defaultProfile.knowledgeBase;

    // Clean up conversation history - convert old string format to new object format
    profile.conversationHistory = profile.conversationHistory
      .filter((entry: any) => typeof entry === "object" && entry !== null)
      .map((entry: any) => {
        // Ensure all required properties exist
        if (!entry.id) entry.id = Date.now().toString() + Math.random();
        if (!entry.timestamp) entry.timestamp = Date.now();
        if (!entry.topics) entry.topics = ["General"];
        if (!entry.userInput) entry.userInput = "Unknown";
        if (!entry.botResponse) entry.botResponse = "Unknown";
        return entry as ConversationEntry;
      });

    return profile;
  } catch {
    await saveUserProfile(defaultProfile);
    return defaultProfile;
  }
}

async function saveUserProfile(profile: UserProfile): Promise<void> {
  const filePath = path.join(process.cwd(), CONTEXT_FILE);
  await fs.writeFile(filePath, JSON.stringify(profile, null, 2), "utf-8");
}

// Find relevant context using embeddings
async function findRelevantContext(
  query: string,
  profile: UserProfile,
  cache: EmbeddingCache,
  maxResults: number = 5
): Promise<string[]> {
  const queryEmbedding = await getOrGenerateEmbedding(query, cache);

  if (queryEmbedding.length === 0) {
    return [];
  }

  // Search through conversation history
  const conversationMatches: Array<{ content: string; score: number }> = [];

  // Ensure conversationHistory contains proper objects
  const validEntries = profile.conversationHistory.filter(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      typeof entry.userInput === "string" &&
      typeof entry.botResponse === "string"
  );

  for (const entry of validEntries) {
    if (!entry.embedding || entry.embedding.length === 0) {
      entry.embedding = await getOrGenerateEmbedding(
        `${entry.userInput} ${entry.botResponse}`,
        cache
      );
    }

    if (entry.embedding && entry.embedding.length > 0) {
      const score = cosineSimilarity(queryEmbedding, entry.embedding);
      if (score > 0.3) {
        // Threshold for relevance
        conversationMatches.push({
          content: `Previous: User: "${
            entry.userInput
          }" Bot: "${entry.botResponse.substring(0, 100)}..."`,
          score,
        });
      }
    }
  }

  // Search through knowledge base
  const knowledgeMatches: Array<{ content: string; score: number }> = [];
  for (const entry of profile.knowledgeBase) {
    if (!entry.embedding) {
      entry.embedding = await getOrGenerateEmbedding(entry.content, cache);
    }

    if (entry.embedding.length > 0) {
      const score = cosineSimilarity(queryEmbedding, entry.embedding);
      if (score > 0.2) {
        knowledgeMatches.push({
          content: `Knowledge: ${entry.content}`,
          score,
        });
      }
    }
  }

  // Combine and sort by relevance
  const allMatches = [...conversationMatches, ...knowledgeMatches]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return allMatches.map((match) => match.content);
}

function formatEnhancedContext(
  profile: UserProfile,
  relevantContext: string[]
): string {
  return `COMPREHENSIVE USER INFORMATION - ALWAYS REMEMBER AND USE:

PERSONAL DETAILS:
- Name: ${profile.name}
- Age: ${profile.age} years old  
- Nationality: ${profile.nationality}
- Languages: ${profile.languages.join(", ")}

TECHNICAL EXPERTISE:
- Skills: ${profile.skills.join(", ")}
- Currently learning: Node.js and English

INTERESTS & TRAITS:
- Interests: ${profile.interests.join(", ")}
- Personality: ${profile.personalityTraits.join(", ")}

RELEVANT CONTEXT FROM PREVIOUS INTERACTIONS:
${
  relevantContext.length > 0
    ? relevantContext.join("\n")
    : "No directly relevant previous context found"
}

INSTRUCTIONS FOR RESPONSES:
1. ALWAYS address ${profile.name} by name
2. Reference his Ukrainian background naturally
3. Connect responses to his React/TypeScript work when appropriate
4. Encourage his English and Node.js learning journey
5. Use the relevant context above to provide personalized responses
6. When asked what you know about him, provide a comprehensive summary`;
}

function extractTopics(text: string): string[] {
  const topics: string[] = [];
  const lowerText = text.toLowerCase();

  // Technical topics
  if (lowerText.includes("react") || lowerText.includes("component"))
    topics.push("React");
  if (lowerText.includes("typescript") || lowerText.includes("type"))
    topics.push("TypeScript");
  if (lowerText.includes("node") || lowerText.includes("nodejs"))
    topics.push("Node.js");
  if (lowerText.includes("javascript") || lowerText.includes("js"))
    topics.push("JavaScript");
  if (lowerText.includes("next") || lowerText.includes("nextjs"))
    topics.push("Next.js");

  // Learning topics
  if (lowerText.includes("english") || lowerText.includes("language"))
    topics.push("English Learning");
  if (lowerText.includes("learn") || lowerText.includes("study"))
    topics.push("Learning");

  // Personal topics
  if (lowerText.includes("ukraine") || lowerText.includes("ukrainian"))
    topics.push("Ukraine");
  if (lowerText.includes("age") || lowerText.includes("old"))
    topics.push("Personal");

  return topics.length > 0 ? topics : ["General"];
}

async function updateConversationHistory(
  profile: UserProfile,
  userInput: string,
  botResponse: string,
  cache: EmbeddingCache
): Promise<void> {
  const entry: ConversationEntry = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    userInput,
    botResponse,
    topics: extractTopics(`${userInput} ${botResponse}`),
  };

  // Generate embedding for the conversation
  entry.embedding = await getOrGenerateEmbedding(
    `${userInput} ${botResponse}`,
    cache
  );

  profile.conversationHistory.push(entry);

  // Keep only last 50 conversations to prevent bloat
  if (profile.conversationHistory.length > 50) {
    profile.conversationHistory = profile.conversationHistory.slice(-50);
  }

  await saveUserProfile(profile);
}

function isAboutUserQuery(input: string): boolean {
  const aboutMeKeywords = [
    "what do you know about me",
    "tell me about myself",
    "what do you remember about me",
    "who am i",
    "what information do you have",
    "what have we talked about",
  ];

  return aboutMeKeywords.some((keyword) =>
    input.toLowerCase().includes(keyword.toLowerCase())
  );
}

export async function runEnhancedRAGChat() {
  console.log(`--- Enhanced Gemma3 RAG Chat with Embeddings ---`);
  console.log(`Loading user profile and embeddings cache...`);

  let userProfile = await loadUserProfile();
  const embeddingsCache = await loadEmbeddingsCache();

  console.log(
    `Hello ${userProfile.name}! I have semantic search enabled for better context retrieval.\n`
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userInput = await new Promise<string>((resolve) =>
      rl.question("You: ", resolve)
    );

    if (userInput.toLowerCase() === "exit") {
      rl.close();
      break;
    }

    console.log("🔍 Finding relevant context...");

    // Find relevant context using embeddings
    const relevantContext = await findRelevantContext(
      userInput,
      userProfile,
      embeddingsCache,
      isAboutUserQuery(userInput) ? 10 : 5
    );

    // Create enhanced context
    const enhancedContext = formatEnhancedContext(userProfile, relevantContext);

    const messages: Message[] = [
      {
        role: "system",
        content: `You are a helpful AI assistant with access to detailed user information and conversation history.

${enhancedContext}

Respond naturally and conversationally while demonstrating that you remember and understand the context.`,
      },
    ];

    if (isAboutUserQuery(userInput)) {
      messages.push({
        role: "user",
        content: `${userInput}

Please provide a comprehensive summary of what you know about me, including recent conversations and relevant details.`,
      });
    } else {
      messages.push({ role: "user", content: userInput });
    }

    try {
      console.log("🤖 Generating response...");

      const response: ChatResponse = await ollama.chat({
        model: CHAT_MODEL,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          repeat_penalty: 1.1,
        },
      });

      const botResponse = response.message.content;
      console.log(`Bot: ${botResponse}\n`);

      // Update conversation history with embeddings
      await updateConversationHistory(
        userProfile,
        userInput,
        botResponse,
        embeddingsCache
      );

      // Reload profile
      userProfile = await loadUserProfile();
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

export async function addKnowledgeEntry(
  content: string,
  category: string
): Promise<void> {
  const profile = await loadUserProfile();
  const cache = await loadEmbeddingsCache();

  const entry: KnowledgeEntry = {
    id: Date.now().toString(),
    content,
    category,
    embedding: await getOrGenerateEmbedding(content, cache),
  };

  profile.knowledgeBase.push(entry);
  await saveUserProfile(profile);
  console.log(`Added knowledge entry: ${content}`);
}

export async function searchConversations(query: string): Promise<void> {
  const profile = await loadUserProfile();
  const cache = await loadEmbeddingsCache();

  const relevantContext = await findRelevantContext(query, profile, cache, 10);

  console.log(`\n--- Search Results for: "${query}" ---`);
  relevantContext.forEach((context, index) => {
    console.log(`${index + 1}. ${context}`);
  });
  console.log("");
}

export async function resetUserProfile(): Promise<void> {
  const filePath = path.join(process.cwd(), CONTEXT_FILE);
  const embeddingsPath = path.join(process.cwd(), EMBEDDINGS_FILE);

  try {
    await fs.unlink(filePath);
    await fs.unlink(embeddingsPath);
    console.log("User profile and embeddings cache reset successfully!");
  } catch {
    console.log("No files to reset.");
  }
}

// Uncomment to run directly
runEnhancedRAGChat().catch(console.error);
