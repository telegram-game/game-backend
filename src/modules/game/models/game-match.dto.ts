import { SupportService } from 'src/modules/shared/services/support.service';
import { FullHero } from './hero.model.dto';
import { HeroAttribute, HeroSkill, UserProvider } from '@prisma/client';
import { configurationData } from '../../../data';
import { IsEnum, IsString } from 'class-validator';
import { AllowedProviders } from 'src/modules/auth/models/auth.dto';
import { FullGameProfile } from './game-profile.dto';

const skills = configurationData.skills;

export enum TURN {
  NONE = 'NONE',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum ProgressStepType {
  MISS = 'MISS',
  NORMAL_DAMGE = 'NORMAL_DAMGE',
  CRIT_DAMGE = 'CRIT_DAMGE',
  HEAL = 'HEAL',
  REFLECT = 'REFLECT',
  LIFE_STEAL = 'LIFE_STEAL',
}

export class AttackResult {
  isMiss?: boolean;
  isCrit?: boolean;
  defenseByReceiver?: number;
  healForAttacker?: number;
  reflectByReceiver?: number;
  totalDamage?: number;
}

export class ProgressStep {
  type: ProgressStepType;
  value: number;
  fromHeroId?: string;
  focusToHeroId?: string; // heroId
}

export class ProgressTurn {
  globalTurnNumber: number;
  heroTurnNumber: number;
  turnOf: TURN;
  steps: ProgressStep[];
  result: {
    leftHero: MinimalistMatchHero;
    rightHero: MinimalistMatchHero;
  };
}

export class BaseMatchHero {
  attackPoint: number;
  hpPoint: number;
  maxHpPoint: number;
  isDead: boolean;
  attackedCount: number;
  heroData: FullHero;

  constructor(
    hero: FullHero,
    private supportService: SupportService,
  ) {
    this.heroData = hero;

    this.attackPoint =
      hero.attack.point +
      Math.floor((hero.attack.percent * hero.attack.point) / 100);
    this.hpPoint =
      hero.hp.point + Math.floor((hero.hp.percent * hero.hp.point) / 100);
    this.maxHpPoint = this.hpPoint;
    this.isDead = false;
    this.attackedCount = 0;
  }

  calulateDamage(): { attackDamge: number; isCrit: boolean } {
    const heroData = this.heroData;
    let damge = this.attackPoint;

    // random base damage for each attach by +-2%
    const isReduce = this.supportService.randomRate(50);
    const randomIncreaseDamage = this.supportService.calculateWithPercent(
      damge,
      2,
    );
    damge = isReduce
      ? damge - randomIncreaseDamage
      : damge + randomIncreaseDamage;

    // Check the skill to calculate the damage
    const skill = skills[heroData.skill];
    if (!!skill.attributes[HeroAttribute.ATTACK]) {
      damge += this.supportService.calculateWithPointAndPercent(
        damge,
        skill.attributes[HeroAttribute.ATTACK].point,
        skill.attributes[HeroAttribute.ATTACK].percent,
      );
    }

    // Check the crit rate to calculate the damage in crit rate and skill
    const isCrit =
      this.supportService.randomRate(heroData.critRate.percent) ||
      (skill.code === HeroSkill.FATAL_BLOW &&
        this.attackedCount % skill.condition.attackedCount === 0);
    if (isCrit) {
      damge += this.supportService.calculateWithPercent(
        damge,
        heroData.critDamage.percent,
      );
    }

    return { attackDamge: damge, isCrit: isCrit };
  }

  calculateReduceDamage(damage: number): number {
    // When apply the defense, the damage will be reduced
    return damage - damage; // = 0 TODO: Implement this
  }

  calculateHealByAttack(damge: number): number {
    const heroData = this.heroData;
    const lifeStealData = {
      point: heroData.lifeSteal.point,
      percent: heroData.lifeSteal.percent,
    };

    // Dont need to be calculate by the skill because we already calculate when build the here.

    return this.supportService.calculateWithPointAndPercent(
      damge,
      lifeStealData.point,
      lifeStealData.percent,
    );
  }

  isMiss(): boolean {
    // Dont need to be calculate by the skill because we already calculate when build the here.
    return this.supportService.randomRate(this.heroData.evasion.percent);
  }

  calculateReflect(damge: number): number {
    // Dont need to be calculate by the skill because we already calculate when build the here.
    return this.supportService.calculateWithPointAndPercent(
      damge,
      this.heroData.reflect.point,
      this.heroData.reflect.percent,
    );
  }

  reCalculateHeroAttackPoint() {
    const skill = skills[this.heroData.skill];
    if (skill && skill.code === HeroSkill.RISING_FURY) {
      this.attackPoint += this.supportService.calculateWithPercent(
        this.attackPoint,
        skill.attributes[HeroAttribute.ATTACK].percentPerTime,
      );
    }
  }
}

export class MatchHero extends BaseMatchHero {
  attack(hero: MatchHero): AttackResult {
    this.attackedCount++;
    const { attackDamge: attackByAttacker, isCrit } = this.calulateDamage();
    const defenseByReceiver = hero.calculateReduceDamage(attackByAttacker);
    const totalDamage = attackByAttacker - defenseByReceiver;
    const healForAttacker = this.calculateHealByAttack(totalDamage);
    const reflectByReceiver = hero.calculateReflect(totalDamage);

    if (!isCrit) {
      const isMiss = hero.isMiss();
      if (isMiss) {
        return { isMiss: true };
      }
    }

    /*
      The priority of the attack is:
      1. Attack
      2. Defense
      3. Heal
      4. Reflect
     */
    hero.receiveDamge(totalDamage);
    this.healPoint(healForAttacker);
    this.receiveDamge(reflectByReceiver);
    this.reCalculateHeroAttackPoint();

    return {
      isMiss: false,
      isCrit: isCrit,
      defenseByReceiver: defenseByReceiver,
      healForAttacker: healForAttacker,
      reflectByReceiver: reflectByReceiver,
      totalDamage: totalDamage,
    };
  }

  receiveDamge(damge: number) {
    if (this.isDead) {
      return;
    }

    this.hpPoint -= damge;
    if (this.hpPoint <= 0) {
      this.hpPoint = 0;
      this.isDead = true;
    }
  }

  healPoint(healPoint: number) {
    if (this.isDead) {
      return;
    }

    this.hpPoint += healPoint;
    if (this.hpPoint > this.maxHpPoint) {
      this.hpPoint = this.maxHpPoint;
    }
  }

  cloneToMinimalist(): MinimalistMatchHero {
    return {
      attackPoint: this.attackPoint,
      hpPoint: this.hpPoint,
      isDead: this.isDead,
    };
  }
}

export type MinimalistMatchHero = Partial<MatchHero>;

export class GameMatchResult {
  initData: {
    leftFullProfile?: FullGameProfile;
    rightFullProfile?: FullGameProfile;
    leftHeroes: FullHero[];
    rightHeroes: FullHero[];
    maximumSteps: number;
  };
  totalTurns: number;
  lastState: {
    leftHero: MatchHero;
    rightHero: MatchHero;
  };
  winnerHeroId: string; // the heroId
  progress: ProgressTurn[];

  constructor(data?: Partial<GameMatchResult>) {
    Object.assign(this, data);
  }
}

export class FullGameMatch {
  readonly initData: {
    leftFullGameProfile?: FullGameProfile;
    rightFullGameProfile?: FullGameProfile;
    leftHeroes: FullHero[];
    rightHeroes: FullHero[];
    maximumSteps: number;
  };
  private isCompleted: boolean;
  private result?: GameMatchResult;

  constructor(
    data: Partial<FullGameMatch>,
    private readonly supportService: SupportService,
  ) {
    Object.assign(this, data, {
      isCompleted: false,
    });
  }

  run(): GameMatchResult {
    if (this.isCompleted) {
      return null;
    }

    const progressTurns: ProgressTurn[] = [];
    let currentTurn = TURN.LEFT;
    let currentTurnNumber = 0;
    const currentLeftHeros = this.initData.leftHeroes.map(
      (hero) => new MatchHero(hero, this.supportService),
    );
    const currentRightHeros = this.initData.rightHeroes.map(
      (hero) => new MatchHero(hero, this.supportService),
    );

    // First, support only 1 vs 1
    const leftHero = currentLeftHeros[0];
    const rightHero = currentRightHeros[0];

    // First turn
    progressTurns.push({
      globalTurnNumber: 0,
      heroTurnNumber: 0,
      turnOf: TURN.NONE,
      steps: [],
      result: {
        leftHero: leftHero.cloneToMinimalist(),
        rightHero: rightHero.cloneToMinimalist(),
      },
    });

    while (currentTurnNumber < this.initData.maximumSteps) {
      currentTurnNumber++;

      const { attacker, receiver } = this.getHeroByTurn(currentTurn, {
        leftHero,
        rightHero,
      });
      const result = attacker.attack(receiver);
      const progressTurn = this.buildProgressTurnByResult(result, {
        globalTurnNumber: currentTurnNumber,
        turn: currentTurn,
        leftHero: leftHero,
        rightHero: rightHero,
      });
      progressTurns.push(progressTurn);

      if (receiver.isDead || attacker.isDead) {
        break;
      }

      currentTurn = this.nextTurn(currentTurn);
    }

    this.isCompleted = true;
    this.result = new GameMatchResult({
      initData: this.initData,
      totalTurns: currentTurnNumber,
      lastState: {
        leftHero: leftHero,
        rightHero: rightHero,
      },
      winnerHeroId: this.getWinnerHero(leftHero, rightHero).heroData.id,
      progress: progressTurns,
    });
    return this.result;
  }

  getResult(): GameMatchResult {
    if (!this.isCompleted) {
      return null;
    }

    return this.result;
  }

  private getWinnerHero(leftHero: MatchHero, rightHero: MatchHero): MatchHero {
    if (leftHero.isDead) {
      return rightHero;
    }

    if (rightHero.isDead) {
      return leftHero;
    }

    // Compare the health point
    return leftHero.hpPoint > rightHero.hpPoint ? leftHero : rightHero;
  }

  private getHeroByTurn(
    turn: TURN,
    heroes: { leftHero: MatchHero; rightHero: MatchHero },
  ): { attacker: MatchHero; receiver: MatchHero } {
    return turn === TURN.LEFT
      ? { attacker: heroes.leftHero, receiver: heroes.rightHero }
      : { attacker: heroes.rightHero, receiver: heroes.leftHero };
  }

  private nextTurn(turn: TURN): TURN {
    return turn === TURN.LEFT ? TURN.RIGHT : TURN.LEFT;
  }

  private buildProgressTurnByResult(
    result: AttackResult,
    options: {
      globalTurnNumber: number;
      turn: TURN;
      leftHero: MatchHero;
      rightHero: MatchHero;
    },
  ): ProgressTurn {
    const steps: ProgressStep[] = [];
    const { attacker, receiver } = this.getHeroByTurn(options.turn, {
      leftHero: options.leftHero,
      rightHero: options.rightHero,
    });
    if (result.isMiss) {
      steps.push({
        type: ProgressStepType.MISS,
        value: 0,
        fromHeroId: attacker.heroData.id,
        focusToHeroId: receiver.heroData.id,
      });
    } else {
      if (result.totalDamage) {
        steps.push({
          type: result.isCrit
            ? ProgressStepType.CRIT_DAMGE
            : ProgressStepType.NORMAL_DAMGE,
          value: result.totalDamage,
          fromHeroId: attacker.heroData.id,
          focusToHeroId: receiver.heroData.id,
        });
      }

      if (result.healForAttacker) {
        steps.push({
          type: ProgressStepType.HEAL,
          value: result.healForAttacker,
          focusToHeroId: attacker.heroData.id,
        });
      }

      if (result.reflectByReceiver) {
        steps.push({
          type: ProgressStepType.REFLECT,
          value: result.reflectByReceiver,
          fromHeroId: receiver.heroData.id,
          focusToHeroId: attacker.heroData.id,
        });
      }
    }

    return {
      globalTurnNumber: options.globalTurnNumber,
      heroTurnNumber: attacker.attackedCount,
      turnOf: options.turn,
      steps: steps,
      result: {
        leftHero: options.leftHero.cloneToMinimalist(),
        rightHero: options.rightHero.cloneToMinimalist(),
      },
    };
  }
}

export class FightWithFriendRequest {
  @IsString()
  gameProfileId: string;

  @IsEnum(AllowedProviders)
  provider: UserProvider;

  @IsString()
  providerId: string;
}
