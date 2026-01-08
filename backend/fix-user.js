require('dotenv').config();
const { DataSource, EntitySchema } = require('typeorm');
const bcrypt = require('bcrypt');

const UserSchema = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        username: {
            type: "varchar",
        },
        password: {
            type: "varchar",
        },
        isActive: {
            type: "boolean",
            default: true
        }
    },
});

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'mindWrite',
    entities: [UserSchema],
    ssl: false,
});

async function fixUser() {
    try {
        await dataSource.initialize();
        const userRepository = dataSource.getRepository(UserSchema);

        const username = 'aysen';
        const user = await userRepository.findOneBy({ username });

        if (!user) {
            console.log(`User '${username}' not found. Creating...`);
            // Create user logic if needed, but per previous check user exists
        } else {
            console.log(`User '${username}' found.`);

            // 1. Reset Password
            const newPassword = '123456';
            const hash = bcrypt.hashSync(newPassword, 10);
            user.password = hash;

            // 2. Ensure Active
            user.isActive = true;

            await userRepository.save(user);
            console.log(`Password for '${username}' has been reset to: ${newPassword}`);
            console.log(`User '${username}' is now ACTIVE.`);
        }

        await dataSource.destroy();
    } catch (error) {
        console.error("Error:", error);
    }
}

fixUser();
