import { Achievement } from "../entities/achievement.entity";

export class AchievementByUserResponse {
    achievement: Achievement

    progress: number

    isDone: boolean
}