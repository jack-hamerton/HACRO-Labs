import PocketBase from 'pocketbase';

// Use direct PocketBase server for frontend auth to avoid proxy issues during development
const baseUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

const pb = new PocketBase(baseUrl);

export default pb;

