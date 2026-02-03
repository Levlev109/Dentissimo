import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Sparkles, Key, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { AIAssistant, Message } from '../../services/aiAssistant';

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'huggingface'>('gemini');
  const { i18n, t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const assistantRef = useRef<AIAssistant>(new AIAssistant(i18n.language));

  useEffect(() => {
    assistantRef.current.setLanguage(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage = assistantRef.current.getInitialMessage();
      setMessages([initialMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      assistantRef.current.setApiKey(selectedProvider, apiKeyInput.trim());
      setShowApiKeyModal(false);
      setApiKeyInput('');
      
      // Add success message
      const successMessage: Message = {
        id: Date.now().toString(),
        text: selectedProvider === 'gemini' 
          ? t('aiChat.geminiConnected')
          : t('aiChat.hfConnected'),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await assistantRef.current.getResponse(messageText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('aiChat.error'),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#D4AF37] text-white p-4 rounded-full shadow-2xl hover:bg-[#C4A037] transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { scale: 0 } : { scale: 1 }}
      >
        <MessageCircle size={28} />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
          AI
        </span>
      </motion.button>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowApiKeyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">🔑 {t('aiChat.connectRealAI')}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('aiChat.selectProvider')}</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-stone-50">
                      <input
                        type="radio"
                        name="provider"
                        value="gemini"
                        checked={selectedProvider === 'gemini'}
                        onChange={() => setSelectedProvider('gemini')}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{t('aiChat.gemini')}</div>
                        <div className="text-xs text-stone-500">{t('aiChat.geminiFree')}</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-stone-50">
                      <input
                        type="radio"
                        name="provider"
                        value="huggingface"
                        checked={selectedProvider === 'huggingface'}
                        onChange={() => setSelectedProvider('huggingface')}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{t('aiChat.huggingface')}</div>
                        <div className="text-xs text-stone-500">{t('aiChat.huggingfaceFree')}</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('aiChat.apiKey')}</label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={selectedProvider === 'gemini' ? 'AIza...' : 'hf_...'}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-900">
                  {selectedProvider === 'gemini' ? (
                    <>
                      <strong>{t('aiChat.howToGetKey')}</strong>
                      <br />
                      {t('aiChat.geminiStep1')}{' '}
                      <a
                        href="https://makersuite.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold"
                      >
                        makersuite.google.com
                      </a>
                      <br />
                      {t('aiChat.geminiStep2')}
                      <br />
                      {t('aiChat.geminiStep3')}
                    </>
                  ) : (
                    <>
                      <strong>{t('aiChat.howToGetKey')}</strong>
                      <br />
                      {t('aiChat.hfStep1')}{' '}
                      <a
                        href="https://huggingface.co/join"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold"
                      >
                        huggingface.co
                      </a>
                      <br />
                      {t('aiChat.hfStep2')}{' '}
                      <a
                        href="https://huggingface.co/settings/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold"
                      >
                        Settings → Tokens
                      </a>
                      <br />
                      {t('aiChat.hfStep3')}
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowApiKeyModal(false)}
                    className="flex-1 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!apiKeyInput.trim()}
                    className="flex-1 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C4A037] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('aiChat.saveKey')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#C4A037] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {t('aiChat.title')}
                    {assistantRef.current.isUsingRealAI() && (
                      <span className="text-[10px] bg-green-500 px-2 py-0.5 rounded-full">{t('common.live')}</span>
                    )}
                  </h3>
                  <p className="text-xs text-white/80">
                    {assistantRef.current.isUsingRealAI() ? t('aiChat.realAI') : t('aiChat.online')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="text-white/80 hover:text-white transition-colors"
                  title={t('aiChat.connectRealAI')}
                >
                  <Key size={20} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.isBot
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'bg-[#D4AF37] text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">
                      {message.text}
                    </p>
                    <p className={`text-[10px] mt-1 ${
                      message.isBot ? 'text-stone-400' : 'text-white/70'
                    }`}>
                      {message.timestamp.toLocaleTimeString(i18n.language, { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-stone-900 rounded-2xl p-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-stone-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('aiChat.placeholder')}
                  className="flex-1 px-4 py-3 border border-stone-300 rounded-full focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="bg-[#D4AF37] text-white p-3 rounded-full hover:bg-[#C4A037] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-[10px] text-stone-400 mt-2 text-center">
                {t('aiChat.helper')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
