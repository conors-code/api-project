import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, Wallet } from 'ethers';
import { AlchemyProvider, InfuraProvider } from '@ethersproject/providers';
//import tokenJson from './assets/MyToken.json';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/Ballot.json';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  tokenVoteContractAddr: string;
  ballotConnected: boolean;
  signerWallet: Wallet;
  signedBallotContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    const alchemyApiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    const walletPrivateKey = this.configService.get<string>('PRIVATE_KEY');
    this.tokenVoteContractAddr = this.configService.get<string>(
      'TOKENISED_VOTE_CONTRACT_ADDR',
    );
    this.provider = new AlchemyProvider('goerli', alchemyApiKey);
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
      this.tokenVoteContractAddr,
      tokenJson.abi,
      signer,
    );
    const signedVoteTokenContract = voteTokenContract.connect(signer);
    console.log(
      `minting using contract address ${signedVoteTokenContract.address}.`,
    );
    const mintTx = await signedVoteTokenContract.mint(
      mintToWalletAddress,
      ethers.utils.parseEther('500'),
    );
    console.log(`mint Tx .hash is ${mintTx.hash}`);
    const mintTxReceipt = await mintTx.wait();
    console.log(
      `mintTxReceipt is ${mintTxReceipt.transactionHash} after awaiting mint Tx ${mintTx.hash}`,
    );
    console.log(
      `${mintTxReceipt.transactionHash} is tx hash for tokens minted for ${mintToWalletAddress}`,
    );
    return { result: mintTxReceipt.transactionHash };
  }

  getTokenAddress() {
    return { result: this.tokenVoteContractAddr };
  }

  async connectBallot(ballotContractAddress: string) {
    const signer = this.signerWallet.connect(this.provider);

    const ballotContract = new ethers.Contract(
      ballotContractAddress,
      ballotJson.abi,
      signer,
    );

    this.signedBallotContract = ballotContract.connect(signer);
    /*console.log(
      `getting ProposalInfo[] using ballot address ${signedballotContract.address}.`
    );*/
    const proposalInfosTx = await this.signedBallotContract.proposalsInfo();

    console.log(`proposalInfosTx Tx .hash is ${proposalInfosTx.hash}`);
    /*console.log(
      `after awaiting proposalInfo Tx ${proposalInfosTx.hash}`,
    );*/

    console.log('start JSON.stringify(proposalInfosTx)');

    console.log(JSON.stringify(proposalInfosTx));
    console.log('end JSON.stringify(proposalInfosTx)');

    // TODO: Attach to the contract address
    return {
      result: proposalInfosTx,
    };
  }

  async delegateVote(delegatee: string) {
    const signer = this.signerWallet.connect(this.provider);
    const voteTokenContract = new ethers.Contract(
      this.tokenVoteContractAddr,
      tokenJson.abi,
      signer,
    );
    const signedVoteTokenContract = voteTokenContract.connect(signer);

    const delegateTx = await signedVoteTokenContract.delegate(delegatee);

    const delegateReceipt = await delegateTx.wait();

    return {
      result: delegateReceipt.transactionHash,
    };
  }

  async castVote(proposalNumber: number, voteAmount: number) {
    const voteTx = await this.signedBallotContract.vote(
      ethers.BigNumber.from(proposalNumber),
      ethers.utils.parseEther(voteAmount.toString())
    );

    const voteReceipt = await voteTx.wait();

    return {
      result: voteReceipt.transactionHash,
    };
  }
}
