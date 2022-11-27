import * as dotenv from "dotenv";
dotenv.config();
import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { AlchemyProvider, InfuraProvider } from "@ethersproject/providers";
//import tokenJson from './assets/MyToken.json';
import * as tokenJson from './assets/MyToken.json';


const TOKENISED_VOTE_CONTRACT_ADDR = "0x4659Af90cF5076c1Dbe135775A8572db8A1f8E55";

@Injectable()
export class AppService {

  provider: ethers.providers.Provider;

  constructor(private configService : ConfigService) {
    //const alchemyApiKey = this.configService.get<string>("ALCHEMY_API_KEY");
    //const provider = new AlchemyProvider("goerli", alchemyApiKey);
    this.provider = ethers.getDefaultProvider("goerli");
  }

  async claimTokens(address: string) {
    //TODO: build the contract object
    //TODO: pikc the signer using the dotenv keys
    //TODO connect the contract object to the signer
    //TODO make the transaction to mint tokens
    //TODO await the transaction, get the receipt, return the hash.
    return {result : `tx hash for tokens minted for ${address}`};
  }
  getTokenAddress() {
    return {result: process.env.TOKENISED_VOTE_CONTRACT_ADDR};
  } 
}