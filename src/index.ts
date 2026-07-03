import { character } from './character';

// Define core interfaces based on bullOS specification in bullos_docs.md
export interface IAgentRuntime {
  agentId: string;
  character: any;
  getSetting(key: string): string | undefined;
  createMemory(memory: any, tableName: string, unique?: boolean): Promise<string>;
  getMemories(options: any): Promise<any[]>;
  searchMemories(options: any): Promise<any[]>;
}

export interface ProjectAgent {
  character: typeof character;
  init: (runtime: IAgentRuntime) => Promise<void>;
  plugins?: any[];
}

export interface Project {
  agents: ProjectAgent[];
}

/**
 * bullOS Agent Runtime Initialization Block
 * Configures the project agents and registers lifecycle hooks.
 */
export const projectAgent: ProjectAgent = {
  character,
  init: async (runtime: IAgentRuntime) => {
    console.log(`[bOS-CORE] Initializing runtime for Agent: ${character.name}`);
    console.log(`[bOS-CORE] Identity UUID: ${character.id}`);
    console.log(`[bOS-CORE] Plugins loaded: ${character.plugins.join(', ')}`);
    
    // Perform warm-up sandbox checks
    const rpcSetting = runtime.getSetting('SOLANA_RPC_URL');
    if (rpcSetting) {
      console.log(`[bOS-CORE] Connected to RPC endpoint: ${rpcSetting}`);
    } else {
      console.warn(`[bOS-CORE] WARNING: SOLANA_RPC_URL not detected. Falling back to public cluster.`);
    }

    console.log(`[bOS-CORE] Agent ${character.name} is now ONLINE and scanning mempools.`);
  }
};

const project: Project = {
  agents: [projectAgent]
};

export default project;
