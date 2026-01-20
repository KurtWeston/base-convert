import { REPL } from '../repl';
import { REPLConfig } from '../types';
import * as readline from 'readline';
import { EventEmitter } from 'events';

class MockReadline extends EventEmitter {
  prompt = jest.fn();
  close = jest.fn();
}

describe('REPL', () => {
  let mockRl: MockReadline;
  let config: REPLConfig;
  let consoleLogSpy: jest.SpyInstance;
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRl = new MockReadline();
    jest.spyOn(readline, 'createInterface').mockReturnValue(mockRl as any);
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    
    config = {
      fromBase: 10,
      toBase: 2,
      showSteps: false,
      uppercase: false
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('start', () => {
    it('should initialize REPL with welcome message', () => {
      const repl = new REPL(config);
      repl.start();
      
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Base Converter REPL'));
      expect(mockRl.prompt).toHaveBeenCalled();
    });

    it('should handle close event', () => {
      const repl = new REPL(config);
      repl.start();
      
      mockRl.emit('close');
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('conversion handling', () => {
    it('should convert valid input', () => {
      const repl = new REPL(config);
      repl.start();
      
      mockRl.emit('line', '10');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('1010'));
    });

    it('should handle conversion errors gracefully', () => {
      const repl = new REPL(config);
      repl.start();
      
      mockRl.emit('line', 'invalid');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Error'));
    });

    it('should skip empty lines', () => {
      const repl = new REPL(config);
      repl.start();
      
      const callCount = mockRl.prompt.mock.calls.length;
      mockRl.emit('line', '');
      expect(mockRl.prompt.mock.calls.length).toBe(callCount + 1);
    });
  });

  describe('command handling', () => {
    it('should handle :from command', () => {
      const repl = new REPL(config);
      repl.start();
      
      mockRl.emit('line', ':from 16');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Source base set to 16'));
    });

    it('should handle :to command', () => {
      const repl = new REPL(config);
      repl.start();
      
      mockRl.emit('line', ':to 8');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Target base set to 8'));
    });

    it('should toggle steps with :steps command', () => {
      const repl = new REPL(config);
      repl.start();
      
      mockRl.emit('line', ':steps');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Steps enabled'));
      
      mockRl.emit('line', ':steps');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Steps disabled'));
    });

    it('should handle :quit command', () => {
      const repl = new REPL(config);
      repl.start();
      
      mockRl.emit('line', ':quit');
      expect(mockRl.close).toHaveBeenCalled();
    });

    it('should handle :help command', () => {
      const repl = new REPL(config);
      repl.start();
      
      mockRl.emit('line', ':help');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Available commands'));
    });

    it('should handle unknown commands', () => {
      const repl = new REPL(config);
      repl.start();
      
      mockRl.emit('line', ':unknown');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown command'));
    });
  });
});
