export function commaSeparate(text: string) {
  const separated = text.split(",").map((t) => t.trim());
  if (!separated[separated.length - 1]) {
    separated.pop();
  }
  return separated;
}

export async function decodeReadableStream<T extends BufferSource>(
  stream: ReadableStream<T>
) {
  const decoder = new TextDecoder();
  const reader = stream.getReader();

  let chunk = await reader.read();
  let decodedTxt = decoder.decode(chunk.value);
  while (!chunk.done) {
    chunk = await reader?.read();
    decodedTxt += decoder.decode(chunk.value);
  }
  return decodedTxt;
}
