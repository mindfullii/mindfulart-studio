   // 添加类型定义使代码更规范
   interface PromptBuilderParams {
     description?: string;
     emotion?: string;
     theme?: string;
     complexity?: 'simple' | 'medium' | 'detailed';
     aspectRatio?: '1:1' | '2:3' | '3:2';
   }
   
   export function buildPrompt({
     description = '',
     emotion = '',
     theme = '',
     complexity = 'medium',
     aspectRatio = '1:1',
   }: PromptBuilderParams): string {
     // 简化的 prompt 构建
     let prompt = 'Coloring Book, A black and white drawing';
     
     if (emotion) {
       prompt += ` with ${emotion} feeling`;
     }
   
     if (theme) {
       prompt += `, featuring ${theme} elements`;
     }
   
     if (description) {
       prompt += `. ${description}`;
     }
   
     return prompt;
   }