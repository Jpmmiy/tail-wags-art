import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "./data";

export function WhatsAppButton() {
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-leaf-pet px-4 py-3.5 text-secondary-foreground shadow-lift"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-leaf-pet/50 [animation-duration:2.8s]" />
      <MessageCircle className="size-6" strokeWidth={1.8} />
      <span className="hidden font-display text-sm font-semibold sm:inline">Fale conosco</span>
    </motion.a>
  );
}
