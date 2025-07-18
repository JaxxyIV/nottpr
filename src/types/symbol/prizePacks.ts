import { Drop, DropByte, EnemyGroup } from "../enums.js";

export const vanillaBytes: Record<EnemyGroup, DropByte[]> = {
    [EnemyGroup.Heart]: [
        DropByte.Heart,
        DropByte.Heart,
        DropByte.Heart,
        DropByte.Heart,
        DropByte.OneRupee,
        DropByte.Heart,
        DropByte.Heart,
        DropByte.OneRupee,
    ],
    [EnemyGroup.Rupee]: [
        DropByte.FiveRupees,
        DropByte.OneRupee,
        DropByte.FiveRupees,
        DropByte.TwentyRupees,
        DropByte.FiveRupees,
        DropByte.OneRupee,
        DropByte.FiveRupees,
        DropByte.FiveRupees,
    ],
    [EnemyGroup.Magic]: [
        DropByte.LargeMagic,
        DropByte.SmallMagic,
        DropByte.SmallMagic,
        DropByte.FiveRupees,
        DropByte.LargeMagic,
        DropByte.SmallMagic,
        DropByte.Heart,
        DropByte.SmallMagic,
    ],
    [EnemyGroup.Bomb]: [
        DropByte.OneBomb,
        DropByte.OneBomb,
        DropByte.OneBomb,
        DropByte.FourBombs,
        DropByte.OneBomb,
        DropByte.OneBomb,
        DropByte.EightBombs,
        DropByte.OneBomb,
    ],
    [EnemyGroup.Arrow]: [
        DropByte.FiveArrows,
        DropByte.Heart,
        DropByte.FiveArrows,
        DropByte.TenArrows,
        DropByte.FiveArrows,
        DropByte.Heart,
        DropByte.FiveArrows,
        DropByte.TenArrows,
    ],
    [EnemyGroup.SmallVariety]: [
        DropByte.SmallMagic,
        DropByte.OneRupee,
        DropByte.Heart,
        DropByte.FiveArrows,
        DropByte.SmallMagic,
        DropByte.OneBomb,
        DropByte.OneRupee,
        DropByte.Heart,
    ],
    [EnemyGroup.BigVariety]: [
        DropByte.Heart,
        DropByte.Fairy,
        DropByte.LargeMagic,
        DropByte.TwentyRupees,
        DropByte.EightBombs,
        DropByte.Heart,
        DropByte.TwentyRupees,
        DropByte.TenArrows,
    ],
};

export const prizePacks: Record<EnemyGroup, Drop[]> = {
    [EnemyGroup.Heart]: [
        Drop.Heart,
        Drop.Heart,
        Drop.Heart,
        Drop.Heart,
        Drop.GreenRupee,
        Drop.Heart,
        Drop.Heart,
        Drop.GreenRupee,
    ],
    [EnemyGroup.Rupee]: [
        Drop.BlueRupee,
        Drop.GreenRupee,
        Drop.BlueRupee,
        Drop.RedRupee,
        Drop.BlueRupee,
        Drop.GreenRupee,
        Drop.BlueRupee,
        Drop.BlueRupee,
    ],
    [EnemyGroup.Magic]: [
        Drop.FullMagic,
        Drop.SmallMagic,
        Drop.SmallMagic,
        Drop.BlueRupee,
        Drop.FullMagic,
        Drop.SmallMagic,
        Drop.Heart,
        Drop.SmallMagic,
    ],
    [EnemyGroup.Bomb]: [
        Drop.OneBomb,
        Drop.OneBomb,
        Drop.OneBomb,
        Drop.FourBombs,
        Drop.OneBomb,
        Drop.OneBomb,
        Drop.EightBombs,
        Drop.OneBomb,
    ],
    [EnemyGroup.Arrow]: [
        Drop.FiveArrows,
        Drop.Heart,
        Drop.FiveArrows,
        Drop.TenArrows,
        Drop.FiveArrows,
        Drop.Heart,
        Drop.FiveArrows,
        Drop.TenArrows,
    ],
    [EnemyGroup.SmallVariety]: [
        Drop.SmallMagic,
        Drop.GreenRupee,
        Drop.Heart,
        Drop.FiveArrows,
        Drop.SmallMagic,
        Drop.OneBomb,
        Drop.GreenRupee,
        Drop.Heart,
    ],
    [EnemyGroup.BigVariety]: [
        Drop.Heart,
        Drop.Fairy,
        Drop.FullMagic,
        Drop.RedRupee,
        Drop.EightBombs,
        Drop.Heart,
        Drop.RedRupee,
        Drop.TenArrows,
    ],
};