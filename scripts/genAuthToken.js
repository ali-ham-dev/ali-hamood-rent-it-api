import { execSync } from 'child_process';

console.log('Generating private key...');
const privateKey = execSync('openssl genrsa 2048').toString();

console.log('Generating public key...');
const publicKey = execSync('openssl rsa -pubout', { input: privateKey }).toString();

console.log('\nPrivate key:');
console.log(privateKey);
console.log('\nPublic key:');
console.log(publicKey);
