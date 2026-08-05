export const VIDEO_PROMPT_TEMPLATES = {
  SHOT_1: `Use a imagem de referência como primeiro frame. Preserve exatamente a arquitetura, o mobiliário, as cores e a geometria das linhas retas.
Movimento de câmera: dolly in lento e contínuo, aproximando da entrada. Movimento único, sem corte e sem mudança de eixo.
Luz: {luz}, incidência lateral, sombras suaves e alongadas.
Atmosfera: {atmosfera}.
Não incluir: pessoas, texto, logotipos, marcas d'água, distorção de linhas retas, alteração de layout ou de mobília, zoom brusco, mudança de cor das paredes.
Áudio ambiente: {audio}.
Duração: 8 segundos. Formato: {formato}.`,
  
  SHOT_2: `Use a imagem de referência como primeiro frame. Preserve exatamente a arquitetura, o mobiliário, as cores e a geometria das linhas retas.
Movimento de câmera: órbita horizontal lenta de aproximadamente 15 graus ao redor do ambiente, altura constante. Movimento único.
Luz: {luz}, incidência lateral, sombras suaves e alongadas.
Atmosfera: {atmosfera}.
Não incluir: pessoas, texto, logotipos, marcas d'água, distorção de linhas retas, alteração de layout ou de mobília, zoom brusco, mudança de cor das paredes.
Áudio ambiente: {audio}.
Duração: 8 segundos. Formato: {formato}.`,
  
  SHOT_3: `Use a imagem de referência como primeiro frame. Preserve exatamente a arquitetura, o mobiliário, as cores e a geometria das linhas retas.
Movimento de câmera: tilt up lento, partindo do piso e revelando {destaque}. Movimento único, velocidade constante.
Luz: {luz}, incidência lateral, sombras suaves e alongadas.
Atmosfera: {atmosfera}.
Não incluir: pessoas, texto, logotipos, marcas d'água, distorção de linhas retas, alteração de layout ou de mobília, zoom brusco, mudança de cor das paredes.
Áudio ambiente: {audio}.
Duração: 8 segundos. Formato: {formato}.`,
  
  SHOT_4: `Use a imagem de referência como primeiro frame. Preserve exatamente a arquitetura, o mobiliário, as cores e a geometria das linhas retas.
Movimento de câmera: push in curto e suave em direção a {detalhe}, terminando em enquadramento estável e centralizado.
Luz: {luz}, incidência lateral, sombras suaves e alongadas.
Atmosfera: {atmosfera}.
Observação adicional: o último frame deve ficar visualmente limpo, com espaço negativo à direita para inserção de texto.
Não incluir: pessoas, texto, logotipos, marcas d'água, distorção de linhas retas, alteração de layout ou de mobília, zoom brusco, mudança de cor das paredes.
Áudio ambiente: {audio}.
Duração: 8 segundos. Formato: {formato}.`
};

export const VARIAVEIS_LUZ: Record<string, string> = {
  aconchegante: "golden hour, luz dourada e quente",
  claro: "luz natural difusa de meio-dia",
  limpo: "luz neutra e uniforme, sem sombras duras",
  vibrante: "blue hour, luz azulada com pontos quentes",
  sóbrio: "golden hour lateral, contraste alto"
};

export const VARIAVEIS_ATMOSFERA = [
  "cortina leve balançando com a brisa",
  "reflexo da luz se movendo lentamente na superfície",
  "vapor subindo de uma xícara sobre a mesa",
  "folhagem externa se movendo suavemente",
  "luz mudando gradualmente de intensidade"
];

export const VARIAVEIS_AUDIO: Record<string, string> = {
  casais: "brisa suave e som ambiente distante",
  familias: "pássaros ao fundo e ambiente calmo",
  trabalho: "silêncio ambiente com leve ruído urbano distante",
  amigos: "ambiente aberto com brisa e água ao fundo",
  "alto-padrao": "silêncio profundo com sutil textura de vento",
  investidor: "ambiente urbano calmo e profissional"
};

export function generateVideoPrompts(r: any, vertical: boolean = true) {
  const formato = vertical ? "9:16 vertical" : "16:9 horizontal";
  const luz = VARIAVEIS_LUZ[r.estilo] || VARIAVEIS_LUZ.aconchegante;
  const audio = VARIAVEIS_AUDIO[r.publico] || VARIAVEIS_AUDIO.casais;
  
  // Destaque e detalhe baseados nos cômodos
  const destaque = r.comodos[0] || "o ambiente principal";
  const detalhe = r.comodos[1] || "detalhes de acabamento";

  return {
    shot1: VIDEO_PROMPT_TEMPLATES.SHOT_1
      .replace("{luz}", luz)
      .replace("{atmosfera}", VARIAVEIS_ATMOSFERA[0])
      .replace("{audio}", audio)
      .replace("{formato}", formato),
    shot2: VIDEO_PROMPT_TEMPLATES.SHOT_2
      .replace("{luz}", luz)
      .replace("{atmosfera}", VARIAVEIS_ATMOSFERA[1])
      .replace("{audio}", audio)
      .replace("{formato}", formato),
    shot3: VIDEO_PROMPT_TEMPLATES.SHOT_3
      .replace("{luz}", luz)
      .replace("{atmosfera}", VARIAVEIS_ATMOSFERA[2])
      .replace("{destaque}", destaque)
      .replace("{audio}", audio)
      .replace("{formato}", formato),
    shot4: VIDEO_PROMPT_TEMPLATES.SHOT_4
      .replace("{luz}", luz)
      .replace("{atmosfera}", VARIAVEIS_ATMOSFERA[3])
      .replace("{detalhe}", detalhe)
      .replace("{audio}", audio)
      .replace("{formato}", formato),
  };
}
