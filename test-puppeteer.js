import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function testPuppeteer() {
  console.log('Testing Puppeteer with stealth mode...');
  
  try {
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto('https://httpbin.org/user-agent', { timeout: 10000 });
    
    const content = await page.content();
    console.log('✅ Puppeteer test successful!');
    console.log('Content length:', content.length);
    
    await browser.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Puppeteer test failed:', error.message);
    process.exit(1);
  }
}

testPuppeteer();