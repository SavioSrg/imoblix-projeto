import { CERTIDOES, CERTIDOES_INFO, type Certidao } from "@/data/certidoes";

export interface CertidoesService {
  list(): Promise<Certidao[]>;
  info(): Promise<typeof CERTIDOES_INFO>;
}

export const certidoesService: CertidoesService = {
  async list() {
    // Simula latência
    await new Promise((r) => setTimeout(r, 200));
    return CERTIDOES;
  },
  async info() {
    return CERTIDOES_INFO;
  },
};
