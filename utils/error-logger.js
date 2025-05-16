export const logError = (error, context = '') => {
    console.log('');
    console.log('--------------------------------');
    console.log(`Error ${context}:`);
    console.log('error:', error.message);
    console.log('--------------------------------');
    console.log('');
}; 