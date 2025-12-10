import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

export interface UserSettings {
    maxHr: number;
    ftp: number;
    weight: number;
    height: number;
    colorBlindMode?: boolean;
    darkMode?: boolean;
    activities?: any[];
    lastActivityFetch?: number;
}

interface Database {
    [stravaId: string]: UserSettings;
}

function ensureDbExists() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
    }
}

export async function getUserSettings(stravaId: number): Promise<UserSettings | null> {
    // 1. Try Vercel KV (Redis)
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
            return await kv.get(`user:${stravaId}`);
        } catch (error) {
            console.error('Vercel KV Error:', error);
            // Fallthrough to local file? No, if KV is configured but failing, likely shouldn't mix data sources silently.
            // But for safety/migration, maybe? Let's return null to be safe.
            return null;
        }
    }

    // 2. Fallback to Local JSON File
    ensureDbExists();
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const db: Database = JSON.parse(data);
        return db[stravaId.toString()] || null;
    } catch (error) {
        console.error('Error reading local DB:', error);
        return null;
    }
}

export async function saveUserSettings(stravaId: number, settings: UserSettings): Promise<void> {
    // 1. Try Vercel KV
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
            await kv.set(`user:${stravaId}`, settings);
            return;
        } catch (error) {
            console.error('Vercel KV Save Error:', error);
            return;
        }
    }

    // 2. Fallback to Local JSON File
    ensureDbExists();
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const db: Database = JSON.parse(data);
        db[stravaId.toString()] = settings;
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (error) {
        console.error('Error writing local DB:', error);
    }
}
