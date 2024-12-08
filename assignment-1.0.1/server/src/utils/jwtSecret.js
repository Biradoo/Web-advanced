import bcrypt from 'bcrypt';

const JWT_SECRET = 'yourSuperSecretKey';

export const hashSecret = async () => bcrypt.hash(JWT_SECRET, 10);
export const getSecret = async () => JWT_SECRET; // Simplify for now, can include advanced fetching if needed.
export const compareSecrets = async (secret1, secret2) => bcrypt.compare(secret1, secret2);

export default JWT_SECRET;