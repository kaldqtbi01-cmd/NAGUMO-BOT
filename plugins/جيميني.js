import fetch from 'node-fetch'

const gemini = {
  getNewCookie: async function () {
    const r = await fetch('https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=maGuAc&source-path=%2F&bl=boq_assistant-bard-web-server_20250814.06_p1&f.sid=-7816331052118000090&hl=en-US&_reqid=173780&rt=c', {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: 'f.req=%5B%5B%5B%22maGuAc%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&',
      method: 'POST'
    })

    if (!r.ok) throw new Error(`Cookie request failed: ${r.status}`)
    const cookieHeader = r.headers.get('set-cookie')
    if (!cookieHeader) throw new Error('Could not find set-cookie header')
    return cookieHeader.split(';')[0]
  },

  ask: async function (prompt, previousId = null) {
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error('Invalid prompt provided')
    }

    let resumeArray = null
    let cookie = null

    if (previousId) {
      try {
        const j = JSON.parse(Buffer.from(previousId, 'base64').toString('utf8'))
        resumeArray = j.newResumeArray
        cookie = j.cookie
      } catch {
        previousId = null
      }
    }

    const headers = {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'x-goog-ext-525001261-jspb': '[1,null,null,null,"9ec249fc9ad08861",null,null,null,[4]]',
      cookie: cookie || await this.getNewCookie()
    }

    const b = [[prompt], ['en-US'], resumeArray]
    const a = [null, JSON.stringify(b)]
    const body = new URLSearchParams({ 'f.req': JSON.stringify(a) })

    const response = await fetch('https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20250729.06_p0&f.sid=4206607810970164620&hl=en-US&_reqid=2813378&rt=c', {
      headers,
      body,
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}: ${(await response.text()).slice(0, 300)}`)
    }

    const data = await response.text()
    const chunks = Array.from(data.matchAll(/^\d+\n(.+?)\n/gm), m => m[1])

    let answer
    let newResumeArray
    let found = false

    for (const chunk of chunks.reverse()) {
      try {
        const realArray = JSON.parse(chunk)
        const parse1 = JSON.parse(realArray[0][2])

        if (parse1?.[4]?.[0]?.[1] && typeof parse1[4][0][1][0] === 'string') {
          newResumeArray = [...parse1[1], parse1[4][0][0]]
          answer = parse1[4][0][1][0].replace(/\*\*(.+?)\*\*/g, '*$1*')
          found = true
          break
        }
      } catch {}
    }

    if (!found) {
      throw new Error('تعذر تحليل رد Gemini؛ قد تكون Google غيّرت واجهة الخدمة.')
    }

    const id = Buffer.from(JSON.stringify({
      newResumeArray,
      cookie: headers.cookie
    })).toString('base64')

    return { text: answer, id }
  }
}

const geminiSessions = {}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `اكتب سؤالك أولاً.\n\nمثال: ${usedPrefix + command} مرحباً Gemini`
  }

  if (text.trim().toLowerCase() === '--reset') {
    delete geminiSessions[m.sender]
    return m.reply('🤖 تم تصفير سجل المحادثة.')
  }

  try {
    await m.reply('🤔 Gemini يفكر...')

    const result = await gemini.ask(text, geminiSessions[m.sender])
    geminiSessions[m.sender] = result.id

    await conn.reply(m.chat, result.text, m)
  } catch (e) {
    console.error('[Gemini Web]', e)
    await m.reply(`❌ تعذر الاتصال بـ Gemini.\n\nالسبب: ${e.message}`)
  }
}

handler.help = ['gemini']
handler.tags = ['ai']
handler.command = /^(جيميني|جيمني|جمني|gemini)$/i
handler.limit = false

export default handler
