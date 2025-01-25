// Types
type EmotionalPattern = {
  keywords: string[];
  healing: string[];
  composition: string;
};

type EmotionalPatternKey = 'anxiety' | 'loneliness' | 'seeking_peace' | 'seeking_joy' | 'need_grounding' | 'neutral';

type EmotionalPatterns = {
  [K in EmotionalPatternKey]: EmotionalPattern;
};

type ThemeMatch = {
  category: string;
  subtype: string;
  confidence: number;
};

type ThemeData = {
  elements: string[];
  aesthetics?: {
    composition?: string;
    patterns?: string[];
    mindful_elements?: string[];
  };
};

type ThemeCategory = {
  [key: string]: ThemeData;
};

type ThemeCategories = {
  [key: string]: ThemeCategory;
};

type StyleGuidance = {
  line_quality: {
    primary: string;
    variations: string[];
    rules: string;
  };
  pattern_density: {
    primary: string;
    variations: string[];
    rules: string;
  };
  composition: {
    primary: string;
    variations: string[];
    rules: string;
  };
};

// Import theme categories and emotional patterns
import { themeCategories } from '@/data/theme-categories';
import { emotionalPatterns, styleGuidance, principles } from '@/data/emotional-patterns';

// Theme identification
function identifyTheme(input: string): ThemeMatch {
  let bestMatch = {
    category: '',
    subtype: '',
    confidence: 0
  };

  const categories = themeCategories as ThemeCategories;
  for (const [category, categoryData] of Object.entries(categories)) {
    for (const [subtype, data] of Object.entries(categoryData)) {
      const elements = data.elements;
      const matchScore = elements.reduce((score: number, element: string) => {
        return score + (input.toLowerCase().includes(element) ? 1 : 0);
      }, 0);

      if (matchScore > bestMatch.confidence) {
        bestMatch = {
          category,
          subtype,
          confidence: matchScore
        };
      }
    }
  }

  return bestMatch.confidence > 0 ? bestMatch : { category: 'general', subtype: 'default', confidence: 0 };
}

// Core element extraction
export function extractCoreElements(input: string) {
  const words = input.toLowerCase().split(/\s+/);
  const theme = identifyTheme(input);
  
  return {
    subject: extractSubject(words),
    action: extractAction(words),
    context: extractContext(words),
    emotion: detectEmotion(input),
    intention: detectIntention(input),
    theme: theme
  };
}

// Helper functions for word classification
function isAction(word: string): boolean {
  const actionWords = ['playing', 'sitting', 'standing', 'walking', 'running', 'sleeping', 'dancing'];
  return actionWords.includes(word);
}

function isContext(word: string): boolean {
  const contextWords = ['in', 'at', 'on', 'by', 'near', 'with', 'garden', 'forest', 'beach', 'home'];
  return contextWords.includes(word);
}

function extractSubject(words: string[]): string {
  const subjects = words.filter(word => !isAction(word) && !isContext(word));
  return subjects.join(' ');
}

function extractAction(words: string[]): string {
  const actionWords = ['playing', 'sitting', 'standing', 'walking', 'running', 'sleeping', 'dancing'];
  return words.find(word => actionWords.includes(word)) || '';
}

function extractContext(words: string[]): string {
  const contextWords = ['in', 'at', 'on', 'by', 'near', 'with', 'garden', 'forest', 'beach', 'home'];
  return words.filter(word => contextWords.includes(word)).join(' ');
}

// Enhanced emotional understanding
function detectEmotion(input: string): EmotionalPatternKey {
  let strongestEmotion: EmotionalPatternKey = 'neutral';
  let highestScore = 0;

  const patterns = emotionalPatterns as EmotionalPatterns;
  for (const [emotion, pattern] of Object.entries(patterns)) {
    if (emotion === 'neutral') continue;
    
    const score = pattern.keywords.reduce((acc: number, keyword: string) => {
      return acc + (input.toLowerCase().includes(keyword) ? 1 : 0);
    }, 0);

    if (score > highestScore) {
      highestScore = score;
      strongestEmotion = emotion as EmotionalPatternKey;
    }
  }

  return strongestEmotion;
}

function detectIntention(input: string): string {
  const intentions = {
    'seeking_comfort': ['need', 'want', 'hope', 'wish', 'looking for'],
    'expressing_creativity': ['create', 'make', 'design', 'imagine'],
    'finding_peace': ['relax', 'calm', 'peaceful', 'quiet']
  };

  for (const [intention, keywords] of Object.entries(intentions)) {
    if (keywords.some(keyword => input.toLowerCase().includes(keyword))) {
      return intention;
    }
  }

  return 'general_creation';
}

// Mindful transformation
export function mapToMindfulContext(elements: ReturnType<typeof extractCoreElements>) {
  const emotion = elements.emotion as EmotionalPatternKey;
  const patterns = emotionalPatterns as EmotionalPatterns;
  const healingElements = patterns[emotion]?.healing || [];
  const categories = themeCategories as ThemeCategories;
  const themeData = categories[elements.theme.category]?.[elements.theme.subtype];
  
  return {
    subjectQuality: findMindfulQualities(elements.subject),
    actionQuality: transformActionToMindful(elements.action),
    contextQuality: createMindfulContext(elements.context),
    emotionalQuality: integrateEmotionalHealing(emotion, healingElements),
    themeQualities: themeData ? {
      composition: themeData.aesthetics?.composition || '',
      patterns: themeData.aesthetics?.patterns || [],
      mindfulElements: themeData.aesthetics?.mindful_elements || []
    } : null
  };
}

function findMindfulQualities(subject: string): string {
  const qualityMap: Record<string, string> = {
    'cat': 'graceful and serene',
    'dog': 'loyal and joyful',
    'tree': 'rooted and peaceful',
    'flower': 'blooming and gentle',
    'bird': 'free and light',
    'mountain': 'stable and majestic',
    'ocean': 'flowing and vast',
    'sun': 'radiant and warming',
    'moon': 'calm and reflective'
  };

  return qualityMap[subject] || 'mindful and present';
}

function transformActionToMindful(action: string): string {
  const actionMap: Record<string, string> = {
    'playing': 'engaging in peaceful interaction',
    'sitting': 'resting in mindful stillness',
    'walking': 'moving with gentle awareness',
    'running': 'flowing with dynamic energy',
    'sleeping': 'resting in tranquil peace',
    'dancing': 'moving in rhythmic harmony',
    'standing': 'grounding with stable presence'
  };

  return actionMap[action] || 'being present';
}

function createMindfulContext(context: string): string {
  const contextMap: Record<string, string> = {
    'garden': 'in a nurturing space of natural harmony',
    'forest': 'among the peaceful whispers of nature',
    'beach': 'by the rhythmic calm of gentle waves',
    'home': 'in a safe and comforting sanctuary',
    'mountain': 'amid the stable grandeur of peaks',
    'temple': 'within a sacred space of peace'
  };

  return contextMap[context] || 'in a space of mindful awareness';
}

function integrateEmotionalHealing(emotion: string, healingElements: string[]): string {
  const healingQualities = healingElements.join(', ');
  return `incorporating ${healingQualities} to support ${emotion} healing`;
}

// Enhanced prompt generation
export function generateMindfulPrompt(elements: ReturnType<typeof extractCoreElements>, 
                             qualities: ReturnType<typeof mapToMindfulContext>): string {
  const composition = emotionalPatterns[elements.emotion]?.composition || styleGuidance.composition.primary;
  const themeSpecifics = qualities.themeQualities;
  const dimensions = determineOptimalDimensions(elements, qualities);
  
  const basePrompt = `Create a mindful coloring page featuring ${elements.subject} 
    ${qualities.actionQuality}, expressing ${qualities.subjectQuality} through 
    ${qualities.contextQuality}. ${qualities.emotionalQuality}. 
    
    ${themeSpecifics ? `
    Incorporate ${themeSpecifics.patterns.join(', ')},
    emphasizing ${themeSpecifics.mindfulElements.join(', ')}.
    Follow ${themeSpecifics.composition} in the design.
    ` : ''}
    
    Composition: ${composition}.
    Style: ${styleGuidance.line_quality.primary}, ${styleGuidance.pattern_density.primary}.
    
    Create clean line art suitable for coloring, with clear outlines and thoughtful details 
    that encourage focus and presence. Ensure all lines are connected and suitable for coloring.
    
    Output dimensions: ${dimensions.width}x${dimensions.height} pixels, maintaining this exact aspect ratio 
    for optimal composition and visual balance.`;

  return basePrompt.replace(/\s+/g, ' ').trim();
}

// Dimension optimization
export function determineOptimalDimensions(elements: ReturnType<typeof extractCoreElements>, 
                                  qualities: ReturnType<typeof mapToMindfulContext>) {
  if (needsVerticalFormat(elements, qualities)) {
    return { width: 896, height: 1344 }; // 2:3 ratio
  }
  if (needsHorizontalFormat(elements, qualities)) {
    return { width: 1344, height: 896 }; // 3:2 ratio
  }
  return { width: 1024, height: 1024 }; // Square ratio
}

function needsVerticalFormat(elements: ReturnType<typeof extractCoreElements>, 
                           qualities: ReturnType<typeof mapToMindfulContext>): boolean {
  // Cultural themes that typically need vertical format
  const verticalCulturalThemes = ['kimono', 'geisha', 'hanfu'];
  
  // Actions that suggest vertical composition
  const verticalActions = [
    'standing', 'rising', 'floating', 'meditation',
    'growing', 'reaching', 'climbing', 'ascending'
  ];
  
  // Subjects that work better in vertical format
  const verticalSubjects = [
    'waterfall', 'tree', 'tower', 'temple',
    'person', 'figure', 'girl', 'woman', 'man',
    'portrait', '女孩', '人物'
  ];

  // Check if the theme is from a culture that prefers vertical format
  const hasVerticalCulturalTheme = verticalCulturalThemes.some(theme => 
    elements.subject.toLowerCase().includes(theme)
  );

  // Check if it's a single character/person
  const isSingleCharacter = verticalSubjects.some(subject =>
    elements.subject.toLowerCase().includes(subject)
  ) && !elements.subject.toLowerCase().includes('group');

  // Check if the action suggests vertical format
  const hasVerticalAction = verticalActions.some(action =>
    elements.action.toLowerCase().includes(action) ||
    elements.subject.toLowerCase().includes(action)
  );

  // Check if the theme qualities suggest vertical format
  const hasVerticalThemeQualities = qualities.themeQualities?.composition?.toLowerCase().includes('vertical') || false;

  return hasVerticalCulturalTheme || isSingleCharacter || hasVerticalAction || hasVerticalThemeQualities;
}

function needsHorizontalFormat(elements: ReturnType<typeof extractCoreElements>, 
                             qualities: ReturnType<typeof mapToMindfulContext>): boolean {
  // Themes that typically need horizontal format
  const horizontalThemes = [
    'landscape', 'ocean', 'horizon', 'beach',
    'garden', 'meadow', 'field', 'forest',
    'group', 'scene', 'panorama'
  ];
  
  // Actions that suggest horizontal composition
  const horizontalActions = [
    'lying', 'sleeping', 'resting', 'swimming',
    'walking', 'running', 'dancing'
  ];

  // Check if the theme suggests horizontal format
  const hasHorizontalTheme = horizontalThemes.some(theme =>
    elements.subject.toLowerCase().includes(theme)
  );

  // Check if the action suggests horizontal format
  const hasHorizontalAction = horizontalActions.some(action =>
    elements.action.toLowerCase().includes(action) ||
    elements.subject.toLowerCase().includes(action)
  );

  // Check if the theme qualities suggest horizontal format
  const hasHorizontalThemeQualities = qualities.themeQualities?.composition?.toLowerCase().includes('horizontal') || false;

  // Check if it's a group or scene
  const isGroupOrScene = elements.subject.toLowerCase().includes('group') ||
                        elements.subject.toLowerCase().includes('scene');

  return hasHorizontalTheme || hasHorizontalAction || hasHorizontalThemeQualities || isGroupOrScene;
}

// Main transformation function
export function transformInput(userInput: string) {
  const elements = extractCoreElements(userInput);
  const mindfulQualities = mapToMindfulContext(elements);
  const dimensions = determineOptimalDimensions(elements, mindfulQualities);
  const prompt = generateMindfulPrompt(elements, mindfulQualities);

  return {
    prompt,
    dimensions,
    elements,
    qualities: mindfulQualities
  };
} 