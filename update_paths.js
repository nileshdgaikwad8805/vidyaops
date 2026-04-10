const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const replacements = [
  { match: /href="styles\.css"/g, replace: 'href="css/styles.css"' },
  { match: /src="script\.js"/g, replace: 'src="js/script.js"' },
  { match: /src="enroll\.js"/g, replace: 'src="js/enroll.js"' },
  { match: /src="learner-dashboard\.js"/g, replace: 'src="js/learner-dashboard.js"' },
  { match: /src="admin\.js"/g, replace: 'src="js/admin.js"' },
  { match: /src="admin-login\.js"/g, replace: 'src="js/admin-login.js"' },
  { match: /src="volunteer\.js"/g, replace: 'src="js/volunteer.js"' },
  { match: /src="workshops\.js"/g, replace: 'src="js/workshops.js"' },
  { match: /src="test-banner\.js"/g, replace: 'src="js/test-banner.js"' },
  { match: /src="test-volunteer\.js"/g, replace: 'src="js/test-volunteer.js"' },
  { match: /(href|src)="favicon\.svg(\?v=[0-9]+)?"/g, replace: '$1="assets/favicon.svg$2"' },
  { match: /(href|src)="logo-mark\.svg(\?v=[0-9]+)?"/g, replace: '$1="assets/logo-mark.svg$2"' }
];

for (const file of files) {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  for (const { match, replace } of replacements) {
    content = content.replace(match, replace);
  }
  if (originalContent !== content) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated paths in ${file}`);
  }
}
