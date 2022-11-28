import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, Wallet } from 'ethers';
import { AlchemyProvider, InfuraProvider } from "@ethersproject/providers";
//import tokenJson from './assets/MyToken.json';
import * as tokenJson from './assets/MyToken.json';

@Injectable()
export class AppService {

  provider: ethers.providers.Provider;
  tokenVoteContractAddr : string;
  signerWallet: Wallet;

  constructor(private configService : ConfigService) {
    const alchemyApiKey = this.configService.get<string>("ALCHEMY_API_KEY");
    const walletPrivateKey = this.configService.get<string>("PRIVATE_KEY");
    this.tokenVoteContractAddr = this.configService.get<string>("TOKENISED_VOTE_CONTRACT_ADDR");
    this.provider = new AlchemyProvider("goerli", alchemyApiKey);
    this.signerWallet = new Wallet(walletPrivateKey);
    //this.provider = ethers.getDefaultProvider("goerli");
  }

  async claimTokens(mintToWalletAddress: string) {
    //TODO: build the contract object
    //TODO: pikc the signer using the dotenv keys
    //TODO connect the contract object to the signer
    //TODO make the transaction to mint tokens
    //TODO await the transaction, get the receipt, return the hash.
    const walletAddress = this.signerWallet.address;
    const signer = this.signerWallet.connect(this.provider);
    const voteTokenContract = new ethers.Contract(
      this.tokenVoteContractAddr, tokenJson.abi, signer);
    const signedVoteTokenContract = voteTokenContract.connect(signer);
    console.log(`minting using contract address ${signedVoteTokenContract.address}.`);
    const mintTx = await signedVoteTokenContract.mint(mintToWalletAddress,
      ethers.utils.parseEther("10") //TODO: replace this with a correct value
    );
    console.log(`mint Tx .hash is ${mintTx.hash}`);
    const mintTxReceipt = await mintTx.wait();
    console.log(`mintTxReceipt is ${mintTxReceipt.transactionHash} after awaiting mint Tx ${mintTx.hash}`);
    console.log(`${mintTxReceipt.transactionHash} is tx hash for tokens minted for ${mintToWalletAddress}`);
    return {result : mintTxReceipt.transactionHash};
  }

  getTokenAddress() {
    return {result: this.tokenVoteContractAddr};
  } 
}