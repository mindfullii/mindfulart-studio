// Types for emotional analysis
type EmotionPattern = {
  keywords: string[];
  healing: string[];
  composition: string;
  intensity: number;
};

type EmotionalPatterns = {
  [key: string]: EmotionPattern;
};

type ThemeCategory = {
  name: string;
  keywords: string[];
  composition: string;
  healing: string[];
};

type ThemeCategories = {
  [key: string]: ThemeCategory;
};

// Core emotion patterns
const emotionalPatterns: EmotionalPatterns = {
  peaceful: {
    keywords: ['calm', 'quiet', 'serene', 'tranquil', 'gentle', 'still', 'peaceful', 'harmony', 'balance', 'zen'],
    healing: ['soft light', 'natural elements', 'open spaces', 'flowing forms', 'gentle curves'],
    composition: 'balanced and harmonious composition with gentle flow',
    intensity: 0.3
  },
  joyful: {
    keywords: ['happy', 'joy', 'bright', 'cheerful', 'playful', 'lively', 'fun', 'delight', 'smile', 'laugh'],
    healing: ['warm colors', 'dynamic elements', 'uplifting symbols', 'organic shapes', 'playful patterns'],
    composition: 'dynamic and energetic composition with upward movement',
    intensity: 0.7
  },
  melancholic: {
    keywords: ['sad', 'nostalgic', 'longing', 'wistful', 'thoughtful', 'quiet', 'memory', 'reflection', 'past'],
    healing: ['soft shadows', 'comforting spaces', 'familiar objects', 'gentle textures', 'muted tones'],
    composition: 'intimate and contemplative composition with subtle depth',
    intensity: 0.5
  },
  hopeful: {
    keywords: ['hope', 'dream', 'aspire', 'wish', 'future', 'possibility', 'potential', 'growth', 'inspire'],
    healing: ['light rays', 'upward elements', 'expansive spaces', 'ethereal qualities', 'ascending forms'],
    composition: 'uplifting composition with ascending elements',
    intensity: 0.6
  },
  energetic: {
    keywords: ['energy', 'vibrant', 'dynamic', 'active', 'movement', 'flow', 'dance', 'rhythm', 'pulse'],
    healing: ['dynamic forms', 'flowing lines', 'rhythmic patterns', 'energetic movement', 'bold elements'],
    composition: 'dynamic composition with flowing movement and rhythmic elements',
    intensity: 0.8
  },
  contemplative: {
    keywords: ['think', 'meditate', 'reflect', 'ponder', 'deep', 'wisdom', 'insight', 'mindful', 'conscious'],
    healing: ['spacious composition', 'subtle gradients', 'mindful arrangement', 'balanced elements', 'quiet spaces'],
    composition: 'spacious and contemplative arrangement with room for reflection',
    intensity: 0.4
  },
  nurturing: {
    keywords: ['care', 'grow', 'nurture', 'protect', 'support', 'comfort', 'safe', 'warm', 'embrace'],
    healing: ['protective forms', 'nurturing symbols', 'gentle embraces', 'soft textures', 'comforting elements'],
    composition: 'protective and nurturing composition with embracing forms',
    intensity: 0.5
  },
  mystical: {
    keywords: ['magic', 'wonder', 'mystery', 'enchant', 'dream', 'fantasy', 'ethereal', 'spiritual', 'cosmic'],
    healing: ['ethereal light', 'mystical symbols', 'magical elements', 'dreamy atmosphere', 'cosmic patterns'],
    composition: 'ethereal and mysterious composition with magical elements',
    intensity: 0.7
  }
};

// Theme categories for context
const themeCategories: ThemeCategories = {
  nature: {
    name: 'Natural Elements',
    keywords: ['flower', 'tree', 'mountain', 'ocean', 'forest', 'garden', 'landscape', 'river', 'sky', 'cloud', 'sun', 'moon', 'star'],
    composition: 'organic composition emphasizing natural rhythms and patterns',
    healing: ['connection to earth', 'life energy', 'natural cycles', 'growth patterns', 'organic flow']
  },
  personal: {
    name: 'Personal Space',
    keywords: ['room', 'home', 'window', 'door', 'chair', 'bed', 'interior', 'space', 'corner', 'sanctuary', 'garden'],
    composition: 'intimate composition with focus on comfort and safety',
    healing: ['sense of belonging', 'personal sanctuary', 'familiar comfort', 'inner peace', 'safe haven']
  },
  abstract: {
    name: 'Abstract Concepts',
    keywords: ['dream', 'thought', 'feeling', 'memory', 'emotion', 'spirit', 'mind', 'soul', 'energy', 'flow'],
    composition: 'fluid composition with symbolic elements and metaphorical representation',
    healing: ['emotional expression', 'inner exploration', 'spiritual connection', 'mental clarity', 'soul nurturing']
  },
  cultural: {
    name: 'Cultural Elements',
    keywords: ['tradition', 'ritual', 'ceremony', 'symbol', 'pattern', 'art', 'craft', 'story', 'heritage'],
    composition: 'respectful composition honoring cultural elements and traditions',
    healing: ['cultural connection', 'ancestral wisdom', 'traditional healing', 'spiritual heritage', 'communal bonds']
  },
  seasonal: {
    name: 'Seasonal Themes',
    keywords: ['spring', 'summer', 'autumn', 'winter', 'season', 'change', 'cycle', 'weather', 'time'],
    composition: 'seasonal composition reflecting natural cycles and transitions',
    healing: ['seasonal renewal', 'natural cycles', 'temporal flow', 'environmental harmony', 'cyclical wisdom']
  }
};

// Analyze input text for emotional content
export function analyzeEmotionalContent(text: string) {
  // Emotion keywords mapping
  const emotionKeywords = {
    anger: ['angry', 'mad', 'furious', 'rage', 'irritated', 'frustrated', 'fight', 'destroy', 'clash'],
    sadness: ['sad', 'depressed', 'gloomy', 'melancholy', 'heartbroken', 'lonely', 'cry', 'tears', 'dark'],
    joy: ['happy', 'joyful', 'excited', 'delighted', 'cheerful', 'blissful', 'jump', 'dance', 'play', 'laugh', 'smile'],
    fear: ['scared', 'afraid', 'fearful', 'terrified', 'anxious', 'worried', 'hide', 'escape', 'run away'],
    peace: ['peaceful', 'calm', 'serene', 'tranquil', 'relaxed', 'gentle', 'rest', 'meditate', 'float'],
    love: ['love', 'caring', 'affectionate', 'romantic', 'tender', 'warm', 'hug', 'embrace', 'kiss'],
    hope: ['hopeful', 'optimistic', 'inspired', 'motivated', 'encouraged', 'dreamy', 'reach', 'fly', 'soar', 'rise', 'sky']
  }

  // Convert text to lowercase for matching
  const lowerText = text.toLowerCase()
  
  // Count emotion matches
  const emotionCounts = Object.entries(emotionKeywords).reduce((counts, [emotion, keywords]) => {
    const matchCount = keywords.reduce((count, keyword) => {
      // Check for exact word matches using word boundaries
      const regex = new RegExp(`\\b${keyword}\\b`, 'i')
      return count + (regex.test(lowerText) ? 1 : 0)
    }, 0)
    return { ...counts, [emotion]: matchCount }
  }, {} as Record<string, number>)

  // If no emotion is detected, analyze the action and scene
  if (Object.values(emotionCounts).every(count => count === 0)) {
    // Action words that suggest emotions
    const actionEmotions = {
      'jump': 'joy',
      'fly': 'hope',
      'soar': 'hope',
      'rise': 'hope',
      'dance': 'joy',
      'run': 'joy',
      'sleep': 'peace',
      'rest': 'peace',
      'cry': 'sadness',
      'fight': 'anger',
      'hide': 'fear'
    } as const

    // Scene words that suggest emotions
    const sceneEmotions = {
      'sky': 'hope',
      'sun': 'joy',
      'stars': 'hope',
      'moon': 'peace',
      'ocean': 'peace',
      'mountain': 'hope',
      'garden': 'peace',
      'storm': 'fear'
    } as const

    // Check for action and scene matches
    for (const [action, emotion] of Object.entries(actionEmotions)) {
      if (lowerText.includes(action)) {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
      }
    }

    for (const [scene, emotion] of Object.entries(sceneEmotions)) {
      if (lowerText.includes(scene)) {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
      }
    }
  }

  // Find primary emotion (emotion with most matches)
  const primaryEmotion = Object.entries(emotionCounts).reduce((max, [emotion, count]) => {
    return count > (emotionCounts[max] || 0) ? emotion : max
  }, 'peace')

  // Map emotions to healing elements
  const healingElements = {
    anger: ['soothing colors', 'flowing water', 'gentle curves'],
    sadness: ['warm light', 'uplifting symbols', 'natural growth'],
    joy: ['vibrant colors', 'dynamic patterns', 'playful elements'],
    fear: ['grounding elements', 'protective symbols', 'stable forms'],
    peace: ['balanced composition', 'harmonious colors', 'natural elements'],
    love: ['soft curves', 'warm tones', 'organic shapes'],
    hope: ['ascending forms', 'light elements', 'expansive space']
  }

  return {
    primaryEmotion: primaryEmotion,
    healingElements: healingElements[primaryEmotion as keyof typeof healingElements],
    intensity: Math.min(emotionCounts[primaryEmotion], 3) // Scale of 1-3
  }
}

// Transform input into mindful prompt
export function generateMindfulPrompt(userPrompt: string, analysis: ReturnType<typeof analyzeEmotionalContent>) {
  const { primaryEmotion, healingElements, intensity } = analysis
  
  // Base transformations for different emotions
  const emotionalTransformations = {
    anger: 'transforming tension into harmony',
    sadness: 'lifting spirits through gentle warmth',
    joy: 'amplifying positive energy',
    fear: 'creating a sense of safety and protection',
    peace: 'deepening tranquility',
    love: 'nurturing connection and warmth',
    hope: 'inspiring optimistic possibilities'
  }

  const transformation = emotionalTransformations[primaryEmotion as keyof typeof emotionalTransformations]
  const elementsStr = healingElements.join(', ')

  return `Create a mindful artistic interpretation of "${userPrompt}" focused on ${transformation}. 
  Incorporate healing elements like ${elementsStr} to support emotional wellbeing. 
  Make the image feel ${intensity > 2 ? 'deeply' : 'gently'} transformative while maintaining visual harmony.`
} 