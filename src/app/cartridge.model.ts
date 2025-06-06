export interface Cartridge {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  genre: string;
  releaseYear: number;
}


/*
Futura integração com api
export interface Cartridge {
  id: number;
  name: string; // 'title' agora é 'name'
  background_image: string; // 'imageUrl' agora é 'background_image'
  description_raw: string; // 'description' agora é 'description_raw'
  genres: { name: string }[];
  released: string; // 'releaseYear' agora é 'released' (string)
}

// Interface para a resposta da API que contém a lista de jogos
export interface RawgApiResponse {
  results: Cartridge[];
}
*/