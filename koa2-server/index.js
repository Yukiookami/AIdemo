import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Koa2 Server running at http://localhost:${PORT}`);
  console.log(`🌐 Accessible via Tailscale at http://shiro-windows:${PORT}`);
});
