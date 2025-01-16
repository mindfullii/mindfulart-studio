/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

declare module 'next/server' {
  export { NextResponse, NextRequest } from 'next/dist/server/web/spec-extension/response'
} 