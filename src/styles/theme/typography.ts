export const fontFamily = {
  heading: ['EB Garamond', 'serif'],
  subheading: ['Spectral', 'serif'],
  body: ['Quattrocento Sans', 'sans-serif'],
  mono: ['Space Mono', 'monospace'],
  system: ['system-ui', 'sans-serif'],
};

export const typeScale = {
  // 标题系统
  h1: {
    family: fontFamily.heading,
    size: '2.8em',
    weight: 600,
    lineHeight: 1.2,
  },
  h2: {
    family: fontFamily.subheading,
    size: '1.8em',
    weight: 500,
    lineHeight: 1.3,
  },
  h3: {
    family: fontFamily.subheading,
    size: '1.5em',
    weight: 400,
    lineHeight: 1.4,
  },
  
  // 正文系统
  body: {
    family: fontFamily.body,
    size: '1rem',
    weight: 300,
    lineHeight: 1.6,
  },
  // ... 其他字体配置
}; 