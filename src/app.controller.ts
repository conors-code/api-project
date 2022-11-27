import { Controller, Get, Param, Post, Query, Body } from "@nestjs/common";
import { AppService } from "./app.service";

export class claimTokensDto {
  address: string;
}

@Controller()
export class AppController {
  constructor (private readonly appService: AppService) {}

  @Get('token-address')
  getTokenAddress() {
    return this.appService.getTokenAddress();
  } 

  @Post('claim-tokens')
  claimTokens(@Body() body : claimTokensDto) {
    return this.appService.claimTokens(body.address);
  }
}