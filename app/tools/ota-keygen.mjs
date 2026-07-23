// One-time key ceremony for the OTA content channel. Generates an ed25519
// keypair and prints:
//   - the PRIVATE key (base64 PKCS8) — store it in the signing environment
//     (Cloudflare Pages secret OTA_SIGNING_KEY, and/or an offline copy). It is
//     printed once and never written to disk by this script.
//   - the PUBLIC key (base64 raw, 32 bytes) — committed: embedded in the iOS
//     client (OTAUpdater.swift) and used by CI to verify the sign/verify path.
//
// Rotation = run again, update the Swift constant, ship an app update; old
// installs keep working on the bundle until they update the binary.
import { generateKeyPairSync } from 'node:crypto';

const { publicKey, privateKey } = generateKeyPairSync('ed25519');

const priv = privateKey.export({ type: 'pkcs8', format: 'der' }).toString('base64');
// Raw 32-byte public key: last 32 bytes of the SPKI DER encoding.
const spki = publicKey.export({ type: 'spki', format: 'der' });
const rawPub = spki.subarray(spki.length - 32).toString('base64');

console.log('OTA signing keypair (ed25519)\n');
console.log('PRIVATE (OTA_SIGNING_KEY — keep secret, do NOT commit):');
console.log(priv + '\n');
console.log('PUBLIC (raw 32-byte, base64 — embed in OTAUpdater.swift / CI):');
console.log(rawPub);
