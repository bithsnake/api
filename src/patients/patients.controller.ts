import { Controller } from '@nestjs/common';
import { Patient } from '@prisma/client';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { UpdatePatientDto } from './dto/update-patient-dto';
import { BaseController } from '../class-library';

@Controller('patients')
export class PatientsController extends BaseController<
  Patient,
  CreatePatientDto,
  UpdatePatientDto,
  PatientsService
> {
  constructor(private readonly patientsService: PatientsService) {
    super(patientsService);
  }
}
