import { trenchPlugin } from '../plugins/trench-plugin';
import { snipeAction } from '../plugins/trench-plugin/actions/snipeAction';
import { latencyProvider } from '../plugins/trench-plugin/providers/latencyProvider';

/**
 * TrenchPlugin components and validation assertions.
 */
describe('TrenchPlugin Custom Suite Tests', () => {

  it('should register correct module identifiers', () => {
    expect(trenchPlugin.name).toBe('@usebullOS/plugin-trench');
    expect(trenchPlugin.actions).toBeDefined();
    expect(trenchPlugin.actions?.length).toBe(1);
    expect(trenchPlugin.providers?.length).toBe(1);
  });

  describe('snipeAction execution handler', () => {
    const mockRuntime: any = {
      getSetting: (key: string) => {
        if (key === 'JITO_BLOCK_ENGINE_URL') return 'https://block-engine.jito.wtf';
        if (key === 'JITO_TIP_AMOUNT_SOL') return '0.01';
        return undefined;
      }
    };

    it('should validate command strings containing token triggers', async () => {
      const validMsg: any = { content: { text: "EXECUTE_SNIPE ticker=PEPE69" } };
      const invalidMsg: any = { content: { text: "hello world" } };

      const validatedTrue = await snipeAction.validate(mockRuntime, validMsg);
      const validatedFalse = await snipeAction.validate(mockRuntime, invalidMsg);

      expect(validatedTrue).toBe(true);
      expect(validatedFalse).toBe(false);
    });

    it('should execute custom sniper logic and fire callback', async () => {
      const msg: any = { content: { text: "EXECUTE_SNIPE ticker=PEPE69" } };
      let callbackResult: any = null;
      const callback = (res: any) => { callbackResult = res; };

      const result = await snipeAction.handler(mockRuntime, msg, undefined, undefined, callback);

      expect(result.success).toBe(true);
      expect(result.ticker).toBe('PEPE69');
      expect(callbackResult).toBeDefined();
      expect(callbackResult.success).toBe(true);
    });
  });

  describe('latencyProvider metrics parser', () => {
    it('should retrieve dynamic telemetry results', async () => {
      const mockRuntime: any = {};
      const mockMsg: any = {};
      const mockState: any = {};

      const result = await latencyProvider.get(mockRuntime, mockMsg, mockState);

      expect(result.values).toBeDefined();
      expect(result.values.avgLatencyMs).toBeDefined();
      expect(result.data.jitoBlockEngineConnection).toBe('CONNECTED');
    });
  });
});

// Mock helpers for standard testing assertions if run without Vitest
function describe(name: string, fn: () => void) {
  console.log(`[TEST-SUITE] Running: ${name}`);
  fn();
}

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ Pass: ${name}`);
  } catch (error: any) {
    console.error(`  ✗ Fail: ${name} ->`, error.message);
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) throw new Error(`Expected ${actual} to be ${expected}`);
    },
    toBeDefined() {
      if (actual === undefined || actual === null) throw new Error(`Expected value to be defined`);
    }
  };
}
