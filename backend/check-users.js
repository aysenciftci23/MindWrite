require('dotenv').config();
const { DataSource, EntitySchema } = require('typeorm');

// Entity şeması (basitleştirilmiş)
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
        password: { // Hashli şifre
            type: "varchar",
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

async function checkUser() {
    try {
        await dataSource.initialize();
        console.log("DB Connected.");

        const userRepository = dataSource.getRepository(UserSchema); // Schema nesnesini kullan
        const users = await userRepository.find();

        console.log(`Total users found: ${users.length}`);
        users.forEach(u => {
            console.log(`- User: ${u.username}, Password (Hash): ${u.password ? u.password.substring(0, 10) + '...' : 'NONE'}`);
        });

        if (users.length === 0) {
            console.log("WARNING: Users table is empty!");
        } else {
            const aysen = users.find(u => u.username === 'aysen');
            if (aysen) {
                console.log("✓ User 'aysen' exists.");
            } else {
                console.log("✕ User 'aysen' NOT found.");
            }
        }

        await dataSource.destroy();
    } catch (error) {
        console.error("Error:", error);
    }
}

checkUser();
