import { NestFactory } from "@nestjs/core";
import { appProvider } from "../src/applications/app.provider";
import { GameProfileService } from "../src/modules/game/services/game-profile.service";
import seedData from './seed.json'
import { UserService } from "../src/modules/auth/services/user.service";
import * as random from 'random-name'
import { UserGameProfileAttribute, UserProvider } from "@prisma/client";
import '../src/types/global.type'

async function main() {
    console.log(random.first(), random.last());
    const app = await NestFactory.create(appProvider.getAppModule(), {
        cors: true,
        rawBody: true,
    });

    const { fromLevel, toLevel, numberOfLevels} = seedData.bulk;
    for (let i = fromLevel; i <= toLevel; i++) {
        for (let j = 0; j < numberOfLevels; j++) {
            try {
                const userService = await app.resolve<UserService>(UserService);
                const gameProfileService = await app.resolve<GameProfileService>(GameProfileService);
                
                const firstName = random.first();
                const lastName = random.last();
                const name = `${firstName} ${lastName}`;
                const userId = name.replaceAll(' ', '_').toLowerCase();
                const profile = {
                    provider: UserProvider.SEED,
                    providerId: userId,
                    firstName: firstName,
                    lastName: lastName,
                    email: `${userId}@gmail.com`
                }
                const level = i;
                const pocket = Math.floor(Math.random() * (i - 1));
                const salaray = level - pocket;
                const user = await userService.createOrGetFullById(userId, profile);
                const gameProfileId = await gameProfileService.createOrGetFullFirst(user.id);
                for (let j = 0; j < pocket; j++) {
                    await gameProfileService.upgradeAttribute(user.id, gameProfileId.id, UserGameProfileAttribute.POCKET, { ignoreCost: true});
                }
                for (let j = 0; j < salaray; j++) {
                    await gameProfileService.upgradeAttribute(user.id, gameProfileId.id, UserGameProfileAttribute.SALARY, { ignoreCost: true});
                }
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}

main();