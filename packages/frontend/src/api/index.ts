import axios from 'axios'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export function generateImage(text: string) {
  return axios.post('/api/generateImage', {
    text,
  })
}

export function chatApi(
  text: string,
  onMessage: (data: string) => void,
  cb: () => void
) {
  const controller = new AbortController()
  const signal = controller.signal
  fetchEventSource('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
    signal: signal,
    onmessage(ev) {
      // 对话完毕的标识
      if (ev.data === '[DONE]') {
        cb()
        return controller.abort()
      }
      const data = JSON.parse(ev.data).choices[0].text
      onMessage(data)
    },
    onclose() {
      console.log('close~~')
    },
    onerror(err) {
      console.log(err, 'error~~')
    },
  })
}

export function conversation(text: string, onMessage: (data: string) => void) {
  const controller = new AbortController()
  const signal = controller.signal
  fetchEventSource('/api/conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
    signal: signal,
    onmessage(ev) {
      // 对话完毕的标识
      if (ev.data === '[DONE]') {
        return controller.abort()
      }
      const data = JSON.parse(ev.data).choices[0].text
      onMessage(data)
    },
    onclose() {
      console.log('close~~')
    },
    onerror(err) {
      console.log(err, 'error~~')
    },
  })
}
