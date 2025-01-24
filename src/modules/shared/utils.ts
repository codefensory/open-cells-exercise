export async function encodeText(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function parentPath<T extends Record<string | symbol, string>>(parent: string, children: T) {
  return new Proxy(children, {
    get: (target, prop) => {
      return `${parent}${target[prop]}`;
    },
  });
}
