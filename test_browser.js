import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';

const artifactsDir = "C:\\Users\\hmont\\.gemini\\antigravity\\brain\\1bb66e24-6c74-42bd-aa68-8e0f9f020ed5";

async function run() {
  console.log("Starting Vite dev server...");
  const viteProcess = spawn('npx', ['vite', '--port', '5173'], { shell: true });
  
  viteProcess.stdout.on('data', (data) => {
    console.log(`[Vite stdout] ${data.toString().trim()}`);
  });

  viteProcess.stderr.on('data', (data) => {
    console.error(`[Vite stderr] ${data.toString().trim()}`);
  });

  // Aguarda 3 segundos para o servidor subir
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log("Launching Puppeteer browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleLogs = [];

  page.on('console', msg => {
    consoleLogs.push(`[Browser Console ${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      console.error(`[Browser Console ERROR] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    consoleLogs.push(`[Browser PageError] ${err.toString()}`);
    console.error(`[Browser PageError] ${err.toString()}`);
  });

  try {
    console.log("Navigating to http://localhost:5173...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

    console.log("Typing player name...");
    await page.type('input[placeholder="e.g. Alex Smith"]', "TestUser");

    console.log("Clicking Create Room button...");
    // Clica no botão "Create Room"
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const createBtn = buttons.find(b => b.textContent.includes('Create Room'));
      if (createBtn) createBtn.click();
    });

    console.log("Waiting 5 seconds for page updates...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("Taking screenshot...");
    const screenshotPath = path.join(artifactsDir, "lobby_test_result.png");
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    console.log("Closing browser...");
    await browser.close();

    console.log("Stopping Vite dev server...");
    viteProcess.kill('SIGINT');

    console.log("\n=== ALL BROWSER LOGS ===");
    consoleLogs.forEach(log => console.log(log));
    console.log("========================\n");
    process.exit(0);
  }
}

run();
