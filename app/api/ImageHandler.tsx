export const postImageGeneration = async (
  prompt: string
): Promise<ImageResult> => {
  const response = await fetch("/api/images/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return await response.json();
};

export const fetchImageResult = async (id: string): Promise<ImageResult> => {
  const response = await fetch(`/api/images/result/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return await response.json();
};
