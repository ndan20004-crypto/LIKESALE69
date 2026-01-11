import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-bc9725da/health", (c) => {
  return c.json({ status: "ok" });
});

// Extract Facebook ID from URL
app.post("/make-server-bc9725da/extract-facebook-id", async (c) => {
  try {
    const { url } = await c.req.json();
    
    if (!url) {
      return c.json({ error: "URL is required" }, 400);
    }

    console.log('🔍 Extracting Facebook ID from URL:', url);

    // Try to extract numeric ID directly from URL patterns
    const patterns = [
      /\/posts\/(\d+)/,
      /\/photos\/(\d+)/,
      /\/videos\/(\d+)/,
      /\/permalink\/(\d+)/,
      /[?&](?:fbid|id)=(\d+)/,
      /story_fbid=(\d+)/,
      /\/photo\.php\?[^&]*fbid=(\d+)/,
      /profile\.php\?id=(\d+)/,
      /\/groups\/(\d+)/,
      /(\d{15,})/  // Any long number (15+ digits)
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        console.log('✅ Found numeric ID:', match[1]);
        return c.json({ id: match[1], type: 'numeric' });
      }
    }

    // If no numeric ID found, try traodoisub.com API
    console.log('📡 Calling traodoisub.com API...');
    
    try {
      const response = await fetch('https://id.traodoisub.com/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `link=${encodeURIComponent(url)}`
      });

      const data = await response.json();
      console.log('📨 Traodoisub API response:', data);

      if (data && data.id) {
        return c.json({ id: data.id, type: 'traodoisub' });
      }

      if (data && data.error) {
        console.log('⚠️ Traodoisub API returned error:', data.error);
        return c.json({ 
          error: "Link sai hoặc bài viết chưa được công khai. Vui lòng kiểm tra lại link Facebook của bạn."
        }, 400);
      }

      // If traodoisub fails without specific error
      return c.json({ 
        error: "Không thể trích xuất ID. Link có thể sai hoặc bài viết chưa được công khai."
      }, 400);
    } catch (apiError) {
      console.error('❌ Traodoisub API error:', apiError);
      return c.json({ 
        error: "Không thể kết nối đến dịch vụ trích xuất ID. Vui lòng thử lại sau."
      }, 500);
    }
  } catch (error) {
    console.error('❌ Error extracting Facebook ID:', error);
    return c.json({ error: "Lỗi hệ thống. Vui lòng thử lại sau." }, 500);
  }
});

Deno.serve(app.fetch);