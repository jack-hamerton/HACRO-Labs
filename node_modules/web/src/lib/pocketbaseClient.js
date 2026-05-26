import PocketBase from 'pocketbase';

const baseUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:3001/api/pocketbase';

const pb = new PocketBase(baseUrl);

export default pb;

