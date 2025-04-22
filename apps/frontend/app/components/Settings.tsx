import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { keyBindingsAtom, isSettingsOpenAtom, KeyBindings, defaultKeyBindings } from '../lib/store';

export default function Settings() {
  const [isOpen, setIsOpen] = useAtom(isSettingsOpenAtom);
  const [keyBindings, setKeyBindings] = useAtom(keyBindingsAtom);
  const [activeRebind, setActiveRebind] = useState<string | null>(null);
  const [tempBindings, setTempBindings] = useState<KeyBindings>(keyBindings);

  // Handle key press for rebinding
  useEffect(() => {
    if (!activeRebind) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const key = e.key;
      const action = activeRebind.split('-')[0] as keyof KeyBindings;
      
      // Update temp bindings
      setTempBindings(prev => {
        const newBindings = { ...prev };
        
        // For simplicity, we're just replacing the first key in the array
        // A more complex implementation could allow multiple keys per action
        newBindings[action] = [key];
        
        return newBindings;
      });
      
      setActiveRebind(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRebind]);

  const startRebind = (action: string, index: number) => {
    setActiveRebind(`${action}-${index}`);
  };

  const saveBindings = () => {
    setKeyBindings(tempBindings);
    setIsOpen(false);
  };

  const resetToDefaults = () => {
    setTempBindings(defaultKeyBindings);
  };

  const cancelChanges = () => {
    setTempBindings(keyBindings);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={cancelChanges}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-lg w-96 max-w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Game Settings</h2>
            
            <div className="mb-6">
              <h3 className="text-xl text-white mb-2">Keybindings</h3>
              
              <div className="space-y-3">
                {Object.entries(tempBindings).map(([action, keys]) => (
                  <div key={action} className="flex justify-between items-center">
                    <span className="text-white capitalize">{action}</span>
                    <div className="flex gap-2">
                      {keys.map((key: string, index: number) => (
                        <button
                          key={`${action}-${index}`}
                          className={`px-3 py-1 border border-gray-500 rounded text-sm ${
                            activeRebind === `${action}-${index}` 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-700 text-gray-200'
                          }`}
                          onClick={() => startRebind(action, index)}
                        >
                          {activeRebind === `${action}-${index}` ? 'Press a key...' : key}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={resetToDefaults}
              >
                Reset to Defaults
              </button>
              
              <div className="space-x-2">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  onClick={cancelChanges}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={saveBindings}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
