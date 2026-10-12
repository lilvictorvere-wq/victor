const toolsRoot = process.env.TEST_TOOLS || '/tmp/victor-checks/node_modules';
const { chromium } = await import(`${toolsRoot}/playwright-core/index.mjs`);
const { default: AxeBuilder } = await import(`${toolsRoot}/@axe-core/playwright/dist/index.mjs`);
import assert from 'node:assert/strict';
const base = process.env.TEST_URL || 'http://127.0.0.1:3001';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const results=[];
for(const width of [390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:1000},httpCredentials:{username:process.env.TEST_USER || 'demo',password:process.env.TEST_PASSWORD || 'local-test-only'},reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 for(const route of ['/','/dashboard']){
  await page.goto(base+route);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  results.push({width,route,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});
  if(route === '/') {
   await page.keyboard.press('Tab'); assert.equal(await page.locator('.skip').evaluate(el=>el===document.activeElement),true);
   await page.getByRole('link',{name:'Deschide dashboard'}).click(); assert.equal(new URL(page.url()).pathname,'/dashboard');
   await page.goto(base);
   if(width>700){await page.getByRole('link',{name:'Funcționalități',exact:true}).click();assert.equal(new URL(page.url()).hash,'#functionalitati');}
  }
  await page.screenshot({path:`/tmp/victor-checks/${route==='/'?'landing':'dashboard'}-${width}.png`,fullPage:true});
 }
 for(const hash of ['firme','conversatii','clienti','costuri','setari','overview']){
  await page.locator(`.sidebar a[href="#${hash}"]`).click();
  await page.waitForFunction(h=>document.querySelector(`.sidebar a[href="#${h}"]`).getAttribute('aria-current')==='page',hash);
  assert.equal(await page.locator(`.sidebar a[href="#${hash}"]`).getAttribute('aria-current'),'page');
 }
 await page.locator('#stop-agent').click();assert.match(await page.locator('#feedback').innerText(),/Oprire simulată/);
 await page.locator('a[href="#firme"]').click();await page.locator('#search').fill('atelier');assert.equal(await page.locator('#firm-rows tr').count(),1);
 await page.locator('#search').fill('inexistent');assert.equal(await page.locator('#firm-rows tr').count(),0);
 await page.locator('a[href="#setari"]').click();await page.locator('input[name=limit]').fill('7');await page.getByRole('button',{name:'Salvează în demo'}).click();assert.match(await page.locator('#feedback').innerText(),/salvate/);
 await page.locator('a[href="#overview"]').click();await page.locator('a[href="#setari"]').click();assert.equal(await page.locator('input[name=limit]').inputValue(),'7');
 results.push({width,interactions:'passed',consoleErrors:errors});
 await context.close();
}
console.log(JSON.stringify(results,null,2));await browser.close();
