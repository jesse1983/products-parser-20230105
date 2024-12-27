import { Controller, Get } from "@nestjs/common";
import { HealthyService } from "./healthy.service";

@Controller("")
export class HealthyController {
  constructor(private readonly healthService: HealthyService) {}

  @Get()
  async healthy() {
    return this.healthService.health();
  }
}
