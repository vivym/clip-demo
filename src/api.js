import axios from 'axios';

export const searchImagesByText = async (text) => {
  const { data } = await axios.get("https://api.kg.sota.wiki/v1/images", {
    params: {
      text: text,
      lang: "en",
      limit: 20,
      nprobe: 16,
    }
  });

  const { code, message, data: results } = data;

  if (code === 0) {
    return results;
  } else {
    throw new Error(message);
  }
}