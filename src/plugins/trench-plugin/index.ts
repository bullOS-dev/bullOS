import { Plugin } from '../../index'; // Relative imports for typings
import { snipeAction } from './actions/snipeAction';
import { latencyProvider } from './providers/latencyProvider';

/**
 * TrenchPlugin
 * Core plugin for autonomous Solana Trenching Engine.
 * Integrates sniping actions and network speed providers.
 */
export const trenchPlugin: Plugin = {
  name: "@usebullOS/plugin-trench",
  description: "High-performance Solana Trenching and MEV Sniping integration plugin.",
  
  // Register actions and providers
  actions: [snipeAction],
  providers: [latencyProvider],
  
  init: async (config: Record<string, string>, _runtime: any) => {
    console.log("[TRENCH-PLUGIN] Initializing trench-plugin wrapper...");
    console.log(`[TRENCH-PLUGIN] Configuration loaded: Jito Engine is targeting ${config.JITO_BLOCK_ENGINE_URL || "default queue"}`);
    console.log("[TRENCH-PLUGIN] Custom actions and providers registered successfully.");
  }
};

export default trenchPlugin;
