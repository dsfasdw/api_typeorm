import bcrypt from 'bcryptjs';
import { User } from './user.model';

interface UserParams {
    email: string;
    password: string;
    title: string;
    firstName: string;
    lastName: string;
    role: string;
}

export async function getAllUsers(): Promise<User[]> {
    return await User.findAll();
}

export async function getUserById(id: number): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return user;
}

export async function createUser(params: UserParams): Promise<void> {
    // Check if the user already exists
    if (await User.findOne({ where: { email: params.email } })) {
        throw new Error(`Email ${params.email} is already registered`);
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(params.password, 10);

    // Create a new user
    const user = await User.create({
        email: params.email,
        passwordHash: passwordHash,
        title: params.title,
        firstName: params.firstName,
        lastName: params.lastName,
        role: params.role
    });

    console.log('User created successfully:');
}
export async function updateUser(id: number, params: Partial<UserParams>): Promise<void> {
    const user = await getUserById(id);

    if (params.email && params.email !== user.email && (await User.findOne({ where: { email: params.email } }))) {
        throw new Error(`Email ${params.email} is already taken`);
    }

    if (params.password) {
        // Use 'passwordHash' instead of 'password'
        const passwordHash = await bcrypt.hash(params.password, 10);
        Object.assign(user, { ...params, passwordHash });
    } else {
        Object.assign(user, params);
    }

    await user.save();
}

export async function deleteUser(id: number): Promise<void> {
    const user = await getUserById(id);
    await user.destroy();
}