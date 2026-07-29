const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('/Users/webblazesofttech/Desktop/ReactJs_Project/Solatide_FE/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Replace text-[48px] with text-[32px] md:text-[48px] where it's at the start or after a space, 
    // and NOT preceded by md: or lg:
    const regex = /(?<!(md:|lg:|sm:|xl:))text-\[48px\](?!\s+md:text-\[46px\])/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, 'text-[32px] md:text-[48px]');
        changed = true;
    }

    // Fix the weird text-[48px] ... md:text-[46px] ones
    const regex2 = /text-\[48px\](.*?)md:text-\[46px\]/g;
    if (regex2.test(content)) {
        content = content.replace(regex2, 'text-[32px] md:text-[48px]$1');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
