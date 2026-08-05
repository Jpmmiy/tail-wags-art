export const SCORING_WEIGHTS = {
  DEMANDA: {
    MAX: 30,
    RATINGS_COUNT: {
      LEVEL_1: { min: 100, score: 15 },
      LEVEL_2: { min: 50, score: 12 },
      LEVEL_3: { min: 20, score: 8 },
      LEVEL_4: { min: 0, score: 4 },
      MISSING: 6,
    },
    RATING_VALUE: {
      EXCELLENT: { min: 4.5, score: 15 },
      GOOD: { min: 4.0, score: 10 },
      POOR: { min: 0, score: 5 },
      MISSING: 7,
    },
  },
  GARGALO_VISUAL: {
    MAX: 30,
    PHOTO_COUNT: {
      CRITICAL: { max: 4, score: 30 },
      LOW: { max: 9, score: 22 },
      MEDIUM: { max: 19, score: 12 },
      HIGH: { min: 20, score: 5 },
      MISSING: 25,
    },
  },
  PRESENCA_DIGITAL: {
    MAX: 25,
    WEBSITE: {
      MISSING: 25,
      PRESENT: 6,
    },
  },
  ATIVIDADE: {
    MAX: 15,
    LAST_REVIEW: {
      OLD: { min_days: 91, score: 15 },
      MEDIUM: { min_days: 31, score: 10 },
      RECENT: { max_days: 30, score: 5 },
      MISSING: 8,
    },
  },
};

export const SCORE_RANGES = {
  ALTA: { min: 80, label: "Oportunidade Alta", color: "orange" },
  MEDIA: { min: 60, label: "Oportunidade Média", color: "amber" },
  BAIXA: { min: 0, label: "Oportunidade Baixa", color: "gray" },
};

export type OpportunitySignal = {
  text: string;
  type: 'demanda' | 'visual' | 'digital' | 'atividade';
  value: number;
};

export function calculateScore(place: any) {
  let score = 0;
  const signals: OpportunitySignal[] = [];

  // 1. DEMANDA (Max 30)
  const count = place.userRatingCount || 0;
  const rating = place.rating || 0;
  
  let demandaScore = 0;
  if (!place.userRatingCount && place.userRatingCount !== 0) demandaScore += SCORING_WEIGHTS.DEMANDA.RATINGS_COUNT.MISSING;
  else if (count >= 100) demandaScore += SCORING_WEIGHTS.DEMANDA.RATINGS_COUNT.LEVEL_1.score;
  else if (count >= 50) demandaScore += SCORING_WEIGHTS.DEMANDA.RATINGS_COUNT.LEVEL_2.score;
  else if (count >= 20) demandaScore += SCORING_WEIGHTS.DEMANDA.RATINGS_COUNT.LEVEL_3.score;
  else demandaScore += SCORING_WEIGHTS.DEMANDA.RATINGS_COUNT.LEVEL_4.score;

  if (!place.rating && place.rating !== 0) demandaScore += SCORING_WEIGHTS.DEMANDA.RATING_VALUE.MISSING;
  else if (rating >= 4.5) demandaScore += SCORING_WEIGHTS.DEMANDA.RATING_VALUE.EXCELLENT.score;
  else if (rating >= 4.0) demandaScore += SCORING_WEIGHTS.DEMANDA.RATING_VALUE.GOOD.score;
  else demandaScore += SCORING_WEIGHTS.DEMANDA.RATING_VALUE.POOR.score;
  
  score += demandaScore;
  if (count > 0) {
    signals.push({ 
      text: `${count} avaliações com ${rating.toFixed(1)}★ — demanda comprovada`, 
      type: 'demanda', 
      value: demandaScore 
    });
  }

  // 2. GARGALO VISUAL (Max 30)
  const photosCount = place.photos?.length ?? -1;
  let visualScore = 0;
  if (photosCount === -1) visualScore = SCORING_WEIGHTS.GARGALO_VISUAL.PHOTO_COUNT.MISSING;
  else if (photosCount < 5) visualScore = SCORING_WEIGHTS.GARGALO_VISUAL.PHOTO_COUNT.CRITICAL.score;
  else if (photosCount < 10) visualScore = SCORING_WEIGHTS.GARGALO_VISUAL.PHOTO_COUNT.LOW.score;
  else if (photosCount < 20) visualScore = SCORING_WEIGHTS.GARGALO_VISUAL.PHOTO_COUNT.MEDIUM.score;
  else visualScore = SCORING_WEIGHTS.GARGALO_VISUAL.PHOTO_COUNT.HIGH.score;

  score += visualScore;
  if (photosCount < 10) {
    signals.push({ 
      text: photosCount === -1 ? "Sem fotos publicadas — gargalo visual crítico" : `Apenas ${photosCount} fotos publicadas — gargalo visual claro`, 
      type: 'visual', 
      value: visualScore 
    });
  }

  // 3. PRESENÇA DIGITAL (Max 25)
  const hasWebsite = !!place.websiteUri;
  const digitalScore = hasWebsite ? SCORING_WEIGHTS.PRESENCA_DIGITAL.WEBSITE.PRESENT : SCORING_WEIGHTS.PRESENCA_DIGITAL.WEBSITE.MISSING;
  score += digitalScore;
  if (!hasWebsite) {
    signals.push({ text: "Sem site próprio — depende 100% da plataforma", type: 'digital', value: digitalScore });
  }

  // 4. ATIVIDADE (Max 15)
  const lastReview = place.reviews?.[0]?.publishTime;
  let atividadeScore = 0;
  if (!lastReview) {
    atividadeScore = SCORING_WEIGHTS.ATIVIDADE.LAST_REVIEW.MISSING;
  } else {
    const days = (Date.now() - new Date(lastReview).getTime()) / (1000 * 60 * 60 * 24);
    if (days > 90) atividadeScore = SCORING_WEIGHTS.ATIVIDADE.LAST_REVIEW.OLD.score;
    else if (days > 30) atividadeScore = SCORING_WEIGHTS.ATIVIDADE.LAST_REVIEW.MEDIUM.score;
    else atividadeScore = SCORING_WEIGHTS.ATIVIDADE.LAST_REVIEW.RECENT.score;
    
    if (days > 30) {
      signals.push({ 
        text: `Sem avaliações há ${Math.floor(days/30)} meses — ocupação possivelmente caindo`, 
        type: 'atividade', 
        value: atividadeScore 
      });
    }
  }
  score += atividadeScore;

  // Ordenar sinais por importância (valor do score que geraram)
  signals.sort((a, b) => b.value - a.value);
  const topSignals = signals.slice(0, 2);

  // Ângulo de abordagem
  let angulo = "Ângulo: qualidade visual";
  const mainSignal = signals[0]?.type;
  if (mainSignal === 'digital') angulo = "Ângulo: independência de plataforma";
  if (mainSignal === 'atividade') angulo = "Ângulo: recuperar ocupação";
  if (mainSignal === 'demanda' && score < 70) angulo = "Ângulo: profissionalização";

  return {
    total: Math.min(100, score),
    signals: topSignals.map(s => s.text),
    angulo,
    faixa: score >= 80 ? 'ALTA' : score >= 60 ? 'MEDIA' : 'BAIXA'
  };
}
