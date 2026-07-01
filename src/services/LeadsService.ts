export interface LeadPayload {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  origem: "premium" | "contato";
}

export interface LeadsService {
  create(payload: LeadPayload): Promise<{ id: string }>;
}

export const leadsService: LeadsService = {
  async create(payload) {
    await new Promise((r) => setTimeout(r, 600));
    // Persistência mock no sessionStorage p/ o MVP
    try {
      const key = "imoblix.leads.v1";
      const list = JSON.parse(sessionStorage.getItem(key) ?? "[]");
      const id = `lead_${Date.now()}`;
      list.push({ id, ...payload, createdAt: new Date().toISOString() });
      sessionStorage.setItem(key, JSON.stringify(list));
      return { id };
    } catch {
      return { id: `lead_${Date.now()}` };
    }
  },
};
