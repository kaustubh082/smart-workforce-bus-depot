export async function audit(connection, userId, action, description) {
  await connection.execute('INSERT INTO audit_logs (user_id, action, description) VALUES (?, ?, ?)', [userId || null, action, description]);
}
