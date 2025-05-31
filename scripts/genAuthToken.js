import { execSync } from 'child_process';
import readline from 'readline';

console.log('Generating private key...');
const privateKey = execSync('openssl genrsa 2048').toString();

console.log('Generating public key...');
const publicKey = execSync('openssl rsa -pubout', { input: privateKey }).toString();

console.log('\nPrivate key:');
console.log(privateKey);
console.log('\nPublic key:');
console.log(publicKey);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('\nPress any key to clear the terminal once you copied the keys...', () => {
    console.clear();
    rl.close();
});
