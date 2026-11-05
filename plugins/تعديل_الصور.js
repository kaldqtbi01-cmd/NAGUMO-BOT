
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'

const BASE_URL = 'https://prithivmlmods-qwen-image-edit-2509-loras-fast.hf.space/gradio_api'
const API_NAME = 'edit_image'
const WORKER_URL = process.env.QWEN_WORKER_URL || 'http://workers.proxy-1.ryuu-dev.my.id'

const errorMessage = (err) => {
  const data = err?.response?.data
  if (typeof data === 'string' && data) return data.slice(0, 300)
  return data?.message || data?.error || err?.message || 'Unknown error'
}

class QwenImageEdit {
  constructor() {
    this.axios = axios.create({
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://prithivmlmods-qwen-image-edit-2509-loras-fast.hf.space',
        'Referer': 'https://prithivmlmods-qwen-image-edit-2509-loras-fast.hf.space/',
        'User-Agent': 'Mozilla/5.0'
      }
    })
  }

  async workerRequest(method, target, data = null, extra = {}) {
    return this.axios({
      method,
      url: WORKER_URL,
      params: { url: target },
      data,
      ...extra
    })
  }

  async imageToBase64(input, mime = 'image/jpeg') {
    const buffer = fs.readFileSync(input)
    return `data:${mime};base64,${buffer.toString('base64')}`
  }

  parseSse(text) {
    let output = null

    for (const line of String(text).split('\n')) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue

      const raw = trimmed.slice(5).trim()
      if (!raw || raw === '[DONE]') continue

      let evt
      try {
        evt = JSON.parse(raw)
      } catch {
        continue
      }

      if (Array.isArray(evt)) {
        output = evt
        break
      }

      if (evt.msg === 'process_completed') {
        output = evt.output?.data || null
        break
      }

      if (evt.msg === 'error' || evt.error) {
        throw new Error(evt.error || evt.msg || 'Server error')
      }
    }

    return output
  }

  extractImage(output) {
    if (!Array.isArray(output) || !output.length) {
      throw new Error('Invalid response structure')
    }

    const first = output[0]

    if (first && typeof first === 'object' && first.image) return first.image
    if (first && typeof first === 'object' && first.url) return first.url
    if (typeof first === 'string') return first

    throw new Error('Image not found in response')
  }

  async editImage({ imageSource, mime, prompt, lora }) {
    const imageBase64 = await this.imageToBase64(imageSource, mime)

    const start = await this.workerRequest(
      'POST',
      `${BASE_URL}/call/${API_NAME}`,
      {
        data: [imageBase64, prompt, lora, 0, true, 1, 4]
      }
    )

    const eventId = start.data?.event_id
    if (!eventId) throw new Error('Server did not return event_id')

    const res = await this.workerRequest(
      'GET',
      `${BASE_URL}/call/${API_NAME}/${eventId}`,
      null,
      {
        timeout: 120000,
        responseType: 'text'
      }
    )

    return this.extractImage(this.parseSse(res.data))
  }
}

function showGuide(m, conn, usedPrefix, command) {
  return conn.reply(
    m.chat,
    `🎨 *تعديل الصور بالذكاء الاصطناعي*\n\n` +
    `1. ردّي على صورة بالأمر:\n` +
    `*${usedPrefix + command} اجعلها بأسلوب أنمي*\n\n` +
    `2. لتحديد نمط إضافي:\n` +
    `*${usedPrefix + command} اجعلها أنمي|Photo-to-Anime*\n\n` +
    `⚠️ يجب إرفاق صورة أو الرد على صورة.\n` +
    `يعمل بوضع الاستخدام المجاني دون إرسال مفتاح خاص.`,
    m
  )
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || ''

  if (!/image/i.test(mime) || !text?.trim()) {
    return showGuide(m, conn, usedPrefix, command)
  }

  const args = text.split('|').map(v => v.trim())

  // يدعم الصيغة القديمة on|prompt أو off|prompt
  const hasMode = /^(on|off)$/i.test(args[0] || '')
  const promptText = hasMode ? args[1] : args[0]
  const loraName = (hasMode ? args[2] : args[1]) || 'Photo-to-Anime'

  if (!promptText || promptText.length < 3) {
    return showGuide(m, conn, usedPrefix, command)
  }

  await m.react('⏳')

  let imgPath = null

  try {
    const buffer = await q.download()
    if (!buffer || !buffer.length) throw new Error('تعذر تنزيل الصورة')

    const extension =
      mime.includes('png') ? '.png' :
      mime.includes('webp') ? '.webp' :
      mime.includes('gif') ? '.gif' : '.jpg'

    imgPath = path.join(os.tmpdir(), `qwen_${Date.now()}${extension}`)
    fs.writeFileSync(imgPath, buffer)

    const ai = new QwenImageEdit()
    let result
    let lastError

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        result = await ai.editImage({
          imageSource: imgPath,
          mime,
          prompt: promptText,
          lora: loraName
        })
        if (result) break
      } catch (err) {
        lastError = err
        console.error(`[Qwen attempt ${attempt}]`, errorMessage(err))
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 3000))
        }
      }
    }

    if (!result) throw lastError || new Error('لم تصل نتيجة من الخادم')

    const caption =
      `🎨 *تم تعديل الصورة بنجاح*\n\n` +
      `📝 *الوصف:* ${promptText}\n` +
      `✨ *النمط:* ${loraName}`

    if (typeof result === 'string' && result.startsWith('data:image')) {
      const base64 = result.replace(/^data:image\/\w+;base64,/, '')
      await conn.sendMessage(
        m.chat,
        { image: Buffer.from(base64, 'base64'), caption },
        { quoted: m }
      )
    } else {
      const imageUrl = typeof result === 'string' ? result : result.url
      if (!imageUrl) throw new Error('رابط الصورة الناتجة غير صالح')

      await conn.sendMessage(
        m.chat,
        { image: { url: imageUrl }, caption },
        { quoted: m }
      )
    }

    await m.react('✅')
  } catch (err) {
    console.error('[Qwen Image Edit]', err)
    await conn.reply(
      m.chat,
      `❌ تعذر تعديل الصورة.\nالسبب: ${errorMessage(err)}`,
      m
    )
    await m.react('❌')
  } finally {
    if (imgPath && fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath)
    }
  }
}

handler.help = ['تعديل <الوصف>', 'imgedit <prompt>']
handler.tags = ['editor']
handler.command = /^(تعديل|imgedit)$/i
handler.limit = false

export default handler

