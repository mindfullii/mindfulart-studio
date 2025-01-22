export function generatePrompt(prompt: string, styleId: string, aspectRatio: string): string {
  let basePrompt = prompt;
  
  // 根据风格添加特定的提示词
  switch (styleId) {
    case '1': // Realistic
      basePrompt = `${prompt}, photorealistic style, highly detailed, 8k resolution`;
      break;
    case '2': // Impressionist
      basePrompt = `${prompt}, impressionist art style, loose brushstrokes, vibrant colors, light effects`;
      break;
    case '3': // Abstract
      basePrompt = `${prompt}, abstract art style, non-representational, geometric shapes, bold colors`;
      break;
    case '4': // Pop Art
      basePrompt = `${prompt}, pop art style, bold colors, comic book style, screen printing effect`;
      break;
    default:
      basePrompt = prompt;
  }

  return basePrompt;
} 