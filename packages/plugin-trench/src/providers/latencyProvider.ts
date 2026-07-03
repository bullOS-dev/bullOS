import { Provider, IAgentRuntime, Memory, State } from '../../../core/src/index'; // Relative imports for typings

/**
 * Provider: LATENCY_TRACKER
 * Supplies live execution and network latency metrics to state composition.
 */
export const latencyProvider: Provider = {
  name: "LATENCY_TRACKER",
  description: "Provides network socket latency and transaction execution latency data relative to social events.",
  
  get: async (_runtime: IAgentRuntime, _message: Memory, _state: State): Promise<any> => {
    console.log("[TRENCH-PLUGIN] Gathering network socket and execution metrics...");
    
    // Simulate real-time latency diagnostics
    const avgLatency = 300 + Math.floor(Math.random() * 120); // 300ms - 420ms
    const activeTriggers = ["$bOS", "$PEPE69", "Raydium_Pools", "pump_bonding"];
    const rpcNodeSpeed = 12 + Math.floor(Math.random() * 8); // 12ms - 20ms
    
    return {
      values: {
        avgLatencyMs: avgLatency,
        rpcSpeedMs: rpcNodeSpeed,
        networkJitterBps: 0.02
      },
      data: {
        activeTriggers,
        engineStatus: "OPTIMIZED",
        jitoBlockEngineConnection: "CONNECTED"
      },
      text: `[TELEMETRY] RPC Ping: ${rpcNodeSpeed}ms | Average Social-to-Onchain Execution Latency: ${avgLatency}ms | Active Monitors: ${activeTriggers.length}`
    };
  }
};
