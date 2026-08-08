import { Respostas } from "@/lib/gerador";

interface VideoPrompt {
  id: string;
  name_pt: string;
  name_en: string;
  camera_pt: string;
  camera_en: string;
}

export const VIDEO_SHOTS: VideoPrompt[] = [
  {
    id: "fachada",
    name_pt: "Fachada / Chegada",
    name_en: "Facade / Arrival",
    camera_pt: "Câmera: dolly in lento e contínuo em direção à entrada, movimento único, sem cortes, sem mudança de eixo.",
    camera_en: "Camera: slow continuous dolly in toward the entrance, single movement, no cuts, no axis change.",
  },
  {
    id: "social",
    name_pt: "Área Social",
    name_en: "Social Area",
    camera_pt: "Câmera: órbita horizontal lenta de aproximadamente 15 graus ao redor da sala, altura constante, movimento único.",
    camera_en: "Camera: slow horizontal orbit of approximately 15 degrees around the room, constant height, single movement.",
  },
  {
    id: "diferencial",
    name_pt: "Diferencial do Imóvel",
    name_en: "Property Highlight",
    camera_pt: "Câmera: tilt up lento começando do chão e revelando {highlight}, movimento único, velocidade constante.",
    camera_en: "Camera: slow tilt up starting from the floor and revealing {highlight}, single movement, constant speed.",
  },
  {
    id: "detalhe",
    name_pt: "Detalhe e Frame Final",
    name_en: "Detail and Final Frame",
    camera_pt: "Câmera: push in suave e curto em direção a {detail}, terminando em um enquadramento centralizado estável. O frame final deve ser visualmente limpo com espaço negativo no lado direito para sobreposição de texto.",
    camera_en: "Camera: short smooth push in toward {detail}, ending on a stable centered framing. The final frame must be visually clean with negative space on the right side for text overlay.",
  }
];

export function generateVideoPrompts(respostas: Respostas, vertical: boolean) {
  const ratio = vertical ? "9:16 vertical" : "16:9 horizontal";
  
  const lights = {
    aconchegante: { pt: "golden hour, luz dourada quente", en: "golden hour, warm golden light" },
    claro: { pt: "luz natural suave e difusa do meio-dia", en: "soft diffused midday natural light" },
    neutro: { pt: "luz neutra e uniforme, sem sombras fortes", en: "neutral even light, no harsh shadows" },
    vibrante: { pt: "blue hour, luz azulada com pontos de destaque quentes", en: "blue hour, bluish light with warm accent points" },
    sóbrio: { pt: "golden hour lateral, alto contraste", en: "side golden hour, high contrast" }
  };

  const selectedLight = (lights as any)[respostas.estilo] || lights.neutro;

  const atmospheres = [
    { pt: "cortina leve balançando na brisa", en: "light curtain swaying in the breeze" },
    { pt: "reflexo de luz se movendo lentamente sobre uma superfície", en: "light reflection slowly moving across a surface" },
    { pt: "vapor subindo de uma xícara sobre a mesa", en: "steam rising from a cup on the table" },
    { pt: "folhagem externa se movendo suavemente", en: "outdoor foliage moving gently" },
    { pt: "luz mudando gradualmente de intensidade", en: "light gradually shifting in intensity" }
  ];

  const audios = {
    casais: { pt: "brisa suave e ambiente distante", en: "soft breeze and distant ambience" },
    familias: { pt: "pássaros ao fundo, ambiente calmo", en: "birds in the background, calm ambience" },
    trabalho: { pt: "ambiente silencioso com ruído fraco e distante da cidade", en: "quiet ambience with faint distant city noise" },
    amigos: { pt: "ambiente ao ar livre com brisa e água ao fundo", en: "open-air ambience with breeze and water in the background" }
  };

  const selectedAudio = (audios as any)[respostas.publico] || audios.trabalho;
  const highlight = respostas.comodos[0] || "ambiente principal";
  const detail = respostas.comodos[1] || "detalhe decorativo";

  return VIDEO_SHOTS.map((shot, index) => {
    const atmosphere = atmospheres[index % atmospheres.length];
    
    const templateEn = "Use the reference image as the first frame. Preserve the exact architecture, furniture, colors and straight-line geometry of the original image. {camera} Lighting: {light}, side incidence, soft elongated shadows. Atmosphere: {atmosphere}. Do not include: people, text, logos, watermarks, warped straight lines, layout or furniture changes, abrupt zoom, wall color changes. Ambient audio: {audio}. Duration: 20 seconds. Aspect ratio: {ratio}.";
    
    const templatePt = "Use a imagem de referência como o primeiro frame. Preserve a arquitetura exata, móveis, cores e a geometria de linhas retas da imagem original. {camera} Iluminação: {light}, incidência lateral, sombras suaves e alongadas. Atmosfera: {atmosphere}. Não inclua: pessoas, texto, logos, marcas d'água, linhas retas distorcidas, mudanças de layout ou móveis, zoom abrupto, mudanças na cor da parede. Áudio ambiente: {audio}. Duração: 20 segundos. Proporção: {ratio}.";

    const cameraEn = shot.camera_en.replace("{highlight}", highlight).replace("{detail}", detail);
    const cameraPt = shot.camera_pt.replace("{highlight}", highlight).replace("{detail}", detail);

    const promptEn = templateEn
      .replace("{camera}", cameraEn)
      .replace("{light}", selectedLight.en)
      .replace("{atmosphere}", atmosphere.en)
      .replace("{audio}", selectedAudio.en)
      .replace("{ratio}", ratio);

    const promptPt = templatePt
      .replace("{camera}", cameraPt)
      .replace("{light}", selectedLight.pt)
      .replace("{atmosphere}", atmosphere.pt)
      .replace("{audio}", selectedAudio.pt)
      .replace("{ratio}", ratio);

    return {
      id: shot.id,
      name_pt: shot.name_pt,
      name_en: shot.name_en,
      prompt_en: promptEn,
      prompt_pt: promptPt
    };
  });
}
