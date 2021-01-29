import { Request, Response } from 'express';
import express from 'express';
import rejectUnauthenticated from '../modules/authentication-middleware';
import pool from '../modules/pool';
import userStrategy from '../strategies/user.strategy';
import { encryptPassword } from '../modules/encryption';
import { promises } from 'dns';

const router: express.Router = express.Router();

router.get('/', rejectUnauthenticated, (req: Request, res: Response): void => {
  res.send(req.body);
});

router.post(
  '/register',
  (req: Request, res: Response, next: express.NextFunction): void => {
    const username: string = <string>req.body.username;
    const password: string = encryptPassword(req.body.password);
    const firstName: string = <string>req.body.first_name;
    const middleName: string = <string>req.body.middle_name;
    const lastName: string = <string>req.body.last_name;
    const email: string = <string>req.body.email;
    const zipCode: number = parseInt(req.body.zip_code);
    let newUserId: number;

    const queryOne: string = `INSERT INTO "user" (username, password,  first_name, middle_name,
      last_name, email, zipCode) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`;
    pool
      .query(queryOne, [
        username,
        password,
        firstName,
        middleName,
        lastName,
        zipCode,
        1,
        email,
      ])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  }
);
//making minor change for merge issue

// router.post(
//   '/login',
//   userStrategy.authenticate('local'),
//   (req: Request, res: Response): void => {
//     res.sendStatus(200);
//   }
// );

// router.post('/logout', (req: Request, res: Response): void => {
//   req.logout();
//   res.sendStatus(200);
// });

export default router;
