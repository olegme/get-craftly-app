import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const resolveServiceAccount = () => {
  const envPath = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (envPath) {
    const cleaned = envPath.replace(/^['"]|['"]$/g, '');
    const expanded = cleaned.startsWith('~')
      ? path.join(process.env.HOME || '', cleaned.slice(1))
      : cleaned;
    const fullPath = path.resolve(expanded);
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  }

  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonEnv) {
    return JSON.parse(jsonEnv);
  }

  throw new Error('Set FIREBASE_SERVICE_ACCOUNT (path) or FIREBASE_SERVICE_ACCOUNT_JSON (json).');
};

const uid = process.argv[2];
const mode = process.argv[3] || 'grant';

if (!uid) {
  console.error('Usage: node scripts/setAdminClaim.js <uid> [grant|revoke]');
  process.exit(1);
}

if (!['grant', 'revoke'].includes(mode)) {
  console.error('Mode must be grant or revoke.');
  process.exit(1);
}

const serviceAccount = resolveServiceAccount();
initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();

const run = async () => {
  const user = await auth.getUser(uid);
  const claims = user.customClaims || {};
  if (mode === 'grant') {
    claims.admin = true;
  } else {
    delete claims.admin;
  }
  await auth.setCustomUserClaims(uid, claims);
  console.log(`Admin claim ${mode}ed for uid: ${uid}`);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
