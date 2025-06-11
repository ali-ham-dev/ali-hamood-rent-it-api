export const logError = (error, context = '') => {
    console.log('');
    console.log('--------------------------------');
    console.log(`Error ${context}:`);
    console.log('error:', error.message);
    console.log('--------------------------------');
    console.log('');
}; 

export const requestLogger = (req) => {
    console.log('');
    console.log('DateTime:', new Date().toISOString());
    console.log('Incoming request:', req.method, req.url);
    console.log('');
}