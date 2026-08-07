import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "nexofly_session_id";
const PROJECT_KEY = "nexofly_current_project_id";

export const getSessionId = () => {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const getCurrentProjectId = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PROJECT_KEY);
};

export const setCurrentProjectId = (id: string | null) => {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(PROJECT_KEY, id);
  else localStorage.removeItem(PROJECT_KEY);
};

/**
 * Recupera o perfil do usuário atual
 */
export const getUserProfile = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();
    
  if (error) return null;
  return data;
};

/**
 * Recupera o último projeto modificado do usuário logado ou da sessão
 */
export const getLatestProjectId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const sessionId = getSessionId();
  
  let query = supabase.from("projects").select("id").order("updated_at", { ascending: false }).limit(1);
  
  if (session?.user) {
    query = query.eq("user_id", session.user.id);
  } else {
    query = query.eq("session_id", sessionId);
  }
  
  const { data, error } = await query;
  if (error || !data || data.length === 0) return null;
  
  return data[0].id;
};

export const saveProjectStep = async (step: number, data: any, status: 'rascunho' | 'aguardando_resposta' | 'em_producao' | 'concluido' = 'rascunho') => {
  console.log("Saving project step:", step, "Status:", status);
  const sessionId = getSessionId();
  
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // Fonte da verdade: prioriza o ID do banco se estiver logado
  let projectId = null;
  
  if (user) {
    projectId = await getLatestProjectId();
  } else {
    projectId = getCurrentProjectId();
  }

  let currentProjectId = projectId;

  try {
    if (step === 1 && data.escolhido) {
      const projectData: any = {
        user_id: user?.id || null,
        session_id: sessionId,
        modalidade: data.modalidade,
        current_step: step,
        status: status,
        name: data.escolhido.nome || data.manualNome,
        objetivo: data.objetivo || null,
        updated_at: new Date().toISOString(),
      };

      if (currentProjectId) projectData.id = currentProjectId;

      const { data: project, error } = await (supabase
        .from("projects") as any)
        .upsert(projectData)
        .select()
        .single();

      if (error) throw error;
      currentProjectId = project.id;
      setCurrentProjectId(currentProjectId);

      await (supabase.from("properties") as any).upsert({
        project_id: currentProjectId,
        place_id: data.escolhido.id,
        nome: data.escolhido.nome,
        endereco: data.escolhido.endereco,
        lat: data.escolhido.location?.latitude || null,
        lng: data.escolhido.location?.longitude || null,
        rating: data.escolhido.nota,
        user_rating_count: data.escolhido.avaliacoes,
        photos_count: data.escolhido.fotos,
        website_uri: data.escolhido.site,
        opportunity_score: data.escolhido.score?.total,
        opportunity_band: data.escolhido.score?.faixa,
        signals: data.escolhido.score?.signals,
        angulo_abordagem: data.escolhido.score?.angulo,
      });

    } else if (currentProjectId) {
      const { error: updateError } = await (supabase.from("projects") as any).update({ 
        current_step: step,
        status: status,
        name: data.name || data.manualNome,
        objetivo: data.objetivo || null,
        updated_at: new Date().toISOString()
      }).eq("id", currentProjectId);

      if (updateError) throw updateError;

      if (step === 2) {
        await (supabase.from("briefings") as any).upsert({
          project_id: currentProjectId,
          publico: data.publico,
          comodos: data.comodos,
          diaria: data.modalidade === 'temporada' ? Number(data.diaria) : Number(data.valorImobiliario),
          estilo_inferido: data.estilo,
          formato_video: data.videoVertical ? '9:16' : '16:9'
        });
      }
    }
  } catch (err) {
    console.error("Error saving step:", err);
  }

  return currentProjectId;
};

export const saveDeliverable = async (projectId: string, shotData: any) => {
  // Busca se já existe o entregável para manter versões
  const { data: existing } = await (supabase.from("deliverables") as any)
    .select("id, conteudo")
    .eq("project_id", projectId)
    .eq("shot_number", shotData.shot_number)
    .eq("tipo", shotData.tipo)
    .maybeSingle();

  const deliverableData: any = {
    project_id: projectId,
    shot_number: shotData.shot_number,
    conteudo: shotData.conteudo,
    tipo: shotData.tipo,
    modo: shotData.modo,
    creditos: shotData.creditos,
    gerado: shotData.gerado,
  };

  let deliverableId;

  if (existing) {
    deliverableId = existing.id;
    // Se o conteúdo mudou, salva uma versão antes de atualizar
    if (existing.conteudo !== shotData.conteudo) {
      await (supabase.from("deliverable_versions" as any) as any).insert({
        deliverable_id: existing.id,
        conteudo: existing.conteudo,
      });
    }
    
    const { error } = await (supabase.from("deliverables") as any)
      .update(deliverableData)
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { data, error } = await (supabase.from("deliverables") as any)
      .insert(deliverableData)
      .select("id")
      .single();
    if (error) throw error;
    deliverableId = data.id;
  }

  return deliverableId;
};

export const loadProject = async (id: string) => {
  const { data: project, error } = await (supabase
    .from("projects") as any)
    .select(`
      *,
      properties (*),
      briefings (*),
      deliverables (*)
    `)
    .eq("id", id)
    .single();

  if (error) return null;

  // Carrega o perfil do dono do projeto para a proposta
  if (project.user_id) {
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", project.user_id).single();
    project.user_profile = profile;
  }

  return project;
};

export const listProjects = async () => {
  const sessionId = getSessionId();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  let query = (supabase.from("projects") as any).select(`
    *,
    properties (nome, opportunity_score),
    deliverables (gerado)
  `);

  if (user) {
    query = query.eq("user_id", user.id);
  } else {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query.order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const syncProjectsOnLogin = async (userId: string) => {
  const sessionId = getSessionId();
  
  // 1. Migra projetos anônimos da sessão para o usuário
  const { error } = await (supabase
    .from("projects") as any)
    .update({ user_id: userId })
    .eq("session_id", sessionId)
    .is("user_id", null);
  
  if (error) console.error("Error syncing projects:", error);

  // 2. Tenta recuperar o ID do rascunho mais recente do usuário e salvar no localStorage
  const latestId = await getLatestProjectId();
  if (latestId) {
    setCurrentProjectId(latestId);
  }
};
