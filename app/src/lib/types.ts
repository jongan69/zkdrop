export interface NFTAttributes {
    traitTypeOne: string;
    valueOne: string;
    traitTypeTwo: string;
    valueTwo: string;
  }
  
export interface NFTData {
    name: string;
    description: string;
    symbol: string;
    image: string;
    link: string;
    traitTypeOne?: string;
    valueOne?: string | number;
    traitTypeTwo?: string;
    valueTwo?: string | number;
  }
  
export interface ErrorResponse {
    message: string;
    response?: {
      data: unknown;
    };
  }