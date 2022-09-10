export interface ResumoAtendimento {
  id: number;
  descricao: string;
  solicitante: string;
  idCliente: number;
  fantazia: string;
  dataInicio: Date;
  dataTermino: Date;
  idUsuarioInicio: number;
  nomeUsuarioInicio: string;
  idUsuarioTermino: number;
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

export interface ResumoGrupoAcesso {
  id: number;
  ativo: boolean;
  descricao: string;
}

export interface ResumOrdemServico {
  id: number;
  codigoService: number;
  motivoOs: string;
  descricao: string;
  prioridadeOs: string;
  solicitante: string;
  codigoCliente: number;
  nomeFantazia: string;
  dataAbertura: Date;
}

export interface UsuarioResumo {
  id: number;
  ativo: boolean;
  nome: string;
  apelido: string;
  idGrupoAcesso: number;
  nomeGrupoAcesso: string;
}
