export class Resultado<T> {
  /**
   * interfacee de retorno para consultas paginadas
   * @param total
   * @param conteudo - Array do conteudo do retorno
   * @param firstPage - Boolen to result is first page
   */
  total: number;
  firstPage: boolean;
  conteudo: Array<T>;
  constructor(total: number, firstPage: boolean, conteudo: Array<T>) {
    this.total = total;
    this.conteudo = conteudo;
    this.firstPage = firstPage;
  }
}

export interface MotivoOs {
  id: number;
  descricao: string;
}

export interface Grupo {
  id: number;
  nome: string;
}

export interface Cidade {
  id: number;
  nome: string;
}

export interface Fabricante {
  id: number;
  descricao: string;
}

export interface Produto {
  id: number;
  modelo: string;
  descricao: string;
  valorUnitario: number;
  fabricante: Fabricante;
}

export interface Bairro {
  id: number;
  nome: string;
  cidade: Cidade;
}

export interface Endereco {
  rua: string;
  numero: number;
  complemento: string;
  referencia: string;
  bairro: Bairro;
}

export interface Cliente {
  id: number;
  codigoService: number;
  codigoParticao: number;
  razaoSocial: string;
  fantazia: string;
  telefone1: string;
  telefone2: string;
  dominio: string;
  endereco: Endereco;
  grupo: Grupo;
  ativo: boolean;
}

export interface Dvr {
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

  cliente: Cliente;
}

export interface OrdemServico {
  id: number;
  codigoService: number;
  codigoSigma: number;
  motivoOs: MotivoOs;
  descricao: string;
  prioridadeOs: string;
  solicitante: string;
  cliente: Cliente;
  dvr: Dvr;
  dataAbertura: Date;
  fechamento: FechamentoOs;
}

export interface FechamentoOs {
  id: number;
  motivoFechamento: string;
  dataFechamento: Date;
  dataVisita: Date;
  tecnico: string;
  observcaoServico: string;
  os: OrdemServico;
}

export interface VerificacaoGravacao {
  id: number;
  status: string;
  hd: string;
  qtdGravacao: number;
  dataTeste: Date;
  dvr: Dvr;
  usuario: string;
}

export interface Permissao {
  id: number;
  descricao: string;
}

export interface GrupoAcesso {
  id: number;
  ativo: boolean;
  descricao: string;
  permissoes: Array<Permissao>;
}

export interface PermissionFormattedDto {
  nameId: string;
  formattedName: string;
  read: boolean;
  write: boolean;
  remove: boolean;
}

export interface AccessGroupDto {
  id: number;
  ativo: boolean;
  descricao: string;
  permissions: IPermissionAvailableDto[];
}

export interface Usuario {
  id: number;
  ativo: boolean;
  nome: string;
  apelido: string;
  senha: string;
  grupoAcesso: GrupoAcesso;
}

export interface Atendimento {
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

export interface ResumoVerificacaoGravacao {
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

export interface Informacao {
  id: number;
  descricao: string;
  createdBy: Usuario;
  creationDate: Date;
  lastModifiedBy: number;
  lastModifiedDate: Date;
}

export interface ClienteInformacao extends Informacao {
  cliente: Cliente;
}

export interface IPermissionAvailableDto {
  nameId: string;
  formattedName: string;
  read: boolean;
  write: boolean;
  remove: boolean;
}
