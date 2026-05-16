import * as faceapi from '@vladmandic/face-api'

let modelsLoaded = false

/**
 * Loads face-api models from CDN or local URI
 */
export async function loadModels() {
  if (modelsLoaded) return

  const modelPath = process.env.NEXT_PUBLIC_FACE_MODEL_CDN || 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'
  
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
    ])
    modelsLoaded = true
  } catch (error) {
    console.error('[FaceAuthCore] Error loading models:', error)
    throw new Error('Failed to initialize biometric engine models.')
  }
}

/**
 * Extracts a 128-dimensional embedding from a visual element
 */
export async function extractEmbedding(
  image: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
): Promise<Float32Array | null> {
  if (!modelsLoaded) {
    await loadModels()
  }

  const results = await faceapi
    .detectSingleFace(image, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (!results) return null

  return results.descriptor
}

/**
 * Calculates average brightness of a frame
 */
export function calculateAverageBrightness(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return 0

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  let colorSum = 0

  for (let x = 0, len = data.length; x < len; x += 4) {
    const r = data[x]
    const g = data[x + 1]
    const b = data[x + 2]
    const avg = Math.floor((r + g + b) / 3)
    colorSum += avg
  }

  return Math.floor(colorSum / (canvas.width * canvas.height))
}

/**
 * Requests camera permission and returns the video element
 */
export async function startCamera(): Promise<HTMLVideoElement> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480, facingMode: 'user' }
  })
  
  const video = document.createElement('video')
  video.srcObject = stream
  video.autoplay = true
  video.muted = true
  video.playsInline = true // Important for iOS
  
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      video.play()
      resolve(video)
    }
  })
}

/**
 * Stops the camera and cleans up the stream tracks
 */
export function stopCamera(video: HTMLVideoElement) {
  const stream = video.srcObject as MediaStream
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
  }
}

/**
 * Takes a single snapshot from the video stream
 */
export function captureFrame(video: HTMLVideoElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }
  return canvas
}

/**
 * Full capture flow: takes 5 frames, evaluates brightness, averages embeddings.
 */
export async function captureEmbedding(
  video: HTMLVideoElement,
  onProgress?: (step: string) => void
): Promise<number[]> {
  await loadModels()
  
  const frames: { canvas: HTMLCanvasElement; brightness: number; descriptor: Float32Array | null }[] = []
  
  onProgress?.('Capturando frames...')
  
  // Capture 5 frames separated by 300ms
  for (let i = 0; i < 5; i++) {
    const canvas = captureFrame(video)
    const brightness = calculateAverageBrightness(canvas)
    
    // Only attempt extraction if brightness is minimally acceptable
    let descriptor: Float32Array | null = null
    if (brightness >= 60) {
      descriptor = await extractEmbedding(canvas)
    }
    
    frames.push({ canvas, brightness, descriptor })
    await new Promise((res) => setTimeout(res, 300))
  }
  
  // Filter out frames with no valid faces
  const validFrames = frames.filter((f) => f.descriptor !== null)
  
  if (validFrames.length === 0) {
    const brightest = [...frames].sort((a, b) => b.brightness - a.brightness)[0]
    if (brightest && brightest.brightness < 60) {
      throw new Error('Iluminação insuficiente. Vá para um local mais claro.')
    }
    throw new Error('Nenhum rosto válido detectado.')
  }
  
  onProgress?.('Processando biometria...')
  
  // Averages the embeddings for higher resilience
  const vectorLength = 128
  const averageDescriptor = new Float32Array(vectorLength)
  
  validFrames.forEach((frame) => {
    for (let i = 0; i < vectorLength; i++) {
      // We know descriptor is not null because we filtered above
      averageDescriptor[i] += frame.descriptor![i]
    }
  })
  
  for (let i = 0; i < vectorLength; i++) {
    averageDescriptor[i] /= validFrames.length
  }
  
  return Array.from(averageDescriptor)
}
