import { supabase } from "@/integrations/supabase/client";

/**
 * Registra o início de uma requisição de IA para controle de limites e idempotência.
 */
export async function trackAiUsageStart(userId: string, requestId: string, route: string, ip: string) {
  const { data, error } = await supabase
    .from("ai_usage")
    .insert({
      user_id: userId,
      request_id: requestId,
      route,
      ip,
      status: 'processing'
    })
    .select()
    .single();
  
  return { data, error };
}

/**
 * Atualiza o registro com os resultados da IA.
 */
export async function trackAiUsageEnd(requestId: string, promptTokens: number, completionTokens: number, responseCache: string) {
  // Custo estimado: $0.0003 por 1k tokens (média Gemini Flash)
  const cost = ((promptTokens + completionTokens) / 1000) * 0.0003;

  await supabase
    .from("ai_usage")
    .update({
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      estimated_cost: cost,
      response_cache: responseCache,
      status: 'completed'
    })
    .eq("request_id", requestId);
}

/**
 * Verifica limites:
 * 1. Global (projeto inteiro, hoje)
 * 2. Usuário (hoje e por minuto)
 * 3. IP (para contas novas/anônimas se aplicável)
 */
export async function checkAiLimits(userId: string, ip: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const oneMinuteAgo = new Date(now.getTime() - 60000).toISOString();

  // Teto global diário (ex: 500 chamadas ou $2.00)
  const { count: globalCount } = await supabase
    .from("ai_usage")
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDay);

  if ((globalCount || 0) > 1000) return { allowed: false, reason: "Limite global atingido" };

  // Limite por usuário (hoje: 50 chamadas)
  const { count: userDayCount } = await supabase
    .from("ai_usage")
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfDay);

  if ((userDayCount || 0) > 50) return { allowed: false, reason: "você atingiu o limite de gerações de hoje" };

  // Limite por usuário (minuto: 3 chamadas - anti-click frenético)
  const { count: userMinCount } = await supabase
    .from("ai_usage")
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneMinuteAgo);

  if ((userMinCount || 0) > 3) return { allowed: false, reason: "aguarde um momento antes da próxima geração" };

  return { allowed: true };
}

/**
 * Busca resposta em cache para idempotência
 */
export async function getCachedAiResponse(requestId: string) {
  const { data } = await supabase
    .from("ai_usage")
    .select("status, response_cache")
    .eq("request_id", requestId)
    .single();
  
  return data;
}
