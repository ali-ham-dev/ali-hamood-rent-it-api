import { execSync } from 'child_process';
import readline from 'readline';

console.log('Generating private key...');
const privateKey = execSync('openssl genrsa 2048').toString();

console.log('Generating public key...');
const publicKey = execSync('openssl rsa -pubout', { input: privateKey }).toString();

function formatKeyForEnv(key) {
    return `'${key.replace(/\n/g, '\\n')}'`;
}

const formattedPrivateKey = formatKeyForEnv(privateKey);
const formattedPublicKey = formatKeyForEnv(publicKey);

function copyToClipboard(text) {
    execSync('pbcopy', { input: text });
}

console.log('\nPrivate key formatted for .env and copied to clipboard:');
console.log(formattedPrivateKey);
copyToClipboard(formattedPrivateKey);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('\nPress Enter to copy the public key to your clipboard...', () => {
    console.log('\nPublic key formatted for .env and copied to clipboard:');
    console.log(formattedPublicKey);
    copyToClipboard(formattedPublicKey);
    console.log('\nDone! The public key is now in your clipboard.');
});