import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, ShieldCheck, MapPin, Smile, Mic, Phone, CheckCheck } from 'lucide-react';
import { matchesApi } from '../../services/api';

interface ChatViewProps {
  partner: any;
  matchId: string;
  currentUser: any;
  onBack: () => void;
}

const ICEBREAKERS = [
  "Salom! Tanishsak bo'ladimi? 😊",
  "Kofe ichishga vaqtingiz bormi? ☕",
  "Profilingizdagi rasm juda chiroyli ekan ✨",
  "Bugungi kuningiz qanday o'tdi?",
];

export const ChatView: React.FC<ChatViewProps> = ({ partner, matchId, currentUser, onBack }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChat();
    const interval = setInterval(loadChat, 3000);
    return () => clearInterval(interval);
  }, [matchId]);

  const loadChat = async () => {
    try {
      const res = await matchesApi.getChatMessages(matchId);
      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || sending) return;

    setInputText('');
    setSending(true);

    // Optimistic local push
    const optimisticMsg = {
      id: `local-${Date.now()}`,
      senderId: currentUser.id,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await matchesApi.sendMessage(matchId, text);
      loadChat();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#0f0f0f] text-white flex flex-col max-w-md mx-auto">
      {/* TOP HEADER */}
      <div className="px-4 py-3 bg-[#15151a] border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>

          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-purple-500/50">
            <img
              src={partner?.photos?.[0]}
              alt={partner?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black" />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-bold text-white">{partner?.name}, {partner?.age}</h2>
              {partner?.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
            </div>
            <p className="text-[10px] text-green-400">Tarmoqda (Online)</p>
          </div>
        </div>

        {/* Telegram Direct DM button */}
        {partner?.username && (
          <a
            href={`https://t.me/${partner.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold bg-purple-900/40 hover:bg-purple-900/60 border border-purple-600/50 text-purple-300 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
          >
            <span>Telegramda</span> ✈️
          </a>
        )}
      </div>

      {/* MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* MATCH GREETING CARD */}
        <div className="p-3 text-center bg-[#181820] rounded-2xl border border-purple-900/30 max-w-xs mx-auto my-2">
          <p className="text-xs text-purple-300 font-semibold mb-1">
            Siz va {partner?.name} bir-biringizni yoqtirdingiz!
          </p>
          <p className="text-[11px] text-gray-400">
            Samimiy va hurmat bilan suhbat boshlang.
          </p>
        </div>

        {/* ICEBREAKER SUGGESTIONS */}
        {messages.length <= 1 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block text-center">
              Tezkor salomlashuvlar:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {ICEBREAKERS.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(text)}
                  className="bg-[#1c1c24] hover:bg-[#252533] border border-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full transition-all active:scale-95"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGE BUBBLES */}
        {messages.map((m) => {
          const isMe = m.senderId === currentUser.id;
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-purple-gradient text-white rounded-br-xs shadow-md shadow-purple-900/30'
                    : 'bg-[#1c1c22] text-gray-200 border border-gray-800 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[9px] text-gray-500">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isMe && <CheckCheck className="w-3 h-3 text-purple-400" />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-3 bg-[#15151a] border-t border-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 relative flex items-center bg-[#1d1d24] border border-gray-800 rounded-2xl px-3.5 py-1.5 focus-within:border-purple-500">
            <input
              type="text"
              placeholder="Xabaringizni yozing..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none py-1.5"
            />
            <button
              type="button"
              className="text-gray-500 hover:text-gray-300 p-1"
              title="Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="w-10 h-10 rounded-2xl bg-purple-gradient text-white flex items-center justify-center shadow-lg shadow-purple-600/40 disabled:opacity-40 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
