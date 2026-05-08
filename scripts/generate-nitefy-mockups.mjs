import { mkdir, writeFile } from "node:fs/promises";

const outDir = new URL("../public/", import.meta.url);

function phone(x, y, scale = 1) {
  const s = scale;
  const p = (n) => Math.round(n * s * 100) / 100;
  const X = (n) => Math.round((x + n * s) * 100) / 100;
  const Y = (n) => Math.round((y + n * s) * 100) / 100;

  return `
  <g filter="url(#shadow)">
    <rect x="${X(0)}" y="${Y(0)}" width="${p(390)}" height="${p(844)}" rx="${p(48)}" fill="#05060B" stroke="white" stroke-opacity="0.2"/>
    <clipPath id="clip-${Math.round(x)}-${Math.round(y)}"><rect x="${X(16)}" y="${Y(16)}" width="${p(358)}" height="${p(812)}" rx="${p(36)}"/></clipPath>
    <g clip-path="url(#clip-${Math.round(x)}-${Math.round(y)})">
      <rect x="${X(16)}" y="${Y(16)}" width="${p(358)}" height="${p(812)}" fill="#090A12"/>
      <rect x="${X(16)}" y="${Y(16)}" width="${p(358)}" height="${p(180)}" fill="#C8FF3D" opacity="0.055"/>
      <rect x="${X(16)}" y="${Y(130)}" width="${p(130)}" height="${p(620)}" fill="#56D6FF" opacity="0.055"/>
      <rect x="${X(158)}" y="${Y(30)}" width="${p(74)}" height="${p(6)}" rx="${p(3)}" fill="white" opacity="0.22"/>
      <text x="${X(42)}" y="${Y(63)}" fill="white" opacity="0.72" font-size="${p(11)}" font-weight="700">22:48</text>
      <text x="${X(298)}" y="${Y(63)}" fill="white" opacity="0.72" font-size="${p(11)}" font-weight="700">5G</text>

      <rect x="${X(34)}" y="${Y(78)}" width="${p(322)}" height="${p(50)}" rx="${p(16)}" fill="#090A12" opacity="0.44" stroke="white" stroke-opacity="0.08"/>
      <rect x="${X(48)}" y="${Y(88)}" width="${p(30)}" height="${p(30)}" rx="${p(8)}" fill="#C8FF3D"/>
      <text x="${X(59)}" y="${Y(109)}" fill="#090A12" font-size="${p(15)}" font-weight="900">N</text>
      <text x="${X(90)}" y="${Y(104)}" fill="white" font-size="${p(17)}" font-weight="900">NITEFY</text>
      <text x="${X(90)}" y="${Y(119)}" fill="white" opacity="0.52" font-size="${p(9)}" font-weight="700">Don't guess the night.</text>
      <rect x="${X(314)}" y="${Y(88)}" width="${p(30)}" height="${p(30)}" rx="${p(15)}" fill="white" opacity="0.08" stroke="white" stroke-opacity="0.12"/>
      <circle cx="${X(329)}" cy="${Y(103)}" r="${p(5)}" fill="#C8FF3D"/>

      <text x="${X(40)}" y="${Y(188)}" fill="white" font-size="${p(31)}" font-weight="900">Find your night</text>
      <text x="${X(40)}" y="${Y(224)}" fill="white" font-size="${p(31)}" font-weight="900">in Dusseldorf</text>
      <text x="${X(40)}" y="${Y(268)}" fill="white" opacity="0.68" font-size="${p(13)}" font-weight="500">Venues matched to your music taste, vibe and budget.</text>

      <rect x="${X(40)}" y="${Y(304)}" width="${p(310)}" height="${p(56)}" rx="${p(14)}" fill="#C8FF3D"/>
      <text x="${X(62)}" y="${Y(338)}" fill="#090A12" font-size="${p(18)}" font-weight="900">Connect Spotify</text>
      <text x="${X(62)}" y="${Y(352)}" fill="#090A12" opacity="0.65" font-size="${p(10)}" font-weight="700">Match from your real taste</text>
      <text x="${X(326)}" y="${Y(340)}" fill="#090A12" font-size="${p(18)}" font-weight="900">-&gt;</text>

      ${chip(X(40), Y(396), p(78), "Hip-hop", true, s)}
      ${chip(X(126), Y(396), p(88), "Afrobeat", false, s)}
      ${chip(X(222), Y(396), p(78), "Techno", false, s)}
      ${chip(X(40), Y(450), p(108), "High energy", true, s)}
      ${chip(X(156), Y(450), p(64), "Chill", false, s)}
      ${chip(X(228), Y(450), p(112), "Underground", false, s)}

      <rect x="${X(40)}" y="${Y(510)}" width="${p(310)}" height="${p(66)}" rx="${p(14)}" fill="#10131B" stroke="white" stroke-opacity="0.1"/>
      <text x="${X(56)}" y="${Y(534)}" fill="white" opacity="0.86" font-size="${p(12)}" font-weight="900">Distance</text>
      <text x="${X(302)}" y="${Y(534)}" fill="#C8FF3D" font-size="${p(12)}" font-weight="900">8 km</text>
      <rect x="${X(56)}" y="${Y(558)}" width="${p(270)}" height="${p(8)}" rx="${p(4)}" fill="white" opacity="0.12"/>
      <rect x="${X(56)}" y="${Y(558)}" width="${p(158)}" height="${p(8)}" rx="${p(4)}" fill="#C8FF3D"/>
      <circle cx="${X(218)}" cy="${Y(562)}" r="${p(13)}" fill="#C8FF3D"/>

      <text x="${X(40)}" y="${Y(634)}" fill="white" font-size="${p(21)}" font-weight="900">Recommended tonight</text>
      <text x="${X(302)}" y="${Y(634)}" fill="#56D6FF" font-size="${p(10)}" font-weight="900">Swipe</text>
      <rect x="${X(40)}" y="${Y(656)}" width="${p(302)}" height="${p(150)}" rx="${p(16)}" fill="#10131B" stroke="#C8FF3D" stroke-opacity="0.34"/>
      <rect x="${X(40)}" y="${Y(656)}" width="${p(302)}" height="${p(74)}" rx="${p(16)}" fill="url(#venue)"/>
      <rect x="${X(54)}" y="${Y(670)}" width="${p(72)}" height="${p(30)}" rx="${p(15)}" fill="#C8FF3D"/>
      <text x="${X(74)}" y="${Y(690)}" fill="#090A12" font-size="${p(11)}" font-weight="900">92%</text>
      <rect x="${X(280)}" y="${Y(670)}" width="${p(48)}" height="${p(30)}" rx="${p(15)}" fill="black" opacity="0.5"/>
      <text x="${X(290)}" y="${Y(690)}" fill="white" font-size="${p(10)}" font-weight="700">4.6</text>
      <text x="${X(56)}" y="${Y(754)}" fill="white" font-size="${p(22)}" font-weight="900">SilQ Club</text>
      <text x="${X(56)}" y="${Y(780)}" fill="#56D6FF" font-size="${p(12)}" font-weight="700">Altstadt · 1.8 km</text>
      <text x="${X(56)}" y="${Y(804)}" fill="white" opacity="0.68" font-size="${p(12)}" font-weight="500">Packed dance floor, polished fits and hip-hop heat.</text>

      <rect x="${X(16)}" y="${Y(756)}" width="${p(358)}" height="${p(72)}" fill="#090A12" opacity="0.96" stroke="white" stroke-opacity="0.1"/>
      <text x="${X(54)}" y="${Y(790)}" fill="#C8FF3D" font-size="${p(13)}" font-weight="800" text-anchor="middle">Home</text>
      <text x="${X(142)}" y="${Y(790)}" fill="white" opacity="0.48" font-size="${p(13)}" font-weight="800" text-anchor="middle">Matches</text>
      <text x="${X(234)}" y="${Y(790)}" fill="white" opacity="0.48" font-size="${p(13)}" font-weight="800" text-anchor="middle">Map</text>
      <text x="${X(320)}" y="${Y(790)}" fill="white" opacity="0.48" font-size="${p(13)}" font-weight="800" text-anchor="middle">Profile</text>
    </g>
  </g>`;
}

function chip(x, y, w, label, active, scale = 1) {
  return `
      <rect x="${x}" y="${y}" width="${w}" height="${34 * scale}" rx="${17 * scale}" fill="${active ? "#C8FF3D" : "white"}" opacity="${active ? "1" : "0.075"}" stroke="${active ? "#C8FF3D" : "white"}" stroke-opacity="${active ? "1" : "0.12"}"/>
      <text x="${x + 14 * scale}" y="${y + 22 * scale}" fill="${active ? "#090A12" : "white"}" opacity="${active ? "1" : "0.78"}" font-size="${12 * scale}" font-weight="${active ? "900" : "700"}">${label}</text>`;
}

function defs(width, height) {
  return `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#090A12"/>
      <stop offset="0.55" stop-color="#11131D"/>
      <stop offset="1" stop-color="#0B1016"/>
    </linearGradient>
    <linearGradient id="venue" x1="0" y1="0" x2="320" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#46246C"/>
      <stop offset="1" stop-color="#FF5C5C"/>
    </linearGradient>
    <filter id="shadow" x="-80" y="-80" width="${width + 160}" height="${height + 160}" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="34" stdDeviation="44" flood-color="#000000" flood-opacity="0.46"/>
    </filter>
  </defs>`;
}

function shell(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  ${defs(width, height)}
  <style>text{font-family:Inter,Arial,sans-serif}</style>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="-80" y="-40" width="${width + 160}" height="${height * 0.25}" fill="#C8FF3D" opacity="0.06"/>
  <rect x="-120" y="${height * 0.22}" width="${width * 0.42}" height="${height * 0.68}" fill="#56D6FF" opacity="0.075"/>
  <rect x="${width * 0.72}" y="${height * 0.18}" width="${width * 0.34}" height="${height * 0.58}" fill="#FF5C5C" opacity="0.055"/>
  ${body}
</svg>`;
}

const clean = shell(1080, 1350, `
  <rect x="76" y="76" width="64" height="64" rx="14" fill="#C8FF3D"/>
  <text x="101" y="119" fill="#090A12" font-size="28" font-weight="900">N</text>
  <text x="162" y="104" fill="white" font-size="34" font-weight="900">NITEFY</text>
  <text x="162" y="136" fill="white" opacity="0.58" font-size="18" font-weight="700">Don't guess the night. NITEFY it.</text>
  <text x="76" y="310" fill="#C8FF3D" font-size="20" font-weight="900" letter-spacing="1.5">MOBILE PREVIEW</text>
  <text x="76" y="405" fill="white" font-size="78" font-weight="900">Your night,</text>
  <text x="76" y="488" fill="white" font-size="78" font-weight="900">matched by</text>
  <text x="76" y="571" fill="white" font-size="78" font-weight="900">your music.</text>
  <text x="80" y="665" fill="white" opacity="0.68" font-size="27" font-weight="500">A mobile-first nightlife app for finding the right venue tonight.</text>
  <rect x="80" y="748" width="310" height="66" rx="33" fill="#C8FF3D"/>
  <text x="126" y="790" fill="#090A12" font-size="22" font-weight="900">Join early testers</text>
  ${phone(570, 110, 1)}
`);

const story = shell(1080, 1920, `
  <text x="90" y="150" fill="#C8FF3D" font-size="24" font-weight="900" letter-spacing="2">NITEFY</text>
  <text x="90" y="248" fill="white" font-size="82" font-weight="900">Stop guessing</text>
  <text x="90" y="338" fill="white" font-size="82" font-weight="900">where to go.</text>
  ${phone(345, 430, 1)}
  <text x="120" y="1460" fill="white" font-size="44" font-weight="900" text-anchor="middle"></text>
  <rect x="210" y="1510" width="660" height="86" rx="43" fill="#C8FF3D"/>
  <text x="540" y="1564" fill="#090A12" font-size="30" font-weight="900" text-anchor="middle">Tester access coming soon</text>
  <text x="540" y="1658" fill="white" opacity="0.65" font-size="26" font-weight="500" text-anchor="middle">Music taste. Vibe. Budget. Distance.</text>
`);

const carousel = shell(1080, 1350, `
  <text x="72" y="118" fill="#C8FF3D" font-size="20" font-weight="900" letter-spacing="1.5">CAROUSEL CONCEPT</text>
  <text x="72" y="210" fill="white" font-size="66" font-weight="900">3 reasons to try NITEFY.</text>
  <g transform="translate(70 330)">
    <rect width="280" height="620" rx="28" fill="#10131B" stroke="white" stroke-opacity="0.12"/>
    <text x="32" y="72" fill="#C8FF3D" font-size="52" font-weight="900">01</text>
    <text x="32" y="150" fill="white" font-size="36" font-weight="900">Connect</text>
    <text x="32" y="192" fill="white" font-size="36" font-weight="900">Spotify</text>
    <text x="32" y="252" fill="white" opacity="0.66" font-size="20" font-weight="500">Let your recent taste shape the night.</text>
    <rect x="32" y="420" width="216" height="60" rx="30" fill="#C8FF3D"/>
    <text x="72" y="458" fill="#090A12" font-size="20" font-weight="900">Connect</text>
  </g>
  <g transform="translate(400 330)">
    <rect width="280" height="620" rx="28" fill="#10131B" stroke="white" stroke-opacity="0.12"/>
    <text x="32" y="72" fill="#C8FF3D" font-size="52" font-weight="900">02</text>
    <text x="32" y="150" fill="white" font-size="36" font-weight="900">Set the</text>
    <text x="32" y="192" fill="white" font-size="36" font-weight="900">vibe</text>
    <text x="32" y="252" fill="white" opacity="0.66" font-size="20" font-weight="500">Pick energy, distance and budget fast.</text>
    ${chip(32, 420, 116, "High energy", true, 1)}
    ${chip(32, 470, 90, "Techno", false, 1)}
  </g>
  <g transform="translate(730 330)">
    <rect width="280" height="620" rx="28" fill="#10131B" stroke="white" stroke-opacity="0.12"/>
    <text x="32" y="72" fill="#C8FF3D" font-size="52" font-weight="900">03</text>
    <text x="32" y="150" fill="white" font-size="36" font-weight="900">Find the</text>
    <text x="32" y="192" fill="white" font-size="36" font-weight="900">right room</text>
    <text x="32" y="252" fill="white" opacity="0.66" font-size="20" font-weight="500">Swipe venues ranked by fit.</text>
    <rect x="32" y="390" width="216" height="130" rx="18" fill="url(#venue)"/>
    <rect x="48" y="408" width="70" height="30" rx="15" fill="#C8FF3D"/>
    <text x="68" y="428" fill="#090A12" font-size="11" font-weight="900">92%</text>
    <text x="48" y="560" fill="white" font-size="24" font-weight="900">SilQ Club</text>
  </g>
  <text x="72" y="1120" fill="white" opacity="0.62" font-size="26" font-weight="500">Built for young nightlife decisions in Dusseldorf.</text>
`);

const gallery = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NITEFY Mockups</title>
    <style>
      body { margin: 0; background: #090a12; color: white; font-family: Inter, Arial, sans-serif; }
      main { max-width: 1180px; margin: 0 auto; padding: 40px 20px; }
      h1 { font-size: clamp(32px, 7vw, 72px); line-height: .95; margin: 0 0 12px; }
      p { color: rgba(255,255,255,.68); font-size: 18px; margin: 0 0 28px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
      a { color: inherit; text-decoration: none; }
      figure { margin: 0; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04); border-radius: 12px; overflow: hidden; }
      img { display: block; width: 100%; height: auto; }
      figcaption { padding: 14px 16px; font-weight: 900; }
    </style>
  </head>
  <body>
    <main>
      <h1>NITEFY mockup versions</h1>
      <p>Open any mockup directly, then export or screenshot for social testing.</p>
      <div class="grid">
        ${["nitefy-phone-preview.svg", "nitefy-mockup-clean.svg", "nitefy-mockup-story.svg", "nitefy-mockup-carousel.svg", "nitefy-mobile-screen.svg"].map((file) => `<a href="/${file}"><figure><img src="/${file}" alt="${file}"><figcaption>${file}</figcaption></figure></a>`).join("")}
      </div>
    </main>
  </body>
</html>`;

await mkdir(outDir, { recursive: true });
await writeFile(new URL("nitefy-mockup-clean.svg", outDir), clean);
await writeFile(new URL("nitefy-mockup-story.svg", outDir), story);
await writeFile(new URL("nitefy-mockup-carousel.svg", outDir), carousel);
await writeFile(new URL("nitefy-mockups.html", outDir), gallery);
