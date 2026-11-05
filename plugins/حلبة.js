export default {
  command: null,
  category: "fun",
  async execute(sock, msg) {
    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text || "";

    if (/حلبه|حلبة/.test(text)) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "وزف وزف 🎏🎏"
      }, { quoted: msg });
    }
  }
};
