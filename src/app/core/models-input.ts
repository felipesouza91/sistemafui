export interface IClientInput {
  codigoService: number;
  codigoParticao: number;
  razaoSocial: string;
  fantazia: string;
  telefone1: string;
  telefone2: string;
  dominio: string;
  endereco: AddressInput;
  grupo: IdInput;
  ativo: boolean;
}

export interface IServiceOrderInput {
  cliente: IdInput;
  codigoService: number;
  codigoSigma: number;
  descricao: string;
  dvr: IdInput;
  motivoOs: IdInput;
  prioridadeOs: string;
  solicitante: string;
}

export interface IAccessGroupInput {
  ativo: boolean;
  descricao: string;
  permissoes: IdInput[];
}

export interface IProductInput {
  modelo: string;
  descricao: string;
  valorUnitario: number;
  fabricante: IdInput;
}

export interface IManufactureInput {
  descricao: string;
}

export interface IServiceOrderReason {
  descricao: string;
}

export interface IGroupInput {
  nome: string;
}

export interface IUserInput {
  apelido: string;
  ativo: boolean;
  grupoAcesso: IdInput;
  nome: string;
  senha: string;
}

export interface INeighborhoodInput {
  nome: string;
  cidade: IdInput;
}

export interface ICityInput {
  nome: string;
}

export interface AddressInput {
  rua: string;
  numero: number;
  complemento: string;
  referencia: string;
  bairro: IdInput;
}

export interface IRecordingCheckInput {
  dvr: IdInput;
  hd: string;
  qtdGravacao: number;
  status: string;
}

interface IdInput {
  id: number;
}
