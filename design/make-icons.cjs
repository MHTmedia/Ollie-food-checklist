const { chromium } = require('playwright');
const out = require('path').join(__dirname, '..', 'public', 'icons') + '/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1100, height: 1100 } });
  await p.goto('file://' + __dirname + '/app-icon.html'); await p.waitForTimeout(300);
  const shot = async (size, name, maskable = false) => {
    await p.evaluate(([s, m]) => {
      const svg = document.getElementById('icon'); svg.setAttribute('width', s); svg.setAttribute('height', s);
      // maskable: keep artwork inside the central safe zone (Android crops to a circle/squircle)
      document.getElementById('art').setAttribute('transform', m ? 'translate(512 525) scale(0.92) translate(-512 -545)' : 'translate(512 520) scale(1.16) translate(-512 -545)');
    }, [size, maskable]);
    await p.locator('#icon').screenshot({ path: out + name });
  };
  await shot(180, 'apple-touch-icon.png'); await shot(192, 'icon-192.png'); await shot(512, 'icon-512.png');
  await shot(512, 'icon-maskable-512.png', true); await shot(32, 'favicon-32.png');
  await b.close();
})();
