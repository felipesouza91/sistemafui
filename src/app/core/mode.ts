export class Resultado<T> {
  /**
   * Classe de retorno para consultas paginadas
   * @param total
   * @param conteudo - Array do conteudo do retorno
   * @param firstPage - Boolen to result is first page
   */
  total: number;
  firstPage: boolean;
  conteudo = new Array<T>();
  constructor(total: number, firstPage: boolean, conteudo: Array<T>) {
    this.total = total;
    this.conteudo = conteudo;
    this.firstPage = firstPage;
  }
}

export class MotivoOs {
  id: number;
  descricao: string;
}

export class Grupo {
  id: number;
  nome: string;
}

export class Cidade {
  id: number;
  nome: string;
}

export class Fabricante {
  id: number;
  descricao: string;
}

export class Produto {
  id: number;
  modelo: string;
  descricao: string;
  valorUnitario: number;
  fabricante: Fabricante;
}

export class Bairro {
  id: number;
  nome: string;
  cidade = new Cidade();
}

export class Endereco {
  rua: string;
  numero: number;
  complemento: string;
  referencia: string;
  bairro = new Bairro();
}

export class Cliente {
  id: number;
  codigoService: number;
  codigoParticao: number;
  razaoSocial: string;
  fantazia: string;
  telefone1: string;
  telefone2: string;
  dominio: string;
  endereco = new Endereco();
  grupo = new Grupo();
  ativo: boolean;
}

export class Dvr {
  id: number;
  habilitaVerificao: boolean;
  somenteCloud: boolean;
  portaHttp: number;
  portaServico: number;
  fabricante: string;
  modeloDvr: string;
  ip: string;
  mascara: string;
  gateway: string;
  dnsPrincipal: string;
  dnsAlternativo: string;
  numeroSerie: string;
  ultimoStatus: boolean;

  cliente = new Cliente();
}

export class OrdemServico {
  id: number;
  codigoService: number;
  codigoSigma: number;
  motivoOs = new MotivoOs();
  descricao: string;
  prioridadeOs: string;
  solicitante: string;
  cliente = new Cliente();
  dvr = new Dvr();
  dataAbertura: Date;
  fechamento = new FechamentoOs();
}

export class FechamentoOs {
  id: number;
  motivoFechamento: string;
  dataFechamento: Date;
  dataVisita: Date;
  tecnico: string;
  observcaoServico: string;
  os: OrdemServico;
}

export class VerificacaoGravacao {
  id: number;
  status: string;
  hd: string;
  qtdGravacao: number;
  dataTeste: Date;
  dvr = new Dvr();
  usuario: string;
}

export class Permissao {
  id: number;
  descricao: string;
}

export class GrupoAcesso {
  id: number;
  ativo: boolean;
  descricao: string;
  permissoes = new Array<Permissao>();
}

export class Usuario {
  id: number;
  ativo: boolean;
  nome: string;
  apelido: string;
  senha: string;
  grupoAcesso = new GrupoAcesso();
}

export class Atendimento {
  id: number;
  descricaoProblema: string;
  descricaoSolucao: string;
  solicitante: string;
  cliente: Cliente;
  dataInicio: Date;
  dataTermino: Date;
  usuarioInicio: Usuario;
  usuarioTermino: Usuario;
}

export class ResumoVerificacaoGravacao {
  id: number;
  status: string;
  hd: string;
  qtdGravacao: number;
  dataTeste: Date;
  idDvr: number;
  fabricante: string;
  modeloDVr: string;
  nomeUsuario: string;
  idCliente: number;
  nomeFantazia: string;
}

export class Informacao {
  id: number;
  descricao: string;
  createdBy: Usuario;
  creationDate: Date;
  lastModifiedBy: number;
  lastModifiedDate: Date;
}

export class ClienteInformacao extends Informacao {
  cliente: Cliente;
}
