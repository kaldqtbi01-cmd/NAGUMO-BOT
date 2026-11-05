

const config = {

    botName:    "𝐅𝐋𝐎𝐍𝐀 𝐁𝐎𝐓",
    botTag:     "@FLONA",
    botVersion: "2.0.0",
    botDev:     "𝐅𝐋𝐎𝐍𝐀",
    devNumber:  "967711002393",

    sessions:   "sessions",
    botNumber:  "", // رقم البوت هنا ضروري 


    owner: [
        "967711002393", // FLONA - المالك الأساسي
    ],

    ownerLid: [],
    prems:    [],
    premsLid: [],

    prefix: /^[°•π÷×¶∆£¢€¥®™✓=|~!?#%^&.]/,

    
    ch: {
        main:    "120363402804601196@newsletter",
        second:  "120363377374711810@newsletter", // خلهم مش هيفيدوك🐦
    },

   
    

    theme: {
        border:    "🪻",
        icon:      "✦",
        separator: "~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~",
        header:    (title) => `╔═══「 🪻 ${title} 🪻 」═══╗`,
        subHeader: (title) => `┌─「 ✦ ${title} 」`,
        tail:      `╚══════════════════════╝`,
        subTail:   `└──────────────────────`,
        footer:    `〔 𝐅𝐋𝐎𝐍𝐀 𝐁𝐎𝐓 〕`,
        row:       (key, val) => `│ ✦ ${key}: 〘${val}〙`,
        zarfLine:  `~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~`,
    },

    links: {
        channel: "https://whatsapp.com/channel/0029Vb6kG3s0AgW2lYD8ad1L",
        group:   "/data/data/com.termux/files/home/NAGUMO-BOT/media/flona-logo.jpg",
        support: "https://chat.whatsapp.com/KkuYNJrg3qv1JslwoFOTUt?mode=gi_t",
        github:  "https://github.com/Loydsumer/baileys-speed",
        dev:     "https://wa.me/967711002393",
    },

    images: {
        menu:       "/data/data/com.termux/files/home/NAGUMO-BOT/media/flona-logo.jpg",
        owner:      "/data/data/com.termux/files/home/NAGUMO-BOT/media/flona-logo.jpg",
        group:      "/data/data/com.termux/files/home/NAGUMO-BOT/media/flona-logo.jpg",
        economy:    "/data/data/com.termux/files/home/NAGUMO-BOT/media/flona-logo.jpg",
        games:      "/data/data/com.termux/files/home/NAGUMO-BOT/media/flona-logo.jpg",
        tools:      "/data/data/com.termux/files/home/NAGUMO-BOT/media/flona-logo.jpg",
        info:       "/data/data/com.termux/files/home/NAGUMO-BOT/media/flona-logo.jpg",
        downloader: "/data/data/com.termux/files/home/NAGUMO-BOT/media/flona-logo.jpg",
        ai:         "/data/data/com.termux/files/home/NAGUMO-BOT/media/flona-logo.jpg",
    },

    

    opts: {
        queque:    false,
        restrict:  false,
        noprint:   false,
        autoread:  true,
        autoReact: true,
    },
}


global.botName    = config.botName
global.botTag     = config.botTag
global.botVersion = config.botVersion
global.botDev     = config.botDev
global.devNumber  = config.devNumber
global.sessions   = config.sessions
global.botNumber  = config.botNumber
global.owner      = config.owner
global.ownerLid   = config.ownerLid
global.prems      = config.prems
global.premsLid   = config.premsLid
global.prefix     = config.prefix
global.ch         = config.ch
global.zarf       = config.zarf
global.theme      = config.theme
global.links      = config.links
global.images     = config.images
global.zarf_settings = config.zarf_settings

global.opts = { ...config.opts, ...(global.opts || {}) }

export default config
