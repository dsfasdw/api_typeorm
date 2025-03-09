import { AppDataSource } from '../_helpers/db';
import { User } from './user.model';
import bcrypt from 'bcryptjs';

interface UserParams {
    email: string;
    password: string;
    title: string;
    firstName: string;
    lastName: string;
    role: string;
}

const userRepository = AppDataSource.getRepository(User);

export async function getAllUsers(): Promise<User[]> {
    return await userRepository.find();
}

export async function getUserById(id: number): Promise<User> {
    const user = await userRepository.findOneBy({ id });
    if (!user) throw new Error('User not found');
    return user;
}

export async function createUser(params: UserParams): Promise<void> {
    // Check if the user already exists
    const existingUser = await userRepository.findOneBy({ email: params.email });
    if (existingUser) {
        throw new Error(`Email ${params.email} is already registered`);
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(params.password, 10);

    // Create a new user
    const user = new User();
    user.email = params.email;
    user.passwordHash = passwordHash;
    user.title = params.title;
    user.firstName = params.firstName;
    user.lastName = params.lastName;
    user.role = params.role;

    await userRepository.save(user);
    console.log('User created successfully');
}

export async function updateUser(id: number, params: Partial<UserParams>): Promise<void> {
    const user = await getUserById(id);

    if (params.email && params.email !== user.email) {
        const existingUser = await userRepository.findOneBy({ email: params.email });
        if (existingUser) {
            throw new Error(`Email ${params.email} is already taken`);
        }
    }

    if (params.password) {
        const passwordHash = await bcrypt.hash(params.password, 10);
        Object.assign(user, { ...params, passwordHash });
    } else {
        Object.assign(user, params);
    }

    await userRepository.save(user);
}

export async function deleteUser(id: number): Promise<void> {
    const user = await getUserById(id);
    await userRepository.remove(user);
}