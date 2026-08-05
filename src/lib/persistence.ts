import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import type { Database } from "@/integrations/supabase/types";

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

export const saveProjectStep = async (step: number, data: any) => {
  const sessionId = getSessionId();
  const projectId = getCurrentProjectId();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  let currentProjectId = projectId;

  try {
    // Step 1: Create or update project
    if (step === 1 && data.escolhido) {
      const projectData: any = {
        user_id: user?.id || null,
        session_id: sessionId,
        modalidade: data.modalidade,
        current_step: step,
        updated_at: new Date().toISOString(),
      };

      if (currentProjectId) projectData.id = currentProjectId;

      const { data: project, error } = await supabase
        .from("projects")
        .upsert(projectData)
        .select()
        .single();

      if (error) throw error;
      currentProjectId = project.id;
      setCurrentProjectId(currentProjectId);

      // Save property
      await supabase.from("properties").upsert({
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
      // Update step
      await supabase.from("projects").update({ 
        current_step: step,
        updated_at: new Date().toISOString()
      }).eq("id", currentProjectId);

      if (step === 3) {
        // Save briefing
        await supabase.from("briefings").upsert({
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

export const loadProject = async (id: string) => {
  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      properties (*),
      briefings (*),
      deliverables (*)
    `)
    .eq("id", id)
    .single();

  if (error) return null;
  return project;
};

export const listProjects = async () => {
  const sessionId = getSessionId();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  let query = supabase.from("projects").select(`
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
  const { error } = await supabase
    .from("projects")
    .update({ user_id: userId } as any)
    .eq("session_id", sessionId)
    .is("user_id", null);
  
  if (error) console.error("Error syncing projects:", error);
};
