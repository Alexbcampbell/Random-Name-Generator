import { Request, Response } from 'express';
import express from 'express';
import rejectUnauthenticated from '../modules/authentication-middleware';
import pool from '../modules/pool';
import userStrategy from '../strategies/user.strategy';
import { encryptPassword } from '../modules/encryption';
import { promises } from 'dns';

const router: express.Router = express.Router();

router.get('/', rejectUnauthenticated, (req: Request, res: Response): void => {
  res.send(req.user);
});

router.post(
  '/register',
  (req: Request, res: Response, next: express.NextFunction): void => {
    const username: string = <string>req.body.username;
    const password: string = encryptPassword(req.body.password);
    const registered_first_name: string = <string>req.body.first_name;
    const registered_middle_name: string = <string>req.body.middle_name;
    const registered_last_name: string = <string>req.body.last_name;
    const firstName: string = <string>req.body.first_name;
    const middleName: string = <string>req.body.middle_name;
    const lastName: string = <string>req.body.last_name;
    const email: string = <string>req.body.email;
    const company: string = <string>req.body.company;
    const jobTitle: string = <string>req.body.job_title;
    const motivationBio: string = <string>req.body.motivation_bio;
    const experienceBio: string = <string>req.body.experience_bio;
    const customSkills: string = <string>req.body.custom_entry_skills;
    const skills: Array<number> = req.body.skills;
    const timeSlot: Array<number> = req.body.time_slot;
    const educationLevel: number = req.body.education_level;
    const ethnicity: number = req.body.ethnicity;
    const backgroundCheck: boolean = req.body.background_check_permission;
    const gender: number = parseInt(req.body.gender);
    const zipCode: number = parseInt(req.body.zip_code);
    let newUserId: number;

    const queryOne: string = `INSERT INTO "user" (username, password,  first_name, middle_name,
      last_name, ethnicity, company, job_title, motivation_bio, experience_bio, custom_entry_skills,
      background_check_permission, gender, zip_code, access_level,
      email, registered_first_name, registered_middle_name, registered_last_name, volunteer_role, highest_education_level) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,$21) RETURNING id;`;
    pool
      .query(queryOne, [
        username,
        password,
        firstName,
        middleName,
        lastName,
        ethnicity,
        company,
        jobTitle,
        motivationBio,
        experienceBio,
        customSkills,
        backgroundCheck,
        gender,
        zipCode,
        1,
        email,
        registered_first_name,
        registered_middle_name,
        registered_last_name,
        1,
        educationLevel,
      ])
      .then((result) => {
        newUserId = parseInt(result.rows[0].id);
        let userPromises: Array<Promise<any>> = [];
        for (let index = 0; index < skills.length; index++) {
          let element: number = skills[index];
          let query: string = `INSERT INTO "user_skills" (user_id, skills_id) VALUES ($1, $2)`;
          userPromises.push(pool.query(query, [newUserId, element]));
        }
        for (let index = 0; index < timeSlot.length; index++) {
          let element: number = timeSlot[index];
          let query: string = `INSERT INTO "user_time_slot" (user_id, time_slot_id) VALUES ($1, $2)`;
          userPromises.push(pool.query(query, [newUserId, element]));
        }
        Promise.all(userPromises)
          .then(() => {
            res.sendStatus(200);
          })
          .catch(() => {
            res.sendStatus(500);
          });
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  }
);
//making minor change for merge issue

router.put(
  '/update',
  (req: any, res: Response, next: express.NextFunction): void => {
    //TODO GET THE IMAGE LINK!
    // const image: string = <string>req.body.image_link;
    console.log(req.body);
    const first_name: string = <string>req.body.first_name;
    const last_name: string = <string>req.body.last_name;
    const skills: Array<number> = req.body.skills;
    const phone_number: string = <string>req.body.phone_number;
    const email: string = <string>req.body.email;
    const zipCode: number = parseInt(req.body.zip_code);
    const userId: number = req.user.id;

    const queryOne: string = `UPDATE "user" SET first_name = $1, last_name = $2, zip_code = $3, phone_number = $4, email = $5 WHERE id = $6;`;
    const queryArray: [string, string, number, string, string, number] = [
      first_name,
      last_name,
      zipCode,
      phone_number,
      email,
      userId,
    ];
    pool
      .query(queryOne, queryArray)
      .then((result) => {
        let userPromises: Array<Promise<any>> = [];
        for (let index = 0; index < skills.length; index++) {
          let element: number = skills[index];
          let query: string = `INSERT INTO "user_skills" (user_id, skills_id) VALUES ($1, $2)`;
          userPromises.push(pool.query(query, [userId, element]));
        }
        // for (let index = 0; index < timeSlot.length; index++) {
        //   let element: number = timeSlot[index];
        //   let query: string = `INSERT INTO "user_time_slot" (user_id, time_slot_id) VALUES ($1, $2)`;
        //   userPromises.push(pool.query(query, [userId, element]));
        // }
        // for (let index = 0; index < educationLevel.length; index++) {
        //   let element: number = educationLevel[index];
        //   let query: string = `INSERT INTO "user_education_level" (user_id, education_level) VALUES ($1, $2)`;
        //   userPromises.push(pool.query(query, [userId, element]));
        // }
        Promise.all(userPromises)
          .then(() => {
            res.sendStatus(200);
          })
          .catch(() => {
            res.sendStatus(500);
          });
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  }
);

router.post(
  '/login',
  userStrategy.authenticate('local'),
  (req: Request, res: Response): void => {
    res.sendStatus(200);
  }
);

router.post('/logout', (req: Request, res: Response): void => {
  req.logout();
  res.sendStatus(200);
});

router.get(
  '/newUserDetail/:id',
  (req: Request, res: Response, next: express.NextFunction): void => {
    // GET route to get all volunteers/mentors information
    const queryText: string = `SELECT gender_label,first_name, middle_name, last_name, birth_date,posting_date,
    zip_code,phone_number,company,job_title,motivation_bio,experience_bio,
    custom_entry_skills,access_label, education_label,
    ARRAY(SELECT skills_label FROM "user" 
		JOIN "user_skills" ON "user".id = "user_skills".user_id
		JOIN "skills" on "user_skills".skills_id = "skills".id
		WHERE "user".id = $1) AS "skills_label_array",
    ARRAY(SELECT time_slot_label FROM "user"
		JOIN "user_time_slot" ON "user".id = "user_time_slot".user_id
		JOIN time_slot ON "user_time_slot".time_slot_id = time_slot.id
		WHERE "user".id = $1) AS "time_slot_label_array",
    ARRAY(SELECT link_url FROM "user"
		JOIN "user_images" ON "user".id = "user_images".user_id 
    JOIN "images" ON "user_images".image_id = "images".id
    WHERE "user".id = $1) AS "image_link_array"FROM "user" 
    JOIN "education_level" ON "user".highest_education_level = "education_level".id
    JOIN "gender" ON "user".gender = "gender".id
    JOIN "access_level" ON "user".access_level = "access_level".id
    WHERE "user".id = $1;
`;

    pool
      .query(queryText, [req.params.id])
      .then((dbResponse) => {
        res.send(dbResponse.rows);
      })
      .catch((err) => {
        console.log('error getting user detail data', err);
        res.sendStatus(500);
      });
  }
);

router.get(
  '/verifiedUserDetail/:id',
  (req: Request, res: Response, next: express.NextFunction): void => {
    // GET route to get all volunteers/mentors information
    const queryText: string = `SELECT 
    gender_label,first_name, middle_name, last_name, birth_date,posting_date,
    zip_code,phone_number,company,job_title,motivation_bio,experience_bio,
    custom_entry_skills, access_label, role_label, access_label, education_label,
    ARRAY(SELECT skills_label FROM "user" 
		JOIN "user_skills" ON "user".id = "user_skills".user_id
		JOIN "skills" on "user_skills".skills_id = "skills".id
		WHERE "user".id = $1) AS "skills_label_array",
	ARRAY(SELECT note_on_subject FROM "user"
		JOIN "admin_note" ON "user".id = "admin_note".user_id_subject
		WHERE "user".id = $1) AS "admin_note_array",
    ARRAY(SELECT time_slot_label FROM "user"
		JOIN "user_time_slot" ON "user".id = "user_time_slot".user_id
		JOIN time_slot ON "user_time_slot".time_slot_id = time_slot.id
		WHERE "user".id = $1) AS "time_slot_label_array",
    ARRAY(SELECT link_url FROM "user"
		JOIN "user_images" ON "user".id = "user_images".user_id 
    JOIN "images" ON "user_images".image_id = "images".id
		WHERE "user".id = $1) AS "image_link_array"FROM "user" 
	JOIN "access_level" ON "user".access_level = "access_level".id
  JOIN "volunteer_role" ON "user".volunteer_role = "volunteer_role".id
  JOIN "education_level" ON "user".highest_education_level = "education_level".id
    JOIN "ethnicity" ON "user".ethnicity = "ethnicity".id 
    JOIN "gender" ON "user".gender = "gender".id
    WHERE "user".id = $1;
`;

    pool
      .query(queryText, [req.params.id])
      .then((dbResponse) => {
        res.send(dbResponse.rows);
      })
      .catch((err) => {
        console.log('error getting user detail data', err);
        res.sendStatus(500);
      });
  }
);

router.get(
  '/verifiedUserDetailAll',
  (req: Request, res: Response, next: express.NextFunction): void => {
    // GET route to get all volunteers/mentors information
    const queryText: string = `SELECT 
    gender_label,first_name, middle_name, last_name, birth_date,posting_date,
    zip_code,phone_number,company,job_title,motivation_bio,experience_bio, ethnicity_label,education_label,
    custom_entry_skills, access_label, role_label, access_label, education_label,email,volunteer_role,
    ARRAY(SELECT skills_label FROM "user" 
		JOIN "user_skills" ON "user".id = "user_skills".user_id
		JOIN "skills" on "user_skills".skills_id = "skills".id) AS "skills_label_array",
	ARRAY(SELECT note_on_subject FROM "user"
		JOIN "admin_note" ON "user".id = "admin_note".user_id_subject) AS "admin_note_array",
    ARRAY(SELECT time_slot_label FROM "user"
		JOIN "user_time_slot" ON "user".id = "user_time_slot".user_id
		JOIN time_slot ON "user_time_slot".time_slot_id = time_slot.id) AS "time_slot_label_array",
    ARRAY(SELECT link_url FROM "user"
		JOIN "user_images" ON "user".id = "user_images".user_id 
    JOIN "images" ON "user_images".image_id = "images".id) AS "image_link_array"FROM "user" 
	JOIN "access_level" ON "user".access_level = "access_level".id
  JOIN "volunteer_role" ON "user".volunteer_role = "volunteer_role".id
  JOIN "education_level" ON "user".highest_education_level = "education_level".id
    JOIN "ethnicity" ON "user".ethnicity = "ethnicity".id 
    JOIN "gender" ON "user".gender = "gender".id
    WHERE "volunteer_role" != 1;
`;

    pool
      .query(queryText)
      .then((dbResponse) => {
        res.send(dbResponse.rows);
      })
      .catch((err) => {
        console.log('error getting user detail data', err);
        res.sendStatus(500);
      });
  }
);

export default router;
