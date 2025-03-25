import express, { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';
import { validateRequest } from '../_middleware/validate-request';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from './user.service';
import Roles from '../_helpers/role';

const router = express.Router();

// Routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

function getAll(req: Request, res: Response, next: NextFunction) {
    getAllUsers()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction) {
    getUserById(Number(req.params.id))
        .then(user => res.json(user))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction) {
    createUser(req.body)
        .then(() => res.json({ message: 'User created' }))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction) {
    updateUser(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'User updated' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction) {
    deleteUser(Number(req.params.id))
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

// Schema validation functions
function createSchema (req:Request, res:Response, next:NextFunction ) {
  const schema:Schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role:Joi.string().valid(Roles.Admin,Roles.User).required(),
        email: Joi.string().email().required(),
        password:Joi.string().min(6).required(),
        confirmpassword:Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}
//updating the schema using PUT api 
function updateSchema(req: Request, res: Response, next: NextFunction) {
    const schema: Schema = Joi.object({
        title: Joi.string().empty(''),      
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid(Roles.Admin, Roles.User).empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmpassword: Joi.string().valid(Joi.ref('password')).empty("")
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

export default router;