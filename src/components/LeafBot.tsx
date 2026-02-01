import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Leaf, User, Bot, Loader2, Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "bot";
    text: string;
}

const LeafBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [language, setLanguage] = useState<"en" | "hi">("en");
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "👋 Hi! I'm Leaf Bot, your friendly agricultural assistant! 🌱 Ask me anything about crops, farming techniques, plant diseases, or seasonal growing tips!" },
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            console.log("Loaded voices:", availableVoices.length);
            setVoices(availableVoices);
        };

        loadVoices();

        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);



    // Stop speaking when chat is closed
    useEffect(() => {
        if (!isOpen) {
            window.speechSynthesis.cancel();
        }
    }, [isOpen]);

    const speak = (text: string) => {
        if (isMuted || !('speechSynthesis' in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Store reference to prevent garbage collection
        speechRef.current = utterance;

        // Explicitly find the voice object
        const targetLang = language === 'hi' ? 'hi-IN' : 'en-US';
        const preferredVoice = voices.find(v => v.lang === targetLang) ||
            voices.find(v => v.lang.startsWith(language === 'hi' ? 'hi' : 'en'));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
            utterance.lang = preferredVoice.lang;
        } else {
            console.warn("No specific voice found for", targetLang);
            utterance.lang = targetLang;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            speechRef.current = null;
        };

        utterance.onerror = (e) => {
            console.error("Speech verification error:", e);
            speechRef.current = null;
        };

        window.speechSynthesis.speak(utterance);

        // Resume if paused (sometimes happens in some browsers)
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || isLoading) return;

        const userMessage = inputText.trim();
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setInputText("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, language }),
            });

            if (!response.ok) throw new Error("Failed to get response");

            const data = await response.json();
            const botResponse = data.response;

            setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
            speak(botResponse);
        } catch (error) {
            const errorMessage = language === 'hi'
                ? "क्षमा करें, मुझे सर्वर से कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।"
                : "Sorry, I'm having trouble connecting to the server. Please try again later.";
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: errorMessage },
            ]);
            speak(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const [isListening, setIsListening] = useState(false);

    const handleSpeechInput = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        // @ts-ignore - SpeechRecognition types are not standard yet
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div
                className={cn(
                    "mb-4 flex flex-col transition-all duration-300 transform origin-bottom-right",
                    isMaximized
                        ? "w-[90vw] h-[90vh] max-w-[1200px]"
                        : "w-[350px] sm:w-[400px] h-[500px]",
                    isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-10 pointer-events-none absolute"
                )}
            >
                <Card className="flex-1 flex flex-col overflow-hidden shadow-2xl border-primary/20 glass-card">
                    {/* Header */}
                    <div className="p-4 bg-primary/10 border-b border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Leaf Bot</h3>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                    Online
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                                className="h-8 px-2 font-semibold text-xs border border-primary/20 hover:bg-primary/10"
                                title="Switch Language"
                            >
                                {language === "en" ? "EN" : "HI"}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    if (!isMuted) window.speechSynthesis.cancel();
                                    setIsMuted(!isMuted);
                                }}
                                className="h-8 w-8 hover:bg-primary/10"
                                title={isMuted ? "Unmute Bot" : "Mute Bot"}
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="h-8 w-8 hover:bg-primary/10"
                                title={isMaximized ? "Minimize" : "Maximize"}
                            >
                                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-primary/10">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50" ref={scrollRef}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                        msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col gap-1 items-start">
                                    <div
                                        className={cn(
                                            "p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-card border border-border rounded-tl-none text-foreground"
                                        )}
                                    >
                                        {msg.text}
                                    </div>
                                    {msg.role === "bot" && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-primary rounded-full"
                                            onClick={() => speak(msg.text)}
                                            title="Read aloud"
                                        >
                                            <Volume2 className="w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-card border border-border rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-center gap-2"
                        >
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={handleSpeechInput}
                                className={cn(
                                    "shrink-0 transition-all duration-300",
                                    isListening ? "bg-red-500/10 text-red-500 animate-pulse" : "text-muted-foreground hover:text-primary"
                                )}
                                title="Click to speak"
                            >
                                <div className={cn("relative flex items-center justify-center", isListening && "animate-bounce")}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                    >
                                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <line x1="12" x2="12" y1="19" y2="22" />
                                    </svg>
                                </div>
                            </Button>
                            <Input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={isListening ? "Listening..." : "Ask about your crops..."}
                                className={cn(
                                    "flex-1 bg-background/50 border-primary/20 focus-visible:ring-primary transition-all",
                                    isListening && "border-red-500/50 ring-1 ring-red-500/50"
                                )}
                            />
                            <Button type="submit" size="icon" disabled={!inputText.trim() || isLoading} className="shrink-0">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="xl"
                className={cn(
                    "rounded-full h-14 w-14 shadow-lg shadow-primary/25 transition-transform duration-300 hover:scale-110",
                    isOpen ? "rotate-90 scale-0 opacity-0 absolute" : "scale-100 opacity-100"
                )}
                variant="hero"
            >
                <MessageCircle className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
                </span>
            </Button>
        </div>
    );
};

export default LeafBot;
