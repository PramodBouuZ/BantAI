
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, ArrowRight, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const AIConsultant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { products, categories } = useData();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      // Corrected: Initialize GoogleGenAI strictly using process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      const systemInstruction = `
        You are the BantConfirm B2B AI Consultant. 
        Your goal is to help Indian businesses find the right IT/Telecom services.
        Available Categories: ${categories.join(', ')}.
        Available Products: ${products.map(p => p.title).join(', ')}.
        
        Guidelines:
        1. Be professional, concise, and helpful.
        2. Focus on the Indian market (mentioning GST, Indian cities like Bangalore/Delhi where relevant).
        3. Recommend specific products from the list if they fit.
        4. If a user needs a specific service not listed, suggest the closest category.
        5. Encourage them to "Post an Enquiry" for custom pricing.
      `;

      // Corrected: Using systemInstruction in config for better response quality as per guidelines
      const response = await ai.models.generateContent({
        model,
        contents: userMsg,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      // Corrected: Directly accessing response.text property (not a method call) as per SDK rules
      const aiResponse = response.text || "I'm sorry, I couldn't analyze that. Could you try rephrasing your requirement?";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Our AI systems are currently under maintenance. Please try again in a few minutes." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl z-50 transition-all hover:scale-110 flex items-center justify-center group"
        title="AI Business Consultant"
      >
        <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 whitespace-nowrap font-bold">AI Consultant</span>
      </button>

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[100] transform transition-transform duration-500 ease-out border-l border-slate-100 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">B2B AI Expert</h3>
              <p className="text-xs text-slate-400">Powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition"><X size={24} /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {messages.length === 0 && (
            <div className="text-center py-10 animate-fade-in">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 inline-block mb-6">
                <Sparkles size={48} className="text-indigo-500 mx-auto mb-4" />
                <h4 className="font-bold text-slate-800 text-xl mb-2">How can I help you today?</h4>
                <p className="text-slate-500 text-sm">Tell me about your business needs, and I'll find the best verified vendors for you.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 px-4">
                <button onClick={() => setInput("I need a CRM for a real estate business in Mumbai")} className="bg-white p-3 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-indigo-300 transition text-left">"I need a CRM for a real estate business..."</button>
                <button onClick={() => setInput("What's the best internet for a 50-person office in Delhi?")} className="bg-white p-3 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-indigo-300 transition text-left">"What's the best internet for a 50-person office?"</button>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-800 border border-slate-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-1 opacity-70">
                  {m.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
                  <span className="text-[10px] font-bold uppercase tracking-wider">{m.role}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-indigo-500" />
                <span className="text-xs font-bold text-slate-400">Consultant is thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl border border-transparent focus-within:border-indigo-200 transition-all">
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-slate-700 placeholder-slate-400"
              placeholder="Describe your business problem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => { setIsOpen(false); navigate('/enquiry'); }}
              className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center hover:bg-slate-800 transition"
            >
              Post BANT Enquiry <Zap size={12} className="ml-2 text-yellow-400" />
            </button>
            <button 
              onClick={() => { setIsOpen(false); navigate('/products'); }}
              className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
            >
              Browse Products <ArrowRight size={12} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIConsultant;
