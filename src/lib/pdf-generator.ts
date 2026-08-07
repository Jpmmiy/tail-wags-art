import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function generateProposalPDF(project: any, profile: any, pricing: any) {
  const doc = new jsPDF();
  const property = project.properties?.[0];
  const businessName = profile?.business_name || (project as any).user_profile?.business_name || "Nexofly Global";
  const userName = profile?.full_name || (project as any).user_profile?.full_name || "Especialista Nexofly";
  const userEmail = profile?.email || (project as any).user_profile?.email || "";
  const date = new Date().toLocaleDateString('pt-BR');
  const projectName = project.name || property?.nome || "Proposta Comercial";


  // --- Header ---
  // Background rectangle for header
  doc.setFillColor(15, 23, 42); // #0F172A (bg-ink)
  doc.rect(0, 0, 210, 40, 'F');

  // Business Name / Logo placeholder
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(businessName.toUpperCase(), 15, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("PROPOSTA DE VALORIZAÇÃO VISUAL", 15, 32);

  // Date and Project Info
  doc.setTextColor(150, 150, 150);
  doc.text(`Data: ${date}`, 155, 25);
  doc.text(`Ref: ${projectName.substring(0, 20)}`, 155, 32);

  // --- Client Info Section ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Destinatário", 15, 55);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Imóvel: ${property?.nome || "Não informado"}`, 15, 62);
  doc.text(`Local: ${property?.endereco || "Não informado"}`, 15, 68);

  // --- Strategy Section ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Estratégia Nexofly", 15, 85);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const strategy = [
    "A análise de mercado indica que a qualidade visual é o fator #1 na decisão de reserva/compra.",
    "Nossa proposta foca em eliminar gargalos visuais e destacar os pontos fortes do seu imóvel",
    "através de materiais de alta conversão otimizados para redes sociais e portais imobiliários."
  ];
  doc.text(strategy, 15, 92);

  // --- Deliverables Table ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Material de Entrega", 15, 115);

  const tableData = (project.deliverables || []).map((d: any) => [
    `${d.tipo.toUpperCase()} ${d.shot_number ? `#${d.shot_number}` : ''}`,
    d.conteudo.substring(0, 100) + (d.conteudo.length > 100 ? "..." : "")
  ]);

  if (tableData.length === 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Consulte os rascunhos gerados na plataforma para detalhes dos entregáveis.", 15, 122);
  } else {
    autoTable(doc, {
      startY: 120,
      head: [['Item', 'Descrição / Direcionamento']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }, // #3B82F6
      styles: { fontSize: 9, cellPadding: 5 }
    });
  }

  // --- Pricing Section ---
  const finalY = (doc as any).lastAutoTable?.finalY || 130;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Investimento", 15, finalY + 20);

  if (pricing) {
    const pricingData = [
      ["Pacote Essencial", `R$ ${pricing.essencial.valor}`, pricing.essencial.inclui.join(", ")],
      ["Pacote Completo", `R$ ${pricing.completo.valor}`, pricing.completo.inclui.join(", ")],
      ["Plano Premium", `R$ ${pricing.premium.valor}`, pricing.premium.inclui.join(", ")]
    ];

    autoTable(doc, {
      startY: finalY + 25,
      head: [['Plano', 'Valor', 'O que inclui']],
      body: pricingData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9 }
    });
  }

  // --- Footer / Contact ---
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, pageHeight - 40, 210, 40, 'F');
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Contato Comercial", 15, pageHeight - 25);
  
  doc.setFont("helvetica", "normal");
  doc.text(`${userName}`, 15, pageHeight - 18);
  doc.text(`${userEmail}`, 15, pageHeight - 13);
  
  doc.setFontSize(8);
  doc.text("Gerado por Nexofly IA - O Cérebro Operacional do Corretor Moderno", 155, pageHeight - 13, { align: "right" });

  // --- Save / Download ---
  const fileName = `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
