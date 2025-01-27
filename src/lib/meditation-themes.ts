import { Theme, ThemeCategory } from '@/types/meditation';

export const meditationThemes: Record<string, ThemeCategory> = {
  naturalLandscapes: {
    title: "Natural Landscapes",
    description: "Connect with the healing power of nature",
    themes: [
      {
        id: "mountain-presence",
        label: "Mountain Presence",
        description: "Embody the stable, grounding energy of mountains",
        healingProperties: ["stability", "strength", "endurance"],
        resonancePattern: "grounding",
        visualElements: ["mountains", "rocks", "earth tones"]
      },
      {
        id: "forest-embrace",
        label: "Forest Sanctuary",
        description: "Find peace in the embrace of ancient trees",
        healingProperties: ["protection", "nurturing", "connection"],
        resonancePattern: "centering",
        visualElements: ["trees", "soft light", "forest floor"]
      },
      {
        id: "ocean-rhythm",
        label: "Ocean Rhythm",
        description: "Flow with the healing rhythm of waves",
        healingProperties: ["rhythm", "flow", "release"],
        resonancePattern: "flowing",
        visualElements: ["waves", "water", "coastal elements"]
      },
      {
        id: "desert-wisdom",
        label: "Desert Wisdom",
        description: "Find clarity in the vast desert landscape",
        healingProperties: ["clarity", "simplicity", "transformation"],
        resonancePattern: "expanding",
        visualElements: ["sand dunes", "clear sky", "minimal forms"]
      }
    ]
  },
  celestialRealms: {
    title: "Celestial Realms",
    description: "Connect with cosmic energy and infinite possibilities",
    themes: [
      {
        id: "starlit-infinity",
        label: "Starlit Infinity",
        description: "Journey through the cosmic expanse",
        healingProperties: ["wonder", "possibility", "transcendence"],
        resonancePattern: "expanding",
        visualElements: ["stars", "galaxies", "cosmic patterns"]
      },
      {
        id: "moon-cycles",
        label: "Moon Cycles",
        description: "Flow with the gentle rhythm of lunar phases",
        healingProperties: ["cycles", "reflection", "inner wisdom"],
        resonancePattern: "flowing",
        visualElements: ["moon phases", "soft light", "night sky"]
      },
      {
        id: "aurora-dance",
        label: "Aurora Dance",
        description: "Experience the magical dance of northern lights",
        healingProperties: ["magic", "transformation", "flow"],
        resonancePattern: "flowing",
        visualElements: ["aurora", "color waves", "night sky"]
      }
    ]
  },
  sacredSpaces: {
    title: "Sacred Spaces",
    description: "Enter realms of deep peace and spiritual connection",
    themes: [
      {
        id: "zen-garden",
        label: "Zen Garden",
        description: "Find harmony in mindful simplicity",
        healingProperties: ["peace", "harmony", "mindfulness"],
        resonancePattern: "centering",
        visualElements: ["sand patterns", "stones", "minimal plants"]
      },
      {
        id: "temple-silence",
        label: "Temple Silence",
        description: "Rest in the stillness of sacred architecture",
        healingProperties: ["stillness", "reverence", "presence"],
        resonancePattern: "grounding",
        visualElements: ["architecture", "light beams", "geometric patterns"]
      },
      {
        id: "crystal-sanctuary",
        label: "Crystal Sanctuary",
        description: "Align with pure crystalline energy",
        healingProperties: ["clarity", "alignment", "purification"],
        resonancePattern: "centering",
        visualElements: ["crystals", "light refraction", "geometric forms"]
      }
    ]
  },
  elementalFlows: {
    title: "Elemental Flows",
    description: "Harmonize with the power of natural elements",
    themes: [
      {
        id: "water-flow",
        label: "Water Flow",
        description: "Move with the healing power of water",
        healingProperties: ["flow", "cleansing", "adaptability"],
        resonancePattern: "flowing",
        visualElements: ["water", "ripples", "fluid patterns"]
      },
      {
        id: "air-freedom",
        label: "Air Freedom",
        description: "Experience lightness and liberation",
        healingProperties: ["freedom", "lightness", "release"],
        resonancePattern: "expanding",
        visualElements: ["clouds", "wind patterns", "sky"]
      },
      {
        id: "earth-wisdom",
        label: "Earth Wisdom",
        description: "Connect with ancient earth energy",
        healingProperties: ["grounding", "stability", "wisdom"],
        resonancePattern: "grounding",
        visualElements: ["crystals", "earth textures", "natural patterns"]
      },
      {
        id: "fire-transform",
        label: "Fire Transform",
        description: "Embrace transformation and renewal",
        healingProperties: ["transformation", "vitality", "passion"],
        resonancePattern: "transforming",
        visualElements: ["gentle flames", "warm light", "ember glow"]
      }
    ]
  },
  abstractHarmony: {
    title: "Abstract Harmony",
    description: "Experience healing through pure form and color",
    themes: [
      {
        id: "flowing-forms",
        label: "Flowing Forms",
        description: "Gentle movement of abstract shapes",
        healingProperties: ["flow", "harmony", "balance"],
        resonancePattern: "flowing",
        visualElements: ["curved forms", "gentle gradients", "fluid motion"]
      },
      {
        id: "sacred-geometry",
        label: "Sacred Geometry",
        description: "Connect with universal patterns",
        healingProperties: ["order", "harmony", "unity"],
        resonancePattern: "centering",
        visualElements: ["mandalas", "geometric patterns", "symmetry"]
      },
      {
        id: "light-prisms",
        label: "Light Prisms",
        description: "Experience the healing spectrum of light",
        healingProperties: ["clarity", "illumination", "harmony"],
        resonancePattern: "expanding",
        visualElements: ["light rays", "color spectrum", "crystalline forms"]
      }
    ]
  }
}; 