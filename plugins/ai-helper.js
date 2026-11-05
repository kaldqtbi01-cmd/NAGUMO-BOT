import fetch from 'node-fetch'
import { downloadMediaMessage } from '@whiskeysockets/baileys'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const TEXT_MODEL = 'llama-3.3-70b-versatile'
const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'

function getKey() {
  return process.env.GROQ_API_KEY || globalThis.APIs?.groq || ''
}

export async function askGroq(messages, model = TEXT_MODEL, maxTokens = 1024) {
  const key = getKey()
  if (!key) throw new Error('مفتاح Groq غير مضبوط')

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7
    })
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`Groq API ${response.status}: ${data.error?.message || 'فشل الطلب'}`)
  }

  return data.choices?.[0]?.message?.content || ''
}

export async function askOverChat(prompt, system = '', requestedModel = '') {
  const messages = [
    ...(system ? [{ role: 'system', content: system }] : []),
    { role: 'user', content: String(prompt ?? '') }
  ]
  return askGroq(messages, TEXT_MODEL, 2048)
}

export async function downloadMedia(m) {
  try {
    const message = m?.message ? m : m?.msg
    if (!message) return null

    const buffer = await downloadMediaMessage(message, 'buffer', {}, {
      logger: console,
      reuploadRequest: m?.conn?.updateMediaMessage
        ? m.conn.updateMediaMessage.bind(m.conn)
        : undefined
    })

    return buffer?.toString('base64') || null
  } catch (error) {
    console.error('[ai-helper] Media download failed:', error.message)
    return null
  }
}

export { TEXT_MODEL, VISION_MODEL }
