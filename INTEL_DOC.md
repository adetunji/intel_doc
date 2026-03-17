# Intel Doc - Complete Application Design Prompt

Use this prompt to recreate the Intel Doc application from scratch using Claude Code with React + TypeScript, Vite, and Tailwind CSS v4.

---

## Project Overview

Build a single-page web application called **"Intel Doc"** that allows users to upload a PDF document and interact with it through a conversational chat interface. Since no real LLM API is connected, the chat uses a keyword-based document search to find and return relevant passages from the uploaded file.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 (utility-first, no `tailwind.config.js`)
- **Animation:** Motion (imported as `import { motion } from 'motion/react'`)
- **Icons:** lucide-react
- **Markdown:** react-markdown
- **No backend / No database** - everything runs client-side

## Color Scheme & Theme

Apply these CSS custom properties as the design system:

| Token               | Value               |
|----------------------|---------------------|
| `--background`       | `#F6F4F1`           |
| `--foreground`       | `#000000`           |
| `--card`             | `#ffffff`           |
| `--card-foreground`  | `#000000`           |
| `--primary`          | `#F95C4B`           |
| `--primary-foreground`| `#ffffff`          |
| `--muted`            | `#e3dfd8`           |
| `--muted-foreground` | `#717182`           |
| `--accent`           | `#000000`           |
| `--accent-foreground`| `#ffffff`           |
| `--border`           | `rgba(0, 0, 0, 0.1)`|
| `--radius`           | `0.625rem`          |

Map these to Tailwind v4 theme colors using `@theme inline` so you can use classes like `bg-background`, `text-primary`, `border-border`, etc.

## Application Layout

Full-screen, horizontal split-panel layout with no scrolling on the outer container:

```
+---------------------------+--------------------------------------------+
|   Upload Sidebar (w-80)   |           Chat Window (flex-1)             |
|   - Fixed width            |   - Flexible width                        |
|   - Card background        |   - Background color                      |
|   - Right border           |   - Scrollable message area               |
|   - Shadow                 |   - Fixed input at bottom                 |
+---------------------------+--------------------------------------------+
```

Root container: `flex h-screen w-full bg-background text-foreground overflow-hidden font-sans`

---

## Component Architecture

### 1. App Component (`/src/app/App.tsx`)

The main orchestrator. It manages:

**State:**
- `file: File | null` - the currently uploaded PDF file
- `documentChunks: string[]` - the extracted and chunked text from the PDF
- `messages: Message[]` - the chat conversation history
- `isTyping: boolean` - whether the assistant is "thinking"

**Handlers:**
- `handleFileSelect(file: File)` - Receives a file from the upload zone, resets chat messages, extracts text from the PDF using `extractTextFromPDF()`, chunks it with `chunkText(text, 1000)`, and stores the chunks in state. Shows an alert on error.
- `handleSendMessage(content: string)` - Creates a user message, adds it to state, sets `isTyping = true`, then after a `1500ms setTimeout`, calls `searchChunks()` to get a response, creates an assistant message, adds it to state, and sets `isTyping = false`.

**Message interface:**
```typescript
interface Message {
  id: string;       // Use Date.now().toString()
  role: 'user' | 'assistant';
  content: string;
}
```

**Renders:** `<UploadZone>` and `<ChatWindow>` side by side.

---

### 2. Upload Zone Component (`/src/app/components/upload-zone.tsx`)

A fixed-width sidebar (`w-80`) with card background and right border.

**Props:**
- `onFileSelect: (file: File) => void`
- `selectedFile: File | null`

**Header section** (top, with bottom border):
- App logo: An 8x8 rounded-md div with primary background containing a `FileText` icon (white, w-4 h-4)
- Title: "Intel Doc" in xl font
- Subtitle: "Upload your PDF document to start analyzing and chatting." in sm text with 70% opacity

**Upload area** (main content):
- A dashed-border drop zone (`border-2 border-dashed rounded-xl h-64`)
- Supports **drag and drop** (onDragOver, onDragLeave, onDrop) and **click to select**
- Only accepts `application/pdf` files; shows alert for non-PDF
- Drag state: border turns primary, slight bg tint, subtle scale animation (`scale-[1.02]`)

**Empty state (no file):**
- Circular muted icon container (w-12 h-12) with `UploadCloud` icon
- "Click or drag PDF" text
- "Max file size 50MB" subtext
- Primary-colored "Select File" button (rounded-lg, shadow, active:scale-95)

**File selected state:**
- Circular primary/10 container with `CheckCircle2` icon (primary color)
- File name (truncated with `truncate` class, with title tooltip)
- File size in MB (formatted to 2 decimal places)
- "Upload a different file" link below the drop zone (primary colored, underline on hover)

---

### 3. Chat Window Component (`/src/app/components/chat-window.tsx`)

The main chat interface filling the remaining space.

**Props:**
- `messages: Message[]`
- `isTyping: boolean`
- `onSendMessage: (msg: string) => void`
- `isFileUploaded: boolean`

**No-file-uploaded state:**
- Centered content with Motion animation (fade in + scale from 0.9)
- Large rounded icon container (w-24 h-24, `rounded-[2rem]`, card bg, border) with `FileText` icon
- "No Document Uploaded" heading (2xl)
- Instruction text: "Please upload a PDF document from the sidebar to start extracting insights."

**Empty chat state (file uploaded, no messages yet):**
- Centered content with Motion animation (fade in + slide up)
- Primary-tinted icon container (w-16 h-16, rounded-2xl, `bg-primary/10`) with `Bot` icon
- "Document Ready!" heading
- Instruction: "Your document has been processed. Ask me any question about its contents, and I'll find the most relevant information for you."

**Messages display:**
- Scrollable area with `overflow-y-auto`, `pb-32` for input clearance
- Each message animated with Motion (opacity 0->1, y 10->0)
- Max width `max-w-3xl mx-auto` for comfortable reading
- **User messages:** Right-aligned (`flex-row-reverse`), primary background, white text, rounded-2xl with `rounded-tr-[4px]` (chat bubble corner), avatar is primary circle with `User` icon
- **Assistant messages:** Left-aligned, card background with border, foreground text, rounded-2xl with `rounded-tl-[4px]`, avatar is card circle with border and `Bot` icon (primary colored). Content rendered with `<ReactMarkdown>` wrapped in prose styling.
- Auto-scroll to bottom on new messages using `useRef` + `useEffect` with `scrollIntoView({ behavior: 'smooth' })`

**Typing indicator:**
- Same layout as assistant message
- Three bouncing dots using Motion's `animate` prop: `y: [0, -4, 0]` with staggered delays (0, 0.2, 0.4s), `duration: 0.6`, `repeat: Infinity`
- Dots have increasing opacity: `bg-primary/40`, `bg-primary/60`, `bg-primary`
- Container: card bg, border, rounded-2xl with `rounded-tl-[4px]`

**Input area:**
- Pinned to bottom with `absolute bottom-0 left-0 right-0`
- Gradient fade overlay: `bg-gradient-to-t from-background via-background to-background/0`
- Text input: full width, card bg, border, rounded-xl, padding `pl-5 pr-14 py-4`, focus ring with primary/50
- Send button: absolute positioned inside input (right-2), primary bg, white icon (`Send` w-4 h-4), rounded-lg, disabled when input is empty (opacity-50), active:scale-95
- Disclaimer text below: "Intel Doc uses keyword matching. Results are based on document contents." in xs, 50% opacity

---

### 4. PDF Utilities (`/src/app/components/pdf-utils.ts`)

A pure TypeScript utility module with three exported functions. **No external PDF library dependencies** - this is a raw-byte text extractor.

#### `extractTextFromPDF(file: File): Promise<string>`
1. Read file as `ArrayBuffer` using `file.arrayBuffer()`
2. Decode with `new TextDecoder('utf-8')`
3. Strip non-alphanumeric characters: `text.replace(/[^a-zA-Z0-9\s.,?!;:()'"-]/g, ' ')`
4. Collapse whitespace: `.replace(/\s+/g, ' ').trim()`
5. Return cleaned text string

#### `chunkText(text: string, chunkSize: number = 1000): string[]`
1. Split text into words
2. Accumulate words into chunks until `currentLength >= chunkSize`
3. Push completed chunk, start new one
4. Return array of text chunks

#### `searchChunks(chunks: string[], query: string): string`
1. Extract keywords from query: split by whitespace, filter words with length > 3
2. If no valid keywords, return: "Could you please provide more specific keywords so I can search the document effectively?"
3. Score each chunk by counting how many keywords appear in it (case-insensitive)
4. Sort chunks by score descending, take the best match
5. If best score > 0, return a formatted response with the passage in a blockquote:
   ```
   Based on your document, I found this relevant passage:\n\n> "...{chunk}..."\n\n*Does this answer your question?*
   ```
6. If no match, return: "I couldn't find any specific information regarding that in the uploaded document. Could you try rephrasing?"

---

## Key Design Details

### Visual Style
- Warm, neutral background (`#F6F4F1`) - not pure white
- Coral/red-orange primary (`#F95C4B`) for buttons, accents, user messages
- Clean card surfaces with subtle borders and shadows (`shadow-sm`)
- Rounded corners throughout (buttons: `rounded-lg`, cards: `rounded-xl`, chat bubbles: `rounded-2xl`)
- Subtle hover/active states on interactive elements

### Animations (Motion)
- Page elements fade in with scale or slide animations
- Chat messages animate in with opacity + vertical slide
- Typing indicator uses bouncing dots
- Upload zone scales slightly on drag hover
- Buttons have `active:scale-95` for tactile feedback

### Responsive Considerations
- Sidebar is fixed at `w-80` with `shrink-0`
- Chat area fills remaining space with `flex-1`
- This is primarily a desktop layout

---

## File Structure

```
src/
  app/
    App.tsx                          # Main component with state management
    components/
      upload-zone.tsx                # PDF upload sidebar with drag & drop
      chat-window.tsx                # Chat interface with messages
      pdf-utils.ts                   # Text extraction and search utilities
  styles/
    fonts.css                        # Font imports (empty by default)
    index.css                        # Import aggregator
    tailwind.css                     # Tailwind base import
    theme.css                        # CSS custom properties + Tailwind theme
```

## Dependencies

```json
{
  "lucide-react": "latest",
  "motion": "latest",
  "react-markdown": "latest"
}
```

---

## Summary of User Flow

1. User opens the app and sees the split layout: upload sidebar on the left, empty chat on the right showing "No Document Uploaded"
2. User drags a PDF onto the upload zone (or clicks "Select File") - only PDF files accepted
3. The file is processed client-side: raw bytes decoded to text, cleaned, and chunked
4. Chat area updates to show "Document Ready!" with instructions
5. User types a question in the input field and presses Enter or clicks Send
6. User message appears right-aligned in a coral bubble
7. Typing indicator (three bouncing dots) appears on the left
8. After 1.5 seconds, the assistant responds with a relevant passage from the document (or a "not found" message)
9. Assistant message appears left-aligned in a white card bubble, rendered as Markdown
10. User can continue asking questions or upload a different file (which resets the chat)
