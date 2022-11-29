import { Controller, Get, Param, Post, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';

export class claimTokensDto {
  address: string;
}
export class connectBallotDto {
  address: string;
}
export class delegateVoteDto {
  address: string;
}

export class castVoteDto {
  proposalNumber: number;
  voteAmount: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token-address')
  getTokenAddress() {
    return this.appService.getTokenAddress();
  }

  @Post('claim-tokens')
  claimTokens(@Body() body: claimTokensDto) {
    return this.appService.claimTokens(body.address);
  }
  @Post('connect-ballot')
  connectBallot(@Body() body: connectBallotDto) {
    return this.appService.connectBallot(body.address);
  }

  @Post('delegate-vote')
  delegateVote(@Body() body: delegateVoteDto) {
    return this.appService.delegateVote(body.address);
  }

  @Post('cast-vote')
  castVote(@Body() body: castVoteDto) {
    return this.appService.castVote(body.proposalNumber, body.voteAmount);
  }
}
