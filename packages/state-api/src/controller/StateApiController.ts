import { Router, Request, Response } from 'express';
import { StateApiService } from '../service/StateApiService';
import { AuthCodeRequest } from '../model/AuthCodeRequest';

export class StateApiController {
  public router: Router;

  constructor(private readonly stateApiService: StateApiService) {
    this.router = Router();
    this.routes();
  }

  public routes() {
    this.router.post('/authorization-code', this.createAuthorizationCode);
    this.router.get('/export-return', this.exportReturn);
    this.router.get('/state-profile', this.getStateProfile);
  }

  private createAuthorizationCode = async (req: Request, res: Response) => {
    try {
      const authCodeRequest: AuthCodeRequest = req.body;
      const authCode = await this.stateApiService.createAuthorizationCode(authCodeRequest);
      res.status(201).send({ authCode });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      } else {
        res.status(500).send({ error: 'An unknown error occurred' });
      }
    }
  };

  private exportReturn = async (req: Request, res: Response) => {
    // TODO: Implement this
    res.status(501).send({ message: 'Not implemented' });
  };

  private getStateProfile = async (req: Request, res: Response) => {
    try {
      const stateCode = req.query.stateCode as string;
      if (!stateCode) {
        return res.status(400).send({ error: 'stateCode is required' });
      }
      const stateProfile = await this.stateApiService.getStateProfile(stateCode);
      res.status(200).send(stateProfile);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      } else {
        res.status(500).send({ error: 'An unknown error occurred' });
      }
    }
  };
}
