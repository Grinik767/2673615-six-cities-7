export function getMongoURI(login: string, password: string, host: string, port: number, databaseName: string): string {
  const hostname = host.includes(':') && !host.startsWith('[') ? `[${host}]` : host;
  return `mongodb://${encodeURIComponent(login)}:${encodeURIComponent(password)}@${hostname}:${port}/${encodeURIComponent(databaseName)}?authSource=admin`;
}
